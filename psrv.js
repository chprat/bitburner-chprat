/** @param {NS} ns **/
export async function main (ns) {
  ns.disableLog('purchaseServer')
  const serverLimit = ns.getPurchasedServerLimit()
  const servers = ns.getPurchasedServers()
  ns.print(`${servers.length}/${serverLimit} servers owned`)
  if (servers.length < serverLimit) {
    const ramSize = 2 ** 10
    if (ns.getPurchasedServerCost(ramSize) < ns.getPlayer().money) {
      const name = ns.purchaseServer('psrv', ramSize)
      ns.print(`Bought server ${name} with ${ns.nFormat((ramSize) * 1000 * 1000 * 1000, '0b')} RAM for ${ns.nFormat(ns.getPurchasedServerCost(ramSize), '$0.000a')}`)
    } else {
      ns.print(`Not enough money to buy a new server with ${ns.nFormat((ramSize) * 1000 * 1000 * 1000, '0b')} RAM (need ${ns.nFormat(ns.getPurchasedServerCost(ramSize), '$0.000a')})`)
    }
  } else {
    const ramSize = ns.getPurchasedServerMaxRam()
    if (ns.getPurchasedServerCost(ramSize) < ns.getPlayer().money) {
      for (const server of servers) {
        if (ns.getServerMaxRam(server) < ramSize) {
          const wasDeleted = ns.deleteServer(server)
          if (wasDeleted) {
            ns.print(`Removed server ${server}`)
          }
          const name = ns.purchaseServer('psrv', ramSize)
          ns.print(`Bought server ${name} with ${ns.nFormat((ramSize) * 1000 * 1000 * 1000, '0b')} RAM for ${ns.nFormat(ns.getPurchasedServerCost(ramSize), '$0.000a')}`)
          break
        }
      }
    } else {
      ns.print(`Not enough money to buy a new server with ${ns.nFormat((ramSize) * 1000 * 1000 * 1000, '0b')} RAM (need ${ns.nFormat(ns.getPurchasedServerCost(ramSize), '$0.000a')})`)
    }
  }
}
