import { listServers } from 'imports/scanner.js'

/** @param {NS} ns **/
export async function hack (ns, serverName) {
  const server = ns.getServer(serverName)
  if (!server.hasAdminRights) {
    return
  }
  if (server.moneyMax === 0) {
    return
  }
  if (ns.getHackingLevel() < server.requiredHackingSkill) {
    return
  }
  const moneyThresh = Math.floor(server.moneyMax * 0.75)
  const securityThresh = Math.floor(server.minDifficulty * 1.25)
  if (server.hackDifficulty > securityThresh) {
    await ns.weaken(serverName)
    const newServerSecurityLevel = ns.getServerSecurityLevel(serverName)
    ns.print(`${serverName} weakened by ${Math.floor(server.hackDifficulty - newServerSecurityLevel)} to ${Math.floor(newServerSecurityLevel)} in ${ns.tFormat(ns.getWeakenTime(serverName))}`)
  } else if (server.moneyAvailable < moneyThresh) {
    await ns.grow(serverName)
    const newCurrentMoney = ns.getServerMoneyAvailable(serverName)
    ns.print(`${serverName} growed by $${ns.formatNumber(newCurrentMoney - server.moneyAvailable)} to $${ns.formatNumber(newCurrentMoney)} in ${ns.tFormat(ns.getGrowTime(serverName))}`)
  } else {
    const hacked = await ns.hack(serverName)
    ns.print(`${serverName} hacked by $${ns.formatNumber(hacked)} to $${ns.formatNumber(ns.getServerMoneyAvailable(serverName))} in ${ns.tFormat(ns.getHackTime(serverName))}`)
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  ns.disableLog('sleep')
  ns.disableLog('getHackingLevel')
  ns.disableLog('getServerRequiredHackingLevel')
  ns.disableLog('weaken')
  ns.disableLog('hack')
  ns.disableLog('grow')
  ns.disableLog('getServerMinSecurityLevel')
  ns.disableLog('getServerSecurityLevel')
  ns.disableLog('getServerMaxMoney')
  ns.disableLog('getServerMoneyAvailable')
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
