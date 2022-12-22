import { getBestCrimeForWork } from 'imports/crimeHelpers.js'

function mirrorPlayer (ns, sleeveNo) {
  const currentWork = ns.singularity.getCurrentWork()
  if (ns.singularity.isBusy()) {
    if (currentWork.type === 'CRIME') {
      return ns.sleeve.setToCommitCrime(sleeveNo, currentWork.crimeType)
    } else if ((currentWork.type === 'COMPANY')) {
      return ns.sleeve.setToCompanyWork(sleeveNo, currentWork.companyName)
    } else if ((currentWork.type === 'FACTION')) {
      return ns.sleeve.setToFactionWork(sleeveNo, currentWork.factionName, currentWork.factionWorkType)
    }
  }
  return false
}

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
      const success = mirrorPlayer(ns, i)
      if (!success) {
        commitCrime(ns, i)
      }
    } else {
      const crime = (ns.heart.break() > -54000) ? 'Homicide' : getBestCrimeForWork(ns, false, i)
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
