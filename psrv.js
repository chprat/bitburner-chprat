/** @param {NS} ns **/
export async function main (ns) {
  const buy = ns.args[0]
  ns.tprint('Limit: ' + ns.getPurchasedServerLimit())
  const servers = ns.getPurchasedServers()
  ns.tprint('Servers: ' + servers.length + ' ' + servers)
  const maxRAM = ns.getPurchasedServerMaxRam()
  const stages = Math.log2(maxRAM)
  for (let i = 1; i <= stages; ++i) {
    ns.tprint(`${ns.nFormat(i, '00')}: ${ns.nFormat((2 ** i) * 1000 * 1000 * 1000, '0b')} RAM costs ${ns.nFormat(ns.getPurchasedServerCost(2 ** i), '$0.000a')}`)
  }
  if (buy) {
    ns.purchaseServer('psrv', 2 ** buy)
    ns.tprint(`Bought a server with ${ns.nFormat((2 ** buy) * 1000 * 1000 * 1000, '0b')} RAM`)
  }
}
