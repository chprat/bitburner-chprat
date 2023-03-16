import { listServers } from 'imports/scanner.js'

export async function deploy (ns, serverName, scriptName, threads, ...scriptArgs) {
  if (ns.hasRootAccess(serverName)) {
    await ns.scp(scriptName, serverName)
    const threadNum = threads === 0 ? Math.floor((ns.getServerMaxRam(serverName) - ns.getServerUsedRam(serverName)) / ns.getScriptRam(scriptName)) : threads
    if (threadNum > 0) {
      for (let i = 0; i < threadNum; ++i) {
        ns.exec(scriptName, serverName, 1, i)
        await ns.sleep(1000)
      }
      ns.print(`Executed ${scriptName} on ${serverName} with ${threadNum} threads`)
    } else if (threadNum !== -1) {
      ns.print(`Not enough memory to run ${scriptName} on ${serverName} (${ns.getServerMaxRam(serverName)} GB RAM available)`)
    }
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  const servers = listServers(ns).filter(s => s !== 'darkweb')
  for (const serverName of servers) {
    await deploy(ns, serverName, 'idler.js', 0)
  }
}
