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
  const threads = ns.args[1]
  const restart = ns.args[2]
  const scriptArgs = ns.args.slice(3)
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
  for (const server of servers) {
    if (ns.hasRootAccess(server)) {
      if (ns.scriptRunning(script, server) && restart === 'y') {
        ns.scriptKill(script, server)
      }
      await ns.scp(script, server)
      const threadNum = threads === 0 ? Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(script)) : threads
      if (threadNum > 0) {
        if (restart === 'y') {
          ns.exec(script, server, threadNum, ...scriptArgs)
        }
      } else {
        ns.print('Not enough memory to run on ' + server)
      }
    }
  }
}
