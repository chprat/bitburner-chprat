function recursiveScan (ns, parent, server, target, route) {
  const children = ns.scan(server)
  for (const child of children) {
    if (parent === child) {
      continue
    }
    if (child === target) {
      route.unshift(child)
      route.unshift(server)
      return true
    }
    if (recursiveScan(ns, server, child, target, route)) {
      route.unshift(server)
      return true
    }
  }
  return false
}

/** @param {NS} ns **/
export async function main (ns) {
  const route = []
  const server = ns.args[0]
  recursiveScan(ns, '', 'home', server, route)
  route.shift()
  ns.tprint('connect ' + route.join('; connect '))
}

export function autocomplete (data, args) {
  return data.servers
}
