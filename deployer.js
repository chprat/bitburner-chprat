import { listServers } from 'imports/scanner.js'

export async function deploy (ns, serverName, scriptName, threads, restart, ...scriptArgs) {
  if (ns.hasRootAccess(serverName)) {
    const running = ns.scriptRunning(scriptName, serverName)
    if (running && restart !== 'y') {
      return
    }
    if (running && restart === 'y') {
      ns.scriptKill(scriptName, serverName)
    }
    await ns.scp(scriptName, serverName)
    const threadNum = threads === 0 ? Math.floor((ns.getServerMaxRam(serverName) - ns.getServerUsedRam(serverName)) / ns.getScriptRam(scriptName)) : threads
    if (threadNum > 0) {
      if (restart === 'y' || !running) {
        ns.exec(scriptName, serverName, threadNum, ...scriptArgs)
        ns.print(`Executed ${scriptName} on ${serverName} with ${threadNum} threads`)
      }
    } else if (threadNum !== -1) {
      ns.print(`Not enough memory to run ${scriptName} on ${serverName} (${ns.getServerMaxRam(serverName)} GB RAM available)`)
    }
  }
}

export async function runAndWait (ns, script, server) {
  const pid = ns.run(script.name, script.threads)
  if (pid === 0) {
    ns.print(`Error running script ${script.name}`)
  } else {
    while (ns.scriptRunning(script.name, server)) {
      await ns.sleep(10)
    }
  }
  return pid
}

export async function onHome (ns) {
  const scripts = [
    { name: 'bootstrapper.js', threads: 1, mem: 0 },
    { name: 'rooter.js', threads: 1, mem: 0 },
    { name: 'hacker.js', threads: 0, mem: 0 },
    { name: 'deployer.js', threads: 1, mem: 0 },
    { name: 'solver.js', threads: 1, mem: 0 },
    { name: 'trader.js', threads: 0, mem: 0 },
    { name: 'corp.js', threads: 0, mem: 0 },
    { name: 'gang.js', threads: 1, mem: 0 },
    { name: 'psrv.js', threads: 1, mem: 0 },
    { name: 'upgrader.js', threads: 1, mem: 0 },
    { name: 'sleever.js', threads: 1, mem: 0 },
    { name: 'worker.js', threads: 1, mem: 0 },
    { name: 'backdoorer.js', threads: 1, mem: 0 },
    { name: 'joiner.js', threads: 1, mem: 0 },
    { name: 'buyer.js', threads: 1, mem: 0 },
    { name: 'hacknet.js', threads: 1, mem: 0 },
    { name: 'autoRestarter.js', threads: 1, mem: 0 }
  ]
  const optionalScripts = ['trader.js', 'corp.js']
  const waitForScripts = [
    'bootstrapper.js',
    'solver.js',
    'gang.js',
    'hacknet.js',
    'psrv.js',
    'upgrader.js',
    'buyer.js',
    'backdoorer.js',
    'joiner.js',
    'worker.js',
    'sleever.js',
    'autoRestarter.js'
  ]
  for (const script of scripts) {
    script.mem = ns.getScriptRam(script.name)
  }
  const waitForScriptsRAM = []
  for (const waitForScript of waitForScripts) {
    if (waitForScript === 'bootstrapper.js' && ns.getServerMaxRam('home') >= 64) {
      continue
    }
    waitForScriptsRAM.push(scripts.find(e => e.name === waitForScript).mem)
  }
  const maxWaitForScriptsRAM = Math.max(...waitForScriptsRAM)
  const homeRAM = ns.getServerMaxRam('home')
  let scriptRAM = scripts.find(e => e.name === 'rooter.js').mem
  scriptRAM += scripts.find(e => e.name === 'hacker.js').mem
  scriptRAM += scripts.find(e => e.name === 'deployer.js').mem
  scriptRAM += maxWaitForScriptsRAM
  let freeRAM = homeRAM - scriptRAM
  for (const optionalScript of optionalScripts) {
    if (freeRAM > scripts.find(e => e.name === optionalScript).mem) {
      scripts.find(e => e.name === optionalScript).threads = 1
      scriptRAM += scripts.find(e => e.name === optionalScript).mem
      freeRAM = homeRAM - scriptRAM
    }
  }
  const hackThreads = Math.floor(freeRAM / scripts.find(e => e.name === 'hacker.js').mem) - 1
  scripts.find(e => e.name === 'hacker.js').threads = (hackThreads > 1) ? hackThreads : 1
  for (const script of scripts) {
    if (!ns.scriptRunning(script.name, 'home')) {
      if (script.threads > 0) {
        let pid
        if (waitForScripts.includes(script.name)) {
          if (script.name === 'bootstrapper.js' && ns.getServerMaxRam('home') >= 64) {
            continue
          }
          pid = await runAndWait(ns, script, 'home')
        } else {
          pid = ns.run(script.name, script.threads)
        }
        if (pid === 0) {
          ns.print(`Error running script ${script.name}`)
        }
      }
    }
    if (script.name === 'hacker.js') {
      const activeHackThreads = ns.getRunningScript('hacker.js') !== undefined ? ns.getRunningScript('hacker.js').threads : 0
      if (activeHackThreads !== script.threads) {
        ns.kill(script.name, 'home')
        const pid = ns.run(script.name, script.threads)
        if (pid === 0) {
          ns.print(`Error running script ${script.name}`)
        }
      }
    }
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  ns.disableLog('sleep')
  ns.disableLog('scp')
  ns.disableLog('getServerMaxRam')
  ns.disableLog('getServerUsedRam')
  ns.disableLog('exec')
  ns.disableLog('run')
  const script = ns.args[0]
  const threads = ns.args[1]
  const restart = ns.args[2]
  const scriptArgs = ns.args.slice(3)
  if (script !== undefined) {
    const servers = listServers(ns).filter(s => s !== 'darkweb')
      .filter(s => s !== 'home')
      .filter(s => !s.includes('hacknet-node'))
    for (const serverName of servers) {
      deploy(ns, serverName, script, threads, restart, scriptArgs)
    }
  } else {
    while (true) {
      const servers = listServers(ns).filter(s => s !== 'darkweb')
        .filter(s => s !== 'home')
        .filter(s => !s.includes('hacknet-node'))
      await onHome(ns)
      for (const serverName of servers) {
        await deploy(ns, serverName, '/imports/scanner.js', -1)
        await deploy(ns, serverName, 'hacker.js', 0)
      }
      const sleepTime = (Math.floor(ns.getTimeSinceLastAug() / (1000 * 60)) < 30) ? 60000 : 600000
      await ns.sleep(sleepTime)
    }
  }
}
