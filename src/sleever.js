import { getBestCrimeForWork } from 'imports/crimeHelpers.js'
import { getCompanies, joinedFaction } from 'imports/factionHelpers.js'
import { isAugInstalled } from 'imports/augmentationHelpers.js'

function mirrorPlayer (ns, sleeveNo) {
  const currentWork = ns.singularity.getCurrentWork()
  if (ns.singularity.isBusy()) {
    if (currentWork.type === 'CRIME') {
      return ns.sleeve.setToCommitCrime(sleeveNo, currentWork.crimeType)
    } else if ((currentWork.type === 'COMPANY')) {
      let alreadyWorking = false
      for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        const task = ns.sleeve.getTask(i)
        if (task !== null && task.type === 'COMPANY' && task.companyName === currentWork.companyName && i !== sleeveNo) {
          alreadyWorking = true
          break
        }
      }
      if (!alreadyWorking) {
        return ns.sleeve.setToCompanyWork(sleeveNo, currentWork.companyName)
      }
    } else if ((currentWork.type === 'FACTION')) {
      let alreadyWorking = false
      for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        const task = ns.sleeve.getTask(i)
        if (task !== null && task.type === 'FACTION' && task.factionName === currentWork.factionName && i !== sleeveNo) {
          alreadyWorking = true
          break
        }
      }
      if (!alreadyWorking) {
        return ns.sleeve.setToFactionWork(sleeveNo, currentWork.factionName, currentWork.factionWorkType)
      }
    }
  }
  return false
}

function commitCrime (ns, sleeveNo) {
  let suggestedCrime = getBestCrimeForWork(ns, false, sleeveNo)
  const p = ns.sleeve.getSleeve(sleeveNo)
  const suggestedCrimeChance = ns.formulas.work.crimeSuccessChance(p, suggestedCrime)
  if (suggestedCrime === 'Homicide' && suggestedCrimeChance === 1) {
    if (ns.formulas.work.crimeSuccessChance(p, 'Grand Theft Auto') > 0.4) {
      suggestedCrime = 'Grand Theft Auto'
    }
  }
  const crime = (ns.heart.break() > -54000) ? 'Homicide' : suggestedCrime
  if (!ns.sleeve.setToCommitCrime(sleeveNo, crime)) {
    ns.print(`Couldn't set sleeve ${sleeveNo} to commit crime ${crime}`)
  }
}

function companyWork (ns, sleeveNo) {
  let job = 'IT'
  if (ns.getPlayer().skills.charisma >= 250) {
    job = 'Business'
  }
  const companies = getCompanies(ns)
  for (const company of companies) {
    if (company === 'Fulcrum Technologies') {
      if (!ns.getServer('fulcrumassets').backdoorInstalled) {
        continue
      }
    }
    let factionJoined = joinedFaction(ns, company)
    if (company === 'Fulcrum Technologies') {
      factionJoined = joinedFaction(ns, 'Fulcrum Secret Technologies')
    }
    if (!factionJoined || company === companies[companies.length - 1]) {
      let alreadyWorking = false
      for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        const task = ns.sleeve.getTask(i)
        if (task !== null && task.type === 'COMPANY' && task.companyName === company && i !== sleeveNo) {
          alreadyWorking = true
          break
        }
      }
      if (alreadyWorking) {
        continue
      }
      const title = ns.getPlayer().jobs[company]
      let success = ns.singularity.applyToCompany(company, job)
      if (title === null) {
        if (success) {
          ns.print(`Applied at ${company} as ${ns.getPlayer().jobs[company]}`)
        } else {
          ns.print(`Couldn't apply at ${company} in ${job} field`)
          return false
        }
      } else {
        if (success) {
          ns.print(`Got promoted to ${ns.getPlayer().jobs[company]} at ${company}`)
        }
      }
      success = ns.sleeve.setToCompanyWork(sleeveNo, company)
      if (!success) {
        ns.print(`Couldn't start working for ${company}`)
        return false
      } else {
        return true
      }
    }
  }
}

function hacking (ns, sleeveNo) {
  const factions = ns.getPlayer().factions
  for (const faction of factions) {
    let alreadyWorking = false
    for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
      const task = ns.sleeve.getTask(i)
      if (task !== null && task.type === 'FACTION' && task.factionName === faction && i !== sleeveNo) {
        alreadyWorking = true
        break
      }
    }
    if (!alreadyWorking) {
      const success = ns.sleeve.setToFactionWork(sleeveNo, faction, 'Hacking Contracts')
      if (success) {
        return true
      }
    }
  }
  return false
}

/** @param {NS} ns **/
export async function main (ns) {
  const sleeveAmount = ns.sleeve.getNumSleeves()
  for (let i = 0; i < sleeveAmount; i++) {
    const sleeveStats = ns.sleeve.getSleeve(i)
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
    } else if (i === 1) {
      const success = companyWork(ns, i)
      if (!success) {
        commitCrime(ns, i)
      }
    } else if (i === 2) {
      const success = hacking(ns, i)
      if (!success) {
        commitCrime(ns, i)
      }
    } else {
      if (isAugInstalled(ns, 'The Red Pill') && (ns.getHackingLevel() < ns.getServerRequiredHackingLevel('w0r1d_d43m0n'))) {
        hacking(ns, i)
      } else {
        commitCrime(ns, i)
      }
    }

    for (const aug of ns.sleeve.getSleevePurchasableAugs(i)) {
      if (ns.getPlayer().money > aug.cost) {
        ns.sleeve.purchaseSleeveAug(i, aug.name)
      }
    }
  }
}
