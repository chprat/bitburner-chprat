import { joinedFaction, getFactionsSortedByMissingRep, getAllFactionsWithMissingAugs, CriminalFactions, EndGameFactions, getFocusFactions } from 'imports/factionHelpers.js'
import { augIsNecessary, hasMissingAugs, missingAugs, isAugInstalled, hasAugsToInstall } from 'imports/augmentationHelpers.js'

/** @param {NS} ns **/
function enrichAugmentation (ns, augmentationName, factionName) {
  const aug = { name: '', cost: '', rep: '', preReqs: '', faction: '' }
  aug.name = augmentationName
  aug.cost = ns.singularity.getAugmentationPrice(augmentationName)
  aug.rep = ns.singularity.getAugmentationRepReq(augmentationName)
  const preReqs = ns.singularity.getAugmentationPrereq(augmentationName)
  const ownedPreReqs = []
  for (const preReq of preReqs) {
    if (isAugInstalled(ns, preReq)) {
      ownedPreReqs.push(preReq)
    }
  }
  aug.preReqs = preReqs.filter(elem => !ownedPreReqs.includes(elem))
  aug.faction = factionName
  return aug
}

/** @param {NS} ns **/
function buyAugmentations (ns, necessary = true) {
  let openAugmentations = []
  if (joinedFaction(ns, 'Bladeburners') && !hasAugsToInstall(ns) && hasMissingAugs(ns, 'Bladeburners', false)) {
    const bladeburnerAugs = missingAugs(ns, 'Bladeburners', false)
    ns.print(`Bladeburners has ${bladeburnerAugs.length} augmentations left`)
    for (const bladeburnerAug of bladeburnerAugs) {
      const aug = enrichAugmentation(ns, bladeburnerAug, 'Bladeburners')
      const hasMoney = ns.getPlayer().money >= aug.cost
      const hasRep = ns.singularity.getFactionRep(aug.faction) >= aug.rep
      const hasPreReqs = aug.preReqs.length === 0
      if (!hasPreReqs) {
        ns.print(`Missing requirements for ${aug.name} from ${aug.faction}`)
        continue
      }
      if (!hasMoney) {
        ns.print(`Not enough money for ${aug.name} from ${aug.faction}`)
      }
      if (!hasRep) {
        ns.print(`Not enough reputation for ${aug.name} from ${aug.faction}`)
      }
      if (hasMoney && hasRep) {
        const success = ns.singularity.purchaseAugmentation(aug.faction, aug.name)
        if (!success) {
          ns.print(`Couldn't buy ${aug.name} from ${aug.faction}`)
        } else {
          ns.print(`Bought ${aug.name} from ${aug.faction}`)
        }
      }
      break
    }
  }
  let factions = getFactionsSortedByMissingRep(ns, true, necessary)
  const focusFactions = getFocusFactions()
  for (const faction of focusFactions) {
    if (hasMissingAugs(ns, faction, necessary) && joinedFaction(ns, faction)) {
      ns.print(`Focus on augments from ${faction}`)
      factions = factions.filter(e => e.name === faction)
      break
    }
  }
  for (const faction of factions) {
    if (!hasMissingAugs(ns, faction.name, necessary)) {
      ns.print(`We don't need any augmentations from ${faction.name}`)
      continue
    }
    for (const augmentation of missingAugs(ns, faction.name, necessary)) {
      const aug = enrichAugmentation(ns, augmentation, faction.name)
      openAugmentations.push(aug)
    }
  }
  openAugmentations = openAugmentations.sort((a, b) => b.cost - a.cost)
  for (const openAugmentation of openAugmentations) {
    if (necessary) {
      if (!augIsNecessary(ns, openAugmentation.name)) {
        continue
      }
    }
    const hasMoney = ns.getPlayer().money >= openAugmentation.cost
    const hasRep = ns.singularity.getFactionRep(openAugmentation.faction) >= openAugmentation.rep
    const hasPreReqs = openAugmentation.preReqs.length === 0
    if (hasMoney && hasRep && hasPreReqs) {
      const success = ns.singularity.purchaseAugmentation(openAugmentation.faction, openAugmentation.name)
      if (!success) {
        ns.print(`Couldn't buy ${openAugmentation.name} from ${openAugmentation.faction}`)
      } else {
        ns.print(`Bought ${openAugmentation.name} from ${openAugmentation.faction}`)
        continue
      }
    }
    if (!hasMoney) {
      ns.print(`Not enough money for ${openAugmentation.name} from ${openAugmentation.faction}`)
    }
    if (!hasRep) {
      ns.print(`Not enough reputation for ${openAugmentation.name} from ${openAugmentation.faction}`)
    }
    if (!hasPreReqs) {
      ns.print(`Missing requirements for ${openAugmentation.name} from ${openAugmentation.faction}`)
    }
    if (!hasPreReqs) {
      continue
    }
    break
  }
  if (openAugmentations.length === 0) {
    ns.print('Currently no open augmentations to buy')
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  const hasFl1ghtHackingLevel = ns.getHackingLevel() >= 2500
  const hasFl1ghtAugmentations = ns.singularity.getOwnedAugmentations().length >= 30
  if (hasFl1ghtHackingLevel && hasFl1ghtAugmentations) {
    if (!joinedFaction(ns, 'Daedalus')) {
      ns.print('We need to save some money to join Daedalus.')
      return
    }
  }
  buyAugmentations(ns)
  let factionsWithMissingAugs = getAllFactionsWithMissingAugs(ns)
  const factions = CriminalFactions.concat(EndGameFactions.filter(e => e !== 'Daedalus'))
  for (const faction of factions) {
    factionsWithMissingAugs = factionsWithMissingAugs.filter(e => e !== faction)
  }
  if (factionsWithMissingAugs.length === 0) {
    buyAugmentations(ns, false)
  }
}
