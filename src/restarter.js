import { getFactionWithMostRepAndNG, joinedFaction } from 'imports/factionHelpers.js'
import { isAugInstalled, missingAugs } from 'imports/augmentationHelpers.js'

/** @param {NS} ns **/
export async function main (ns) {
  ns.kill('deployer.js', 'home')
  try {
    ns.stock.getSymbols()
    ns.kill('stocks.js', 'home')
    for (const sym of ns.stock.getSymbols()) {
      ns.stock.sellStock(sym, ns.stock.getMaxShares(sym))
    }
  } catch {
  }
  const factionWithMostRep = getFactionWithMostRepAndNG(ns)
  let success = true
  while (success) {
    success = ns.singularity.purchaseAugmentation(factionWithMostRep, 'NeuroFlux Governor')
  }
  const stanekFaction = 'Church of the Machine God'
  if (joinedFaction(ns, stanekFaction)) {
    const stanekAugs = missingAugs(ns, stanekFaction, false)
    for (const stanekAug of stanekAugs) {
      if (!isAugInstalled(ns, stanekAug)) {
        ns.singularity.purchaseAugmentation(stanekFaction, stanekAug)
      }
    }
  }
  ns.singularity.installAugmentations('deployer.js')
}
