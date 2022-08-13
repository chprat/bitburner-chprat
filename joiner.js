import { HackingFactions, EarlyFactions, CriminalFactions, EndGameFactions, MegaCorpFactions, amFactions, asFactions, eFactions, joinedFaction } from 'imports/factionHelpers.js'
import { hasMissingAugs } from 'imports/augmentationHelpers.js'

function progressCityFactions (ns) {
  let workOnAm = false
  let workOnAs = false
  let workOnE = false
  for (const faction of amFactions) {
    workOnAm ||= joinedFaction(ns, faction)
    workOnAm ||= hasMissingAugs(ns, faction)
  }
  for (const faction of asFactions) {
    workOnAs ||= joinedFaction(ns, faction)
    workOnAs ||= hasMissingAugs(ns, faction)
  }
  for (const faction of eFactions) {
    workOnE ||= joinedFaction(ns, faction)
    workOnE ||= hasMissingAugs(ns, faction)
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

function joinFactions (ns, factions) {
  let success = false
  for (const fac of factions) {
    let faction = fac
    if (faction.name !== undefined) {
      faction = faction.name
    }
    if (faction === 'Fulcrum Technologies') {
      faction = 'Fulcrum Secret Technologies'
    }
    const invitations = ns.singularity.checkFactionInvitations()
    if (invitations.includes(faction)) {
      success = ns.singularity.joinFaction(faction)
      if (success) {
        ns.print(`Joined faction ${faction}`)
      } else {
        ns.print(`Error joining ${faction}`)
      }
    }
  }
  return success
}

async function joinCityFactions (ns) {
  ns.print('Check if we need to join a city faction')
  const factionsToProgress = progressCityFactions(ns)
  if (factionsToProgress.length === 0) {
    return
  }
  for (const faction of factionsToProgress) {
    if (!joinedFaction(ns, faction)) {
      ns.print(`Didn't join ${faction}`)
      let success = joinFactions(ns, [faction])
      if (success) {
        break
      }
      if (ns.getPlayer.city !== faction) {
        const success = ns.singularity.travelToCity(faction)
        if (success) {
          ns.print(`Traveled to ${faction}`)
          await ns.sleep(30000)
        } else {
          ns.print(`Couldn't travel to ${faction}`)
          break
        }
      }
      success = joinFactions(ns, [faction])
      if (!success) {
        break
      }
    }
  }
}

async function joinTianDiHui (ns) {
  ns.print('Check if we need to join Tian Di Hui')
  const faction = 'Tian Di Hui'
  const factionsToProgress = progressCityFactions(ns)
  if (!hasMissingAugs(ns, faction)) {
    ns.print(`We don't need any augmentations from ${faction}`)
    return
  }
  if (joinedFaction(ns, faction)) {
    ns.print(`We already joined ${faction}`)
    return
  }
  let allCityFactionsJoined = false
  for (const fac of factionsToProgress) {
    allCityFactionsJoined ||= joinedFaction(ns, fac)
  }
  if (allCityFactionsJoined) {
    if (ns.getPlayer.city !== 'Ishima') {
      const success = ns.singularity.travelToCity('Ishima')
      if (success) {
        ns.print('Traveled to Ishima')
        await ns.sleep(30000)
      } else {
        ns.print("Couldn't travel to Ishima")
        return
      }
    }
    const success = joinFactions(ns, [faction])
    if (!success) {
      ns.print(`Couldn't join ${faction}`)
    }
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  for (const factions of [EarlyFactions, HackingFactions, CriminalFactions, EndGameFactions, MegaCorpFactions]) {
    joinFactions(ns, factions)
  }
  await joinCityFactions(ns)
  await joinTianDiHui(ns)
}
