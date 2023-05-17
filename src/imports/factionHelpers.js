import { missingAugs, hasMissingAugs, factionOffersNG } from 'imports/augmentationHelpers.js'

export const HackingFactions = [
  { name: 'CyberSec', server: 'CSEC' },
  { name: 'NiteSec', server: 'avmnite-02h' },
  { name: 'The Black Hand', server: 'I.I.I.I' },
  { name: 'BitRunners', server: 'run4theh111z' }
]

export const EarlyFactions = ['Tian Di Hui', 'Netburners']
export const CriminalFactions = ['Slum Snakes', 'Tetrads', 'Silhouette', 'Speakers for the Dead', 'The Dark Army', 'The Syndicate']
export const EndGameFactions = ['The Covenant', 'Daedalus', 'Illuminati']

export const MegaCorpFactions = [
  { name: 'MegaCorp', server: 'megacorp' },
  { name: 'Blade Industries', server: 'blade' },
  { name: 'Four Sigma', server: '4sigma' },
  { name: 'KuaiGong International', server: 'kuai-gong' },
  { name: 'NWO', server: 'nwo' },
  { name: 'OmniTek Incorporated', server: 'omnitek' },
  { name: 'ECorp', server: 'ecorp' },
  { name: 'Bachman & Associates', server: 'b-and-a' },
  { name: 'Clarke Incorporated', server: 'clarkinc' },
  { name: 'Fulcrum Technologies', server: 'fulcrumassets' }
]

export const amFactions = ['Sector-12', 'Aevum']
export const asFactions = ['Chongqing', 'New Tokyo', 'Ishima']
export const eFactions = ['Volhaven']

/** @param {NS} ns **/
export function getCompanies (ns) {
  const allCompanies = []
  for (const faction of MegaCorpFactions) {
    allCompanies.push(faction.name)
  }
  return allCompanies
}

/** @param {NS} ns **/
export function joinedFaction (ns, faction) {
  return ns.getPlayer().factions.includes(faction)
}

/** @param {NS} ns **/
export function getFactionsSortedByMissingRep (ns, ascending = true, necessary = true) {
  let factions = []
  for (const faction of ns.getPlayer().factions) {
    const fac = { name: '', rep: 0, maxNeededRep: 0, missingRep: 0 }
    fac.name = faction
    for (const aug of missingAugs(ns, faction, necessary)) {
      const neededRep = ns.singularity.getAugmentationRepReq(aug)
      if (neededRep > fac.maxNeededRep) {
        fac.maxNeededRep = neededRep
      }
    }
    fac.rep = ns.singularity.getFactionRep(faction)
    fac.missingRep = fac.maxNeededRep - fac.rep
    factions.push(fac)
  }
  if (ascending) {
    factions = factions.sort((a, b) => a.missingRep - b.missingRep)
  } else {
    factions = factions.sort((a, b) => b.missingRep - a.missingRep)
  }
  return factions
}

/** @param {NS} ns **/
export function getAllFactions (ns) {
  const allFactions = EarlyFactions.concat(amFactions, asFactions, eFactions, CriminalFactions, EndGameFactions)
  for (const faction of HackingFactions) {
    allFactions.push(faction.name)
  }
  for (const faction of MegaCorpFactions) {
    if (faction.name === 'Fulcrum Technologies') {
      allFactions.push('Fulcrum Secret Technologies')
    } else {
      allFactions.push(faction.name)
    }
  }
  return allFactions
}

/** @param {NS} ns **/
export function getAllFactionsWithMissingAugs (ns, necessary = true) {
  const allFactionsWithMissingAugs = []
  for (const faction of getAllFactions(ns)) {
    if (hasMissingAugs(ns, faction, necessary)) {
      allFactionsWithMissingAugs.push(faction)
    }
  }
  return allFactionsWithMissingAugs
}

/** @param {NS} ns **/
export function getFactionWithMostRepAndNG (ns) {
  const factions = getFactionsSortedByRep(ns)
  for (const faction of factions) {
    if (factionOffersNG(ns, faction.name)) {
      return faction.name
    }
  }
}

/** @param {NS} ns **/
export function getFactionsSortedByRep (ns) {
  const playerFactions = ns.getPlayer().factions
  const factions = []
  for (const playerFaction of playerFactions) {
    const faction = {
      name: '',
      reputation: 0
    }
    faction.name = playerFaction
    faction.reputation = ns.singularity.getFactionRep(playerFaction)
    factions.push(faction)
  }
  return factions.sort((a, b) => b.reputation - a.reputation)
}

export function getFocusFactions () {
  return ['Netburners', 'CyberSec', 'Tian Di Hui', 'Sector-12', 'Aevum', 'NiteSec', 'The Black Hand', 'BitRunners']
}
