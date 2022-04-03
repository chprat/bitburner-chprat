import { listServers } from 'imports/scanner.js'

export async function hack (ns, server) {
  if (!ns.hasRootAccess(server)) {
    return
  }
  if (ns.getServerMaxMoney === 0) {
    return
  }
  const hackingLevel = ns.getHackingLevel()
  const serverHackingLevel = ns.getServerRequiredHackingLevel(server)
  if (hackingLevel < serverHackingLevel) {
    return
  }
  const moneyThresh = Math.floor(ns.getServerMaxMoney(server) * 0.75)
  const securityThresh = Math.floor(ns.getServerMinSecurityLevel(server) * 1.25)
  const currentMoney = Math.floor(ns.getServerMoneyAvailable(server))
  const serverSecurityLevel = Math.floor(ns.getServerSecurityLevel(server))
  if (serverSecurityLevel > securityThresh) {
    ns.print('SecurityLevel: ' + serverSecurityLevel + ' > ' + securityThresh)
    await ns.weaken(server)
  } else if (currentMoney < moneyThresh) {
    ns.print(`Money: ${ns.nFormat(currentMoney, '$0.000a')} < ${ns.nFormat(moneyThresh, '$0.000a')}`)
    await ns.grow(server)
  } else {
    await ns.hack(server)
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  ns.disableLog('sleep')
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
    .filter(s => s !== ns.getHostname())
    .filter(s => !s.includes('psrv'))
  while (true) {
    for (const server of servers) {
      await hack(ns, server)
    }
    await ns.sleep(1000)
  }
}
