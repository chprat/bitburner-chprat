import { recursiveScan } from 'imports/recursiveScan.js'

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
