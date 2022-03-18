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

export async function weaken (ns, server) {
  if (!ns.hasRootAccess(server)) {
    return
  }
  const hackingLevel = ns.getHackingLevel()
  const serverHackingLevel = ns.getServerRequiredHackingLevel(server)
  if (hackingLevel < serverHackingLevel) {
    return
  }
  await ns.weaken(server)
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
      await weaken(ns, server)
    }
    await ns.sleep(1000)
  }
}
