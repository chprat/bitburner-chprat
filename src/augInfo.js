import { getAllFactionsWithMissingAugs } from 'imports/factionHelpers.js'
import { getAllMissingAugs } from 'imports/augmentationHelpers.js'

/** @param {NS} ns **/
export async function main (ns) {
  const factionsWithMissingAugs = getAllFactionsWithMissingAugs(ns, false)
  ns.tprint(`${factionsWithMissingAugs.length} Factions with missing augs: ${factionsWithMissingAugs}`)
  ns.tprint('')
  const factionsWithMissingNecessaryAugs = getAllFactionsWithMissingAugs(ns)
  ns.tprint(`${factionsWithMissingNecessaryAugs.length} Factions with missing necessary augs: ${factionsWithMissingNecessaryAugs}`)
  ns.tprint('')
  const missingAugs = getAllMissingAugs(ns, factionsWithMissingAugs)
  const missingNecessaryAugs = missingAugs.filter(e => e.necessary === true)
  const missingUnnecessaryAugs = missingAugs.filter(e => e.necessary === false)
  ns.tprint(`${missingNecessaryAugs.length} augs still necessary`)
  for (const aug of missingNecessaryAugs) {
    ns.tprint(`${aug.name}: ${aug.stats} (${aug.factions})`)
  }
  ns.tprint('')
  ns.tprint(`${missingUnnecessaryAugs.length} augs unnecessary`)
  for (const aug of missingUnnecessaryAugs) {
    ns.tprint(`${aug.name}: ${aug.stats} (${aug.factions})`)
  }
}
