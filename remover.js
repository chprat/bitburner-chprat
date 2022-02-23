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
  const script = ns.args[0]
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
  for (const server of servers) {
    if (ns.hasRootAccess(server)) {
      if (ns.ls(server).find(f => f === script)) {
        if (ns.scriptRunning(script, server)) {
          ns.scriptKill(script, server)
        }
        ns.rm(script, server)
        ns.tprint('Removed ' + script + ' from ' + server)
      }
    }
  }
}
