/** @param {NS} ns **/
export function getCrimeForWork (ns) {
  let crime = 'Shoplift'
  if (ns.getPlayer().skills.dexterity >= 15) {
    crime = 'Rob Store'
  }
  if (ns.getPlayer().skills.dexterity >= 25) {
    crime = 'Mug'
  }
  if (ns.getPlayer().skills.dexterity >= 35) {
    crime = 'Larceny'
  }
  if (ns.getPlayer().skills.dexterity >= 95) {
    crime = 'Deal Drugs'
  }
  if (ns.getPlayer().skills.dexterity >= 200) {
    crime = 'Bond Forgery'
  }
  if (ns.getPlayer().skills.dexterity >= 300) {
    crime = 'Traffic Illegal Arms'
  }
  if (ns.getPlayer().skills.dexterity >= 300) {
    crime = 'Homicide'
  }
  if (ns.getPlayer().skills.dexterity >= 500) {
    crime = 'Grand Theft Auto'
  }
  if (ns.getPlayer().skills.dexterity >= 600) {
    crime = 'Kidnap and Ransom'
  }
  if (ns.getPlayer().skills.dexterity >= 700) {
    crime = 'Assassinate'
  }
  if (ns.getPlayer().skills.dexterity >= 800) {
    crime = 'Heist'
  }
  return crime
}

/** @param {NS} ns **/
export function getBestCrimeForWork (ns, isPlayer, sleeveNo = -1) {
  const p = isPlayer ? ns.getPlayer() : ns.sleeve.getSleeve(sleeveNo)
  const crimes = []
  Object.values(ns.enums.CrimeType).forEach(function (crime) {
    const successChance = ns.formulas.work.crimeSuccessChance(p, crime)
    if (successChance > 0.8) {
      crimes.push({ name: crime, successChance: successChance })
    }
  })
  return crimes.length > 0 ? crimes[crimes.length - 1].name : 'Shoplift'
}
