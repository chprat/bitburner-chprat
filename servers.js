function scan (ns, parent, server, list) {
  const children = ns.scan(server)
  for (const child of children) {
    if (parent === child) {
      continue
    }
    list.push(child)
    scan(ns, server, child, list)
  }
}

export function listServers (ns) {
  const list = []
  ns.disableLog('scan')
  scan(ns, '', 'home', list)
  ns.enableLog('scan')
  return list
}

/** @param {NS} ns **/
export async function main (ns) {
  const boughtServers = ns.getPurchasedServers(ns)
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
    .filter(s => !boughtServers.includes(s))
    .filter(s => ns.getServerRequiredHackingLevel(s) >= ns.getHackingLevel())
    .map((s) => {
      return [ns.getServerRequiredHackingLevel(s), s]
    })
    .sort(function (a, b) {
      if (a[0] === b[0]) {
        return 0
      } else {
        return (a[0] > b[0]) ? -1 : 1
      }
    })
  for (const server of servers) {
    ns.tprint(server)
  }
}
