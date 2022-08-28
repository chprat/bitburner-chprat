import { getFactionWithMostRep } from 'imports/factionHelpers.js'

/** @param {NS} ns **/
export async function main (ns) {
  ns.kill('deployer.js', 'home')
  try {
    ns.stock.getSymbols()
    ns.kill('trader.js', 'home')
    for (const sym of ns.stock.getSymbols()) {
      ns.stock.sellStock(sym, ns.stock.getMaxShares(sym))
    }
  } catch {
  }
  const factionWithMostRep = getFactionWithMostRep(ns)
  let success = true
  while (success) {
    success = ns.singularity.purchaseAugmentation(factionWithMostRep, 'NeuroFlux Governor')
  }
  ns.singularity.installAugmentations('deployer.js')
}
