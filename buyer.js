import { joinedFaction, getFactionsSortedByMissingRep } from 'imports/factionHelpers.js'
import { augIsNecessary, hasMissingAugs, missingAugs, isAugInstalled } from 'imports/augmentationHelpers.js'

function buyAugmentations (ns) {
  let openAugmentations = []
  let factions = getFactionsSortedByMissingRep(ns)
  const focusFactions = ['Netburners', 'CyberSec', 'Tian Di Hui', 'Sector-12', 'Aevum', 'NiteSec', 'The Black Hand', 'BitRunners']
  for (const faction of focusFactions) {
    if (hasMissingAugs(ns, faction) && joinedFaction(ns, faction)) {
      ns.print(`Focus on augments from ${faction}`)
      factions = factions.filter(e => e.name === faction)
      break
    }
  }
  for (const faction of factions) {
    if (!hasMissingAugs(ns, faction.name)) {
      ns.print(`We don't need any augmentations from ${faction.name}`)
      continue
    }
    for (const augmentation of missingAugs(ns, faction.name)) {
      const aug = { name: '', cost: '', rep: '', preReqs: '', faction: '' }
      aug.name = augmentation
      aug.cost = ns.singularity.getAugmentationPrice(augmentation)
      aug.rep = ns.singularity.getAugmentationRepReq(augmentation)
      const preReqs = ns.singularity.getAugmentationPrereq(augmentation)
      const ownedPreReqs = []
      for (const preReq of preReqs) {
        if (isAugInstalled(ns, preReq)) {
          ownedPreReqs.push(preReq)
        }
      }
      aug.preReqs = preReqs.filter(elem => !ownedPreReqs.includes(elem))
      aug.faction = faction.name
      openAugmentations.push(aug)
    }
  }
  openAugmentations = openAugmentations.sort((a, b) => b.cost - a.cost)
  for (const openAugmentation of openAugmentations) {
    if (!augIsNecessary(ns, openAugmentation.name)) {
      continue
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
      }
    }
    if (!hasMoney) {
      ns.print(`Not enough money for ${openAugmentation.name}`)
    }
    if (!hasRep) {
      ns.print(`Not enough reputation for ${openAugmentation.name}`)
    }
    if (!hasPreReqs) {
      ns.print(`Missing requirements for ${openAugmentation.name}`)
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
}
