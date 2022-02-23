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

export async function files (ns, server) {
  if (!ns.hasRootAccess(server)) {
    return
  }
  const ownedFiles = ns.ls('home')
  const files = ns.ls(server).filter(f => !f.endsWith('.cct'))
    .filter(f => !ownedFiles.includes(f))
  for (const file of files) {
    try {
      await ns.scp(file, server, 'home')
      ns.print('Copied ' + file + ' from ' + server)
    } catch (err) {
      ns.print('Skipped file ' + file + ' from ' + server)
      continue
    }
    if (!ns.fileExists(file, 'home')) {
      ns.print("Couldn't copy " + file + ' from ' + server)
    }
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  const boughtServers = ns.getPurchasedServers(ns)
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
    .filter(s => !boughtServers.includes(s))
  while (true) {
    for (const server of servers) {
      await files(ns, server)
    }
    await ns.sleep(600000)
  }
}
