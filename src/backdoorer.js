import { recursiveScan } from 'imports/recursiveScan.js'
import { HackingFactions, MegaCorpFactions } from 'imports/factionHelpers.js'

/** @param {NS} ns **/
function connectTo (ns, route, server) {
  route.shift()
  for (const node of route) {
    const success = ns.singularity.connect(node)
    if (!success) {
      ns.print(`Failed to connect to ${node}`)
    }
  }
  if (ns.singularity.getCurrentServer() !== server) {
    ns.print(`Connection to ${server} failed`)
  }
}

/** @param {NS} ns **/
async function backdoorServer (ns, server, faction) {
  ns.print(`No backdoor installed on ${server.hostname}`)
  let route = []
  recursiveScan(ns, '', 'home', faction.server, route)
  connectTo(ns, route, faction.server)
  await ns.singularity.installBackdoor()
  route = []
  recursiveScan(ns, '', ns.singularity.getCurrentServer(), 'home', route)
  connectTo(ns, route, 'home')
}

/** @param {NS} ns **/
async function backdoorFactionServers (ns, factions) {
  for (const faction of factions) {
    if (faction.server === '') {
      continue
    }
    const server = ns.getServer(faction.server)
    if (server.hasAdminRights) {
      ns.print(`We have admin rights on ${server.hostname}`)
      if (!server.backdoorInstalled) {
        await backdoorServer(ns, server, faction)
        await ns.sleep(30000)
      } else {
        ns.print(`Backdoor already installed on ${server.hostname}`)
      }
    } else {
      ns.print(`We do not have admin rights on ${server.hostname}`)
    }
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  for (const faction of [HackingFactions, MegaCorpFactions]) {
    await backdoorFactionServers(ns, faction)
  }
}
