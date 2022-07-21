import { recursiveScan } from 'imports/recursiveScan.js'

const HackingFactions = [
  { name: 'CyberSec', server: 'CSEC' },
  { name: 'NiteSec', server: 'avmnite-02h' },
  { name: 'The Black Hand', server: 'I.I.I.I' },
  { name: 'BitRunners', server: 'run4theh111z' }
]

const EarlyFactions = ['Tian Di Hui', 'Netburners']
const CriminalFactions = ['Slum Snakes', 'Tetrads', 'Silhouette', 'Speakers for the Dead', 'The Dark Army', 'The Syndicate']
const EndGameFactions = ['The Covenant', 'Daedalus', 'Illuminati']

const MegaCorpFactions = [
  { name: 'MegaCorp', server: '' },
  { name: 'Blade Industries', server: '' },
  { name: 'Four Sigma', server: '' },
  { name: 'KuaiGong International', server: '' },
  { name: 'NWO', server: '' },
  { name: 'OmniTek Incorporated', server: '' },
  { name: 'ECorp', server: '' },
  { name: 'Bachman & Associates', server: '' },
  { name: 'Clarke Incorporated', server: '' },
  { name: 'Fulcrum Secret Technologies', server: 'fulcrumassets' }
]

const amFactions = ['Sector-12', 'Aevum']
const asFactions = ['Chongqing', 'New Tokyo', 'Ishima']
const eFactions = ['Volhaven']

let focus = true

function connectTo (ns, route, server) {
  ns.print(route)
  route.shift()
  ns.print(route)
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

async function backdoorFactionServers (ns, factions) {
  let ret = false
  for (const faction of factions) {
    if (faction.server === '') {
      continue
    }
    const server = ns.getServer(faction.server)
    if (server.hasAdminRights) {
      ns.print(`We have admin rights on ${server.hostname}`)
      if (!server.backdoorInstalled) {
        await backdoorServer(ns, server, faction)
        ret = true
      } else {
        ns.print(`Backdoor already installed on ${server.hostname}`)
      }
    } else {
      ns.print(`We do not have admin rights on ${server.hostname}`)
    }
  }
  return ret
}

function joinFactions (ns, factions) {
  let success = false
  for (const faction of factions) {
    if (ns.singularity.checkFactionInvitations().includes(faction.name)) {
      success = ns.singularity.joinFaction(faction.name)
      if (success) {
        ns.print(`Joined faction ${faction.name}`)
      } else {
        ns.print(`Error joining ${faction.name}`)
      }
    }
  }
  return success
}

function missingAugs (ns, faction) {
  return ns.singularity.getAugmentationsFromFaction(faction).filter((elem) => !ns.singularity.getOwnedAugmentations(true).includes(elem))
}

function hasMissingAugs (ns, faction) {
  return missingAugs(ns, faction).length !== 0
}

function getAllFactions (ns) {
  const allFactions = EarlyFactions.concat(amFactions, asFactions, eFactions, CriminalFactions, EndGameFactions)
  for (const faction of HackingFactions) {
    allFactions.push(faction.name)
  }
  for (const faction of MegaCorpFactions) {
    allFactions.push(faction.name)
  }
  return allFactions
}

function getAllFactionsWithMissingAugs (ns) {
  const allFactionsWithMissingAugs = []
  for (const faction of getAllFactions(ns)) {
    if (hasMissingAugs(ns, faction)) {
      allFactionsWithMissingAugs.push(faction)
    }
  }
  return allFactionsWithMissingAugs
}

function joinedFaction (ns, faction) {
  return ns.getPlayer().factions.includes(faction)
}

function progressCityFactions (ns) {
  let workOnAm = false
  let workOnAs = false
  let workOnE = false
  for (const faction of amFactions) {
    workOnAm |= joinedFaction(ns, faction)
    workOnAm |= hasMissingAugs(ns, faction)
  }
  for (const faction of asFactions) {
    workOnAs |= joinedFaction(ns, faction)
    workOnAs |= hasMissingAugs(ns, faction)
  }
  for (const faction of eFactions) {
    workOnE |= joinedFaction(ns, faction)
    workOnE |= hasMissingAugs(ns, faction)
  }
  if (workOnAm === true) {
    ns.print(`Focus on working for ${amFactions}`)
    return amFactions
  } else if (workOnAs === true) {
    ns.print(`Focus on working for ${asFactions}`)
    return asFactions
  } else if (workOnE === true) {
    ns.print(`Focus on working for ${eFactions}`)
    return eFactions
  } else {
    ns.print("We don't need anything from the city factions")
    return []
  }
}

async function joinCityFactions (ns) {
  const factionsToProgress = progressCityFactions(ns)
  if (factionsToProgress.length === 0) {
    return
  }
  for (const faction of factionsToProgress) {
    if (!joinedFaction(ns, faction)) {
      if (!ns.getPlayer.city === faction) {
        const success = ns.singularity.travelToCity(faction)
        if (success) {
          ns.print(`Traveled to ${faction}`)
          await ns.sleep(30000)
        } else {
          ns.print(`Couldn't travel to ${faction}`)
          break
        }
      }
      const success = joinFactions(ns, faction)
      if (!success) {
        break
      }
    }
  }
}

function doFactionWork (ns) {
  for (const faction of ns.getPlayer().factions) {
    if (!hasMissingAugs(ns, faction)) {
      ns.print(`We don't need any augmentations from ${faction}`)
      continue
    }
    let maxNeededRep = 0
    for (const aug of missingAugs(ns, faction)) {
      const neededRep = ns.singularity.getAugmentationRepReq(aug)
      if (neededRep > maxNeededRep) {
        maxNeededRep = neededRep
      }
    }
    if (ns.singularity.getFactionRep(faction) > maxNeededRep) {
      ns.print(`We don't need more reputation for ${faction}`)
      continue
    }
    ns.singularity.stopAction()
    let success = false
    if (ns.getPlayer().charisma < 250) {
      success = ns.singularity.workForFaction(faction, 'Field Work', focus)
    }
    if (!success) {
      ns.print(`${faction} doesn't offer Field Work, trying Hacking Contracts`)
      success = ns.singularity.workForFaction(faction, 'Hacking Contracts', focus)
      if (!success) {
        ns.print(`Couldn't start working for ${faction}`)
      }
    }
    break
  }
}

function getCompanies (ns) {
  const allCompanies = []
  for (const faction of MegaCorpFactions) {
    allCompanies.push(faction.name)
  }
  return allCompanies
}

function doCompanyWork (ns) {
  let success = false
  let job = 'IT'
  if (ns.getPlayer().charisma >= 250) {
    job = 'Business'
  }
  for (const company of getCompanies(ns)) {
    if (company === 'Fulcrum Secret Technologies') {
      if (!ns.getServer('fulcrumassets').backdoorInstalled) {
        continue
      }
    }
    if (!joinedFaction(ns, company)) {
      const title = ns.getPlayer().jobs[company]
      success = ns.singularity.applyToCompany(company, job)
      if (title === null) {
        if (success) {
          ns.tprint(`Applied at ${company} as ${ns.getPlayer().jobs[company]}`)
        } else {
          ns.tprint(`Couldn't apply at ${company} in ${job} field`)
          break
        }
      } else {
        if (success) {
          ns.tprint(`Got promoted to ${ns.getPlayer().jobs[company]} at ${company}`)
        }
      }
      success = ns.singularity.workForCompany(company, focus)
      if (!success) {
        ns.print(`Couldn't start working for ${company}`)
        break
      }
    }
  }
}

async function joinTianDiHui (ns) {
  const faction = 'Tian Di Hui'
  const factionsToProgress = progressCityFactions(ns)
  if (!hasMissingAugs(ns, faction)) {
    ns.print(`We don't need any augmentations from ${faction}`)
    return
  }
  if (joinedFaction(ns, faction)) {
    ns.print(`We already joined ${faction}`)
  }
  let allCityFactionsJoined = false
  for (const fac of factionsToProgress) {
    allCityFactionsJoined |= joinedFaction(ns, fac)
  }
  if (allCityFactionsJoined) {
    if (!ns.getPlayer.city === 'Ishima') {
      const success = ns.singularity.travelToCity('Ishima')
      if (success) {
        ns.print('Traveled to Ishima')
        await ns.sleep(30000)
      } else {
        ns.print("Couldn't travel to Ishima")
        return
      }
    }
    const success = joinFactions(ns, faction)
    if (!success) {
      ns.print(`Couldn't join ${faction}`)
    }
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  focus = !ns.singularity.getOwnedAugmentations().includes('Neuroreceptor Management Implant')
  let serverHacked = false
  for (const faction of [HackingFactions, MegaCorpFactions]) {
    serverHacked = await backdoorFactionServers(ns, faction)
  }
  if (serverHacked) {
    await ns.sleep(30000)
  }
  for (const faction of [EarlyFactions, HackingFactions, CriminalFactions, EndGameFactions, MegaCorpFactions]) {
    joinFactions(ns, faction)
  }
  await joinCityFactions(ns)
  await joinTianDiHui(ns)
  if (ns.getPlayer().factions.length === 0) {
    return
  }
  doFactionWork(ns)
  if (ns.singularity.isBusy()) {
    return
  }
  doCompanyWork(ns)
}
