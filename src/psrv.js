/** @param {NS} ns **/
export async function main (ns) {
  ns.disableLog('purchaseServer')
  ns.disableLog('getServerMaxRam')
  const serverLimit = ns.getPurchasedServerLimit()
  const servers = ns.getPurchasedServers()
  ns.print(`${servers.length}/${serverLimit} servers owned`)
  if (servers.length < serverLimit) {
    const ramSize = 2 ** 10
    if (ns.getPurchasedServerCost(ramSize) < ns.getPlayer().money) {
      const name = ns.purchaseServer('psrv', ramSize)
      ns.print(`Bought server ${name} with ${ns.formatRam(ramSize)} RAM for $${ns.formatNumber(ns.getPurchasedServerCost(ramSize))}`)
    } else {
      ns.print(`Not enough money to buy a new server with ${ns.formatRam(ramSize)} RAM (need $${ns.formatNumber(ns.getPurchasedServerCost(ramSize))})`)
    }
  } else {
    const ramSize = ns.getPurchasedServerMaxRam()
    let fullRAMServers = 0
    for (const server of servers) {
      if (ns.getServerMaxRam(server) === ramSize) {
        fullRAMServers += 1
      }
    }
    ns.print(`${fullRAMServers}/${serverLimit} servers with full RAM capacity owned`)
    if (ns.getPurchasedServerCost(ramSize) < ns.getPlayer().money) {
      for (const server of servers) {
        if (ns.getServerMaxRam(server) < ramSize) {
          const killedAllScripts = ns.killall(server)
          if (killedAllScripts) {
            ns.print(`Killed all scripts on server ${server}`)
          }
          const wasDeleted = ns.deleteServer(server)
          if (wasDeleted) {
            ns.print(`Removed server ${server}`)
          }
          const name = ns.purchaseServer('psrv', ramSize)
          if (name === '') {
            ns.print("Couldn't buy a new server!")
          } else {
            ns.print(`Bought server ${name} with ${ns.formatRam(ramSize)} RAM for $${ns.formatNumber(ns.getPurchasedServerCost(ramSize))}`)
          }
          break
        }
      }
    } else {
      ns.print(`Not enough money to buy a new server with ${ns.formatRam(ramSize)} RAM (need $${ns.formatNumber(ns.getPurchasedServerCost(ramSize))})`)
    }
  }
}
