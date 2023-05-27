import { augIsNecessary } from 'imports/augmentationHelpers.js'

/** @param {NS} ns **/
export async function main (ns) {
  const restartReasonFile = 'restartReason.txt'
  const factions = ns.getPlayer().factions
  const purchasedAugmentations = ns.singularity.getOwnedAugmentations(true)
  const installedAugmentations = ns.singularity.getOwnedAugmentations()
  let restart = false
  for (const faction of factions) {
    const factionAugmentations = ns.singularity.getAugmentationsFromFaction(faction)

    const notInstalledAugmentationsFromFaction = factionAugmentations.filter(x => !installedAugmentations.includes(x))
    if (notInstalledAugmentationsFromFaction.length === 0) {
      ns.print(`${faction} all augmentations installed`)
      continue
    }

    let allNecessaryAugmentationsInstalled = true
    for (const augmentation of notInstalledAugmentationsFromFaction) {
      allNecessaryAugmentationsInstalled &&= !augIsNecessary(ns, augmentation)
    }
    if (allNecessaryAugmentationsInstalled) {
      ns.print(`${faction} all necessary augmentations installed`)
      continue
    }

    const notPurchasedAugmentationsFromFaction = factionAugmentations.filter(x => !purchasedAugmentations.includes(x))
    if (notPurchasedAugmentationsFromFaction.length === 0) {
      const now = new Date()
      restart = true
      ns.write(restartReasonFile, `${now.toLocaleString()} (${ns.tFormat(Date.now() - ns.getResetInfo().lastAugReset)} since last augmentation installation) All augmentations from ${faction} are bought, restart...\n`, 'a')
      ns.run('restarter.js', 1)
    }

    let allNecessaryAugmentationsBought = true
    for (const augmentation of notPurchasedAugmentationsFromFaction) {
      allNecessaryAugmentationsBought &&= !augIsNecessary(ns, augmentation)
    }
    if (allNecessaryAugmentationsBought && notPurchasedAugmentationsFromFaction.length !== 0) {
      const now = new Date()
      restart = true
      ns.write(restartReasonFile, `${now.toLocaleString()} (${ns.tFormat(Date.now() - ns.getResetInfo().lastAugReset)} since last augmentation installation) All necessary augmentations from ${faction} are bought, restart...\n`, 'a')
      ns.run('restarter.js', 1)
    }
    ns.print(`Nothing for ${faction}`)
  }
  const hoursSinceLastAugInstall = (Date.now() - ns.getResetInfo().lastAugReset) / 1000 / 60 / 60
  const newAugmentations = purchasedAugmentations.filter(x => !installedAugmentations.includes(x))
  if (newAugmentations.length >= 5 && hoursSinceLastAugInstall >= 24 && !restart) {
    const now = new Date()
    ns.write(restartReasonFile, `${now.toLocaleString()} (${ns.tFormat(Date.now() - ns.getResetInfo().lastAugReset)} since last augmentation installation) It's been a while, we should restart...\n`, 'a')
    ns.run('restarter.js', 1)
  }
}
