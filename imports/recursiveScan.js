export function recursiveScan (ns, parent, server, target, route) {
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
