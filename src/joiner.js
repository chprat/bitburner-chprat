import { HackingFactions, EarlyFactions, CriminalFactions, EndGameFactions, MegaCorpFactions, amFactions, asFactions, eFactions, joinedFaction, getAllFactionsWithMissingAugs } from 'imports/factionHelpers.js'
import { hasMissingAugs } from 'imports/augmentationHelpers.js'

function progressCityFactions (ns, necessary = true) {
  let workOnAm = false
  let workOnAs = false
  let workOnE = false
  for (const faction of amFactions) {
    workOnAm ||= joinedFaction(ns, faction)
    workOnAm ||= hasMissingAugs(ns, faction, necessary)
  }
  for (const faction of asFactions) {
    workOnAs ||= joinedFaction(ns, faction)
    workOnAs ||= hasMissingAugs(ns, faction, necessary)
  }
  for (const faction of eFactions) {
    workOnE ||= joinedFaction(ns, faction)
    workOnE ||= hasMissingAugs(ns, faction, necessary)
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

async function joinCityFactions (ns, necessary = true) {
  ns.print('Check if we need to join a city faction')
  const factionsToProgress = progressCityFactions(ns, necessary)
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

async function cityBasedJoining (ns, faction, city, necessary = true) {
  const factionsToProgress = progressCityFactions(ns, necessary)
  if (!hasMissingAugs(ns, faction, necessary)) {
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
    if (ns.getPlayer.city !== city) {
      const success = ns.singularity.travelToCity(city)
      if (success) {
        ns.print(`Traveled to ${city}`)
        await ns.sleep(30000)
      } else {
        ns.print(`Couldn't travel to ${city}`)
        return
      }
    }
    const success = joinFactions(ns, [faction])
    if (!success) {
      ns.print(`Couldn't join ${faction}`)
    }
  }
}

async function joinTianDiHui (ns, necessary = true) {
  const faction = 'Tian Di Hui'
  const city = 'Ishima'
  ns.print(`Check if we need to join ${faction}`)
  await cityBasedJoining(ns, faction, city, necessary)
}

async function joinTetrads (ns, necessary = true) {
  const faction = 'Tetrads'
  const city = 'Ishima'
  ns.print(`Check if we need to join ${faction}`)
  if (ns.heart.break() > -18) {
    return
  }
  await cityBasedJoining(ns, faction, city, necessary)
}

async function joinTheDarkArmy (ns, necessary = true) {
  const faction = 'The Dark Army'
  const city = 'Chongqing'
  ns.print(`Check if we need to join ${faction}`)
  if (ns.heart.break() > -45) {
    return
  }
  if (ns.getPlayer().numPeopleKilled < 5) {
    return
  }
  await cityBasedJoining(ns, faction, city, necessary)
}

async function joinTheSyndicate (ns, necessary = true) {
  const faction = 'The Syndicate'
  const city = 'Aevum'
  ns.print(`Check if we need to join ${faction}`)
  if (ns.heart.break() > -90) {
    return
  }
  await cityBasedJoining(ns, faction, city, necessary)
}

/** @param {NS} ns **/
export async function main (ns) {
  for (const factions of [EarlyFactions, HackingFactions, CriminalFactions, EndGameFactions, MegaCorpFactions]) {
    joinFactions(ns, factions)
  }
  await joinCityFactions(ns)
  await joinTianDiHui(ns)
  let factionsWithMissingAugs = getAllFactionsWithMissingAugs(ns)
  const factions = CriminalFactions.concat(EndGameFactions.filter(e => e !== 'Daedalus'))
  for (const faction of factions) {
    factionsWithMissingAugs = factionsWithMissingAugs.filter(e => e !== faction)
  }
  if (factionsWithMissingAugs.length === 0) {
    for (const factions of [EarlyFactions, HackingFactions, CriminalFactions, EndGameFactions, MegaCorpFactions]) {
      joinFactions(ns, factions, false)
    }
    await joinCityFactions(ns, false)
    await joinTianDiHui(ns, false)
    await joinTetrads(ns, false)
    await joinTheDarkArmy(ns, false)
    await joinTheSyndicate(ns, false)
  }
}
