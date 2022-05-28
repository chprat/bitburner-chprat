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

export async function onHome (ns) {
  const scripts = [{ name: 'rooter.js', threads: 1, mem: 0 },
    { name: 'deployer.js', threads: 1, mem: 0 },
    { name: 'solver.js', threads: 0, mem: 0 },
    { name: 'hacker.js', threads: 0, mem: 0 },
    { name: 'trader.js', threads: 0, mem: 0 }]
  for (const script of scripts) {
    script.mem = ns.getScriptRam(script.name)
  }
  const homeRAM = ns.getServerMaxRam('home')
  let scriptRAM = scripts.find(e => e.name === 'rooter.js').mem
  scriptRAM += scripts.find(e => e.name === 'hacker.js').mem
  scriptRAM += scripts.find(e => e.name === 'deployer.js').mem
  let freeRAM = homeRAM - scriptRAM
  if (freeRAM > scripts.find(e => e.name === 'solver.js').mem) {
    scripts.find(e => e.name === 'solver.js').threads = 1
    scriptRAM += scripts.find(e => e.name === 'solver.js').mem
    freeRAM = homeRAM - scriptRAM
  }
  if (freeRAM > scripts.find(e => e.name === 'trader.js').mem) {
    scripts.find(e => e.name === 'trader.js').threads = 1
    scriptRAM += scripts.find(e => e.name === 'trader.js').mem
    freeRAM = homeRAM - scriptRAM
  }
  const hackThreads = Math.floor(freeRAM / scripts.find(e => e.name === 'hacker.js').mem) - 1
  scripts.find(e => e.name === 'hacker.js').threads = (hackThreads > 1) ? hackThreads : 1
  for (const script of scripts) {
    if (!ns.scriptRunning(script.name, 'home')) {
      if (script.threads > 0) { ns.run(script.name, script.threads) }
    }
    if (script.name === 'hacker.js') {
      const activeHackThreads = ns.getRunningScript('hacker.js').threads
      if (activeHackThreads !== script.threads) {
        ns.kill(script.name, 'home')
        ns.run(script.name, script.threads)
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
    for (const serverName of servers) {
      deploy(ns, serverName, script, threads, restart, scriptArgs)
    }
  } else {
    while (true) {
      const servers = listServers(ns).filter(s => s !== 'darkweb')
        .filter(s => s !== 'home')
      onHome(ns)
      for (const serverName of servers) {
        await deploy(ns, serverName, '/imports/scanner.js', -1)
        await deploy(ns, serverName, 'hacker.js', 0)
      }
      const sleepTime = (Math.floor(ns.getTimeSinceLastAug() / (1000 * 60)) < 30) ? 60000 : 600000
      await ns.sleep(sleepTime)
    }
  }
}
