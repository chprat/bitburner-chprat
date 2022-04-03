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
      ns.print(`Not enough memory to run ${scriptName} on ${serverName}`)
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
  const script = ns.args[0]
  const threads = ns.args[1]
  const restart = ns.args[2]
  const scriptArgs = ns.args.slice(3)
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
  if (script !== undefined) {
    for (const serverName of servers) {
      deploy(ns, serverName, script, threads, restart, scriptArgs)
    }
  } else {
    while (true) {
      for (const serverName of servers) {
        await deploy(ns, serverName, '/imports/scanner.js', -1)
        await deploy(ns, serverName, 'hacker.js', 0)
      }
      await ns.sleep(600000)
    }
  }
}
