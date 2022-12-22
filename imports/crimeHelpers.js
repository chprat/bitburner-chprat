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

export function getBestCrimeForWork (ns, isPlayer, sleeveNo = -1) {
  const p = getPersonaCrimeStats(ns, isPlayer, sleeveNo)
  const crimes = []
  Object.keys(crimeSuccessStats).forEach(function (elem) {
    const successChance = calculateCrimeSuccessChance(crimeSuccessStats[elem], p)
    if (successChance > 0.8) {
      crimes.push({ name: crimeSuccessStats[elem].name, successChance: successChance })
    }
  })
  return crimes.length > 0 ? crimes[crimes.length - 1].name : 'Shoplift'
}

function calculateIntelligenceBonus (intelligence, weight = 1) {
  return 1 + (weight * Math.pow(intelligence, 0.8)) / 600
}

export function calculateCrimeSuccessChance (crime, person) {
  let chance =
    crime.hacking_success_weight * person.hacking +
    crime.strength_success_weight * person.strength +
    crime.defense_success_weight * person.defense +
    crime.dexterity_success_weight * person.dexterity +
    crime.agility_success_weight * person.agility +
    crime.charisma_success_weight * person.charisma +
    0.025 * person.intelligence
  chance /= 975
  chance /= crime.difficulty
  chance *= person.crime_success_mult
  chance *= calculateIntelligenceBonus(person.intelligence)
  return Math.min(chance, 1)
}

export function getPersonaCrimeStats (ns, isPlayer, sleeveNo = -1) {
  if (isPlayer) {
    const p = ns.getPlayer().skills
    p.crime_success_mult = ns.getPlayer().mults.crime_success
    return p
  } else {
    const p = ns.sleeve.getSleeveStats(sleeveNo)
    p.intelligence = ns.getPlayer().skills.intelligence
    p.crime_success_mult = ns.sleeve.getInformation(sleeveNo).mult.crimeSuccess
    return p
  }
}

export const crimeSuccessStats = {
  Shoplift: {
    name: 'Shoplift',
    hacking_success_weight: 0,
    strength_success_weight: 0,
    defense_success_weight: 0,
    dexterity_success_weight: 1,
    agility_success_weight: 1,
    charisma_success_weight: 0,
    difficulty: 1 / 20
  },

  RobStore: {
    name: 'Rob Store',
    hacking_success_weight: 0.5,
    strength_success_weight: 0,
    defense_success_weight: 0,
    dexterity_success_weight: 2,
    agility_success_weight: 1,
    charisma_success_weight: 0,
    difficulty: 1 / 5
  },

  Mug: {
    name: 'Mug',
    hacking_success_weight: 0,
    strength_success_weight: 1.5,
    defense_success_weight: 0.5,
    dexterity_success_weight: 1.5,
    agility_success_weight: 0.5,
    charisma_success_weight: 0,
    difficulty: 1 / 5
  },

  Larceny: {
    name: 'Larceny',
    hacking_success_weight: 0.5,
    strength_success_weight: 0,
    defense_success_weight: 0,
    dexterity_success_weight: 1,
    agility_success_weight: 1,
    charisma_success_weight: 0,
    difficulty: 1 / 3
  },

  DealDrugs: {
    name: 'Deal Drugs',
    hacking_success_weight: 0,
    strength_success_weight: 0,
    defense_success_weight: 0,
    dexterity_success_weight: 2,
    agility_success_weight: 1,
    charisma_success_weight: 3,
    difficulty: 1
  },

  BondForgery: {
    name: 'Bond Forgery',
    hacking_success_weight: 0.05,
    strength_success_weight: 0,
    defense_success_weight: 0,
    dexterity_success_weight: 1.25,
    agility_success_weight: 0,
    charisma_success_weight: 0,
    difficulty: 1 / 2
  },

  TraffickArms: {
    name: 'Traffic Illegal Arms',
    hacking_success_weight: 0,
    strength_success_weight: 1,
    defense_success_weight: 1,
    dexterity_success_weight: 1,
    agility_success_weight: 1,
    charisma_success_weight: 1,
    difficulty: 2
  },

  Homicide: {
    name: 'Homicide',
    hacking_success_weight: 0,
    strength_success_weight: 2,
    defense_success_weight: 2,
    dexterity_success_weight: 0.5,
    agility_success_weight: 0.5,
    charisma_success_weight: 0,
    difficulty: 1
  },

  GrandTheftAuto: {
    name: 'Grand Theft Auto',
    hacking_success_weight: 1,
    strength_success_weight: 1,
    defense_success_weight: 0,
    dexterity_success_weight: 4,
    agility_success_weight: 2,
    charisma_success_weight: 2,
    difficulty: 8
  },

  Kidnap: {
    name: 'Kidnap and Ransom',
    hacking_success_weight: 0,
    strength_success_weight: 1,
    defense_success_weight: 0,
    dexterity_success_weight: 1,
    agility_success_weight: 1,
    charisma_success_weight: 1,
    difficulty: 5
  },

  Assassination: {
    name: 'Assassination',
    hacking_success_weight: 0,
    strength_success_weight: 1,
    defense_success_weight: 0,
    dexterity_success_weight: 2,
    agility_success_weight: 1,
    charisma_success_weight: 0,
    difficulty: 8
  },

  Heist: {
    name: 'Heist',
    hacking_success_weight: 1,
    strength_success_weight: 1,
    defense_success_weight: 1,
    dexterity_success_weight: 1,
    agility_success_weight: 1,
    charisma_success_weight: 1,
    difficulty: 18
  }
}
