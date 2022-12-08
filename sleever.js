import { getCrimeForWork } from 'imports/crimeHelpers.js'

/** @param {NS} ns **/
export async function main (ns) {
  const sleeveAmount = ns.sleeve.getNumSleeves()
  for (let i = 0; i < sleeveAmount; i++) {
    const sleeveStats = ns.sleeve.getSleeveStats(i)
    if (sleeveStats.shock > 0) {
      ns.sleeve.setToShockRecovery(i)
      continue
    }
    if (sleeveStats.sync < 100) {
      ns.sleeve.setToSynchronize(i)
      continue
    }

    if (i === 0) {
      const currentWork = ns.singularity.getCurrentWork()
      if (ns.singularity.isBusy()) {
        if (currentWork.type === 'CRIME') {
          ns.sleeve.setToCommitCrime(i, currentWork.crimeType)
        } else if ((currentWork.type === 'COMPANY')) {
          ns.sleeve.setToCompanyWork(i, currentWork.companyName)
        } else if ((currentWork.type === 'FACTION')) {
          ns.sleeve.setToFactionWork(i, currentWork.factionName, currentWork.factionWorkType)
        }
      }
    } else {
      const crime = (ns.heart.break() > -54000) ? 'Homicide' : getCrimeForWork(ns)
      if (!ns.sleeve.setToCommitCrime(i, crime)) {
        ns.print(`Couldn't set sleeve ${i} to commit crime ${crime}`)
      }
    }

    for (const aug of ns.sleeve.getSleevePurchasableAugs(i)) {
      if (ns.getPlayer().money > aug.cost) {
        ns.sleeve.purchaseSleeveAug(i, aug.name)
      }
    }
  }
}
