import { listServers } from 'imports/scanner.js'

/** @param {NS} ns **/
export async function main (ns) {
  const script = ns.args[0]
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
  for (const server of servers) {
    if (ns.hasRootAccess(server)) {
      if (ns.ls(server).find(f => f === script)) {
        if (ns.scriptRunning(script, server)) {
          ns.scriptKill(script, server)
          ns.tprint('Killed ' + script + ' on ' + server)
        }
      }
    }
  }
}
