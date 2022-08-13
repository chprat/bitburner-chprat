import { getFactionsSortedByMissingRep, getCompanies, joinedFaction } from 'imports/factionHelpers.js'
import { hasMissingAugs, isAugInstalled } from 'imports/augmentationHelpers.js'

let focus = true

function doFactionWork (ns) {
  ns.print('Check if we need to do faction work')
  ns.singularity.stopAction()
  const factions = getFactionsSortedByMissingRep(ns)
  for (const faction of factions) {
    if (!hasMissingAugs(ns, faction.name)) {
      ns.print(`We don't need any augmentations from ${faction.name}`)
      continue
    }
    if (faction.missingRep <= 0) {
      ns.print(`We don't need more reputation for ${faction.name}`)
      continue
    }
    let success = false
    const doFieldWork = ns.getPlayer().charisma < 250
    if (doFieldWork) {
      success = ns.singularity.workForFaction(faction.name, 'Field Work', focus)
    }
    if (!success) {
      if (doFieldWork) {
        ns.print(`${faction.name} doesn't offer Field Work, trying Hacking Contracts`)
      }
      success = ns.singularity.workForFaction(faction.name, 'Hacking Contracts', focus)
      if (!success) {
        ns.print(`Couldn't start working for ${faction.name}`)
      }
    }
    break
  }
}

function doCompanyWork (ns) {
  ns.print('Check if we need to do company work')
  let success = false
  let job = 'IT'
  if (ns.getPlayer().charisma >= 250) {
    job = 'Business'
  }
  ns.singularity.stopAction()
  for (const company of getCompanies(ns)) {
    if (company === 'Fulcrum Technologies') {
      if (!ns.getServer('fulcrumassets').backdoorInstalled) {
        continue
      }
    }
    let factionJoined = joinedFaction(ns, company)
    if (company === 'Fulcrum Technologies') {
      factionJoined = joinedFaction(ns, 'Fulcrum Secret Technologies')
    }
    if (!factionJoined) {
      const title = ns.getPlayer().jobs[company]
      success = ns.singularity.applyToCompany(company, job)
      if (title === null) {
        if (success) {
          ns.print(`Applied at ${company} as ${ns.getPlayer().jobs[company]}`)
        } else {
          ns.print(`Couldn't apply at ${company} in ${job} field`)
          break
        }
      } else {
        if (success) {
          ns.print(`Got promoted to ${ns.getPlayer().jobs[company]} at ${company}`)
        }
      }
      success = ns.singularity.workForCompany(company, focus)
      if (!success) {
        ns.print(`Couldn't start working for ${company}`)
      } else {
        break
      }
    }
  }
}

function buyOrCreateProgram (ns) {
  ns.print('Check if we need a program')
  const programs = [
    { name: 'BruteSSH.exe', exists: false },
    { name: 'FTPCrack.exe', exists: false },
    { name: 'relaySMTP.exe', exists: false },
    { name: 'HTTPWorm.exe', exists: false },
    { name: 'SQLInject.exe', exists: false }
  ]
  programs.find(e => e.name === 'BruteSSH.exe').exists = ns.fileExists('BruteSSH.exe', 'home')
  programs.find(e => e.name === 'FTPCrack.exe').exists = ns.fileExists('FTPCrack.exe', 'home')
  programs.find(e => e.name === 'relaySMTP.exe').exists = ns.fileExists('relaySMTP.exe', 'home')
  programs.find(e => e.name === 'HTTPWorm.exe').exists = ns.fileExists('HTTPWorm.exe', 'home')
  programs.find(e => e.name === 'SQLInject.exe').exists = ns.fileExists('SQLInject.exe', 'home')
  const hasTor = ns.singularity.purchaseTor()
  ns.singularity.stopAction()
  for (const program of programs) {
    if (program.exists) {
      continue
    }
    if (program.name === 'SQLInject.exe') {
      if (!isAugInstalled(ns, 'The Red Pill')) {
        continue
      }
    }
    if (hasTor) {
      const canAfford = ns.singularity.getDarkwebProgramCost(program.name) <= ns.getPlayer().money
      if (canAfford) {
        const success = ns.singularity.purchaseProgram(program.name)
        if (!success) {
          ns.print(`Failed buying ${program.name}`)
        } else {
          ns.print(`Bought ${program.name}`)
          continue
        }
      } else {
        ns.print(`${program.name} is to expensive`)
      }
    }
    const success = ns.singularity.createProgram(program.name, focus)
    if (!success) {
      ns.print(`Couldn't start working on ${program.name}`)
    } else {
      ns.print(`Started working on ${program.name}`)
    }
    break
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  focus = !ns.singularity.getOwnedAugmentations().includes('Neuroreceptor Management Implant')
  buyOrCreateProgram(ns)
  if (ns.singularity.isBusy()) {
    return
  }
  if (ns.getPlayer().factions.length === 0) {
    return
  }
  doFactionWork(ns)
  if (ns.singularity.isBusy()) {
    return
  }
  doCompanyWork(ns)
}
