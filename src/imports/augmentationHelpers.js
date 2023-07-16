/** @param {NS} ns **/
export function missingAugs (ns, faction, necessary = true) {
  const allAugs = ns.singularity.getAugmentationsFromFaction(faction).filter((elem) => !ns.singularity.getOwnedAugmentations(true).includes(elem))
  const necessaryAugs = allAugs.filter(elem => augIsNecessary(ns, elem))
  if (necessary) {
    return necessaryAugs
  }
  return allAugs
}

/** @param {NS} ns **/
export function hasMissingAugs (ns, faction, necessary = true) {
  return missingAugs(ns, faction, necessary).length !== 0
}

/** @param {NS} ns **/
export function isAugInstalled (ns, aug) {
  return ns.singularity.getOwnedAugmentations(true).includes(aug)
}

/** @param {NS} ns **/
export function augIsNecessary (ns, aug) {
  let necessary = false
  const necessaryFeatures = [
    'hacking',
    'charisma',
    'company',
    'faction',
    'hacknet'
  ]
  const necessaryAugs = [
    'CashRoot Starter Kit',
    'The Red Pill',
    'Neuroreceptor Management Implant'
  ]
  const stats = ns.singularity.getAugmentationStats(aug)
  for (const key in stats) {
    for (const feature of necessaryFeatures) {
      if (key.includes(feature)) {
        if (stats[key] > 1) {
          necessary = true
          break
        }
      }
    }
    if (necessary === true) {
      break
    }
  }
  for (const augmentation of necessaryAugs) {
    if (augmentation === aug) {
      necessary = true
      break
    }
  }
  return necessary
}

/** @param {NS} ns **/
export function getAllMissingAugs (ns, factions) {
  const missingAugs = []
  for (const faction of factions) {
    const missingAugsFromFaction = ns.singularity.getAugmentationsFromFaction(faction).filter((elem) => !ns.singularity.getOwnedAugmentations(true).includes(elem))
    for (const aug of missingAugsFromFaction) {
      if (missingAugs.filter(e => e.name === aug).length === 0) {
        const augmentation = { name: '', factions: [], stats: [], necessary: false }
        augmentation.name = aug
        augmentation.factions = [faction]
        const stats = ns.singularity.getAugmentationStats(aug)
        augmentation.stats = Object.keys(stats).filter(e => stats[e] > 1)
        augmentation.necessary = augIsNecessary(ns, aug)
        missingAugs.push(augmentation)
      } else {
        missingAugs[missingAugs.findIndex(e => e.name === aug)].factions.push(faction)
      }
    }
  }
  return missingAugs.sort((a, b) => (a.name > b.name) ? 1 : -1)
}

/** @param {NS} ns **/
export function factionOffersNG (ns, faction) {
  return ns.singularity.getAugmentationsFromFaction(faction).includes('NeuroFlux Governor')
}

/** @param {NS} ns **/
export function hasAugsToInstall (ns) {
  const purchasedAugmentations = ns.singularity.getOwnedAugmentations(true)
  const installedAugmentations = ns.singularity.getOwnedAugmentations()
  return purchasedAugmentations.length !== installedAugmentations.length
}

/** @param {NS} ns **/
export function enrichAugmentation (ns, augmentationName, factionName) {
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

/** @param {NS} ns */
export function maxNeededReputation (ns, faction, necessary = true) {
  const augs = missingAugs(ns, faction, necessary)
  let enrichedAugs = []
  for (const aug of augs) {
    const enrichedAug = enrichAugmentation(ns, aug, faction)
    enrichedAugs.push(enrichedAug)
  }
  enrichedAugs = enrichedAugs.sort((a, b) => b.cost - a.cost)
  if (enrichedAugs.length > 0) {
    return enrichedAugs[0].rep
  } else {
    return 0
  }
}
