export function isAugInstalled (ns, aug) {
  return ns.singularity.getOwnedAugmentations(false).includes(aug)
}

function joinBladeburner (ns) {
  if (!ns.bladeburner.inBladeburner()) {
    if (!ns.bladeburner.joinBladeburnerDivision()) {
      ns.print("Couldn't join BladeBurner!")
    } else {
      ns.print('Joined BladeBurner!')
    }
  }
}

function workFor (ns) {
  if (isAugInstalled(ns, "The Blade's Simulacrum")) {
    return true
  }
  if (ns.getPlayer().bitNodeN === 7) {
    return true
  }
  const bonusTime = ns.bladeburner.getBonusTime()
  if (bonusTime > 1000) {
    ns.print(`We have some bonus time, continuing... (${bonusTime})`)
    return true
  } else {
    ns.print(`No bonus time, nothing to do. (${bonusTime})`)
  }
  return false
}

function stopWork (ns) {
  if (!isAugInstalled(ns, "The Blade's Simulacrum")) {
    ns.singularity.stopAction()
  }
}

function getStaminaRatio (ns) {
  const [current, max] = ns.bladeburner.getStamina()
  return current / max
}

function getBlackOps (ns) {
  const blackOpNames = ns.bladeburner.getBlackOpNames()
  const blackOps = []
  for (const blackOpName of blackOpNames) {
    const blackOp = {
      name: blackOpName,
      rank: ns.bladeburner.getBlackOpRank(blackOpName),
      remainingCount: ns.bladeburner.getActionCountRemaining('BlackOp', blackOpName),
      successChances: ns.bladeburner.getActionEstimatedSuccessChance('BlackOp', blackOpName)
    }
    blackOps.push(blackOp)
  }
  const blackOp = blackOps.sort((a, b) => a.rank - b.rank).filter(e => e.remainingCount !== 0)[0]
  const currentRank = ns.bladeburner.getRank()
  if (blackOp.rank > currentRank) {
    ns.print(`BlackOp ${blackOp.name} requires rank ${blackOp.rank}, we only have ${currentRank}`)
    return false
  }
  if (blackOp.successChances[0] < 0.9) {
    ns.print(`BlackOp ${blackOp.name} only has success chance ${blackOp.successChances}`)
    return false
  }
  return ['BlackOp', blackOp.name]
}

function getWorkTask (ns) {
  const blackOp = getBlackOps(ns)
  if (blackOp) {
    return blackOp
  }
  const contractNames = ['Tracking', 'Bounty Hunter', 'Retirement']
  const staminaRatio = getStaminaRatio(ns)
  const currentActionType = ns.bladeburner.getCurrentAction().type
  const currentActionName = ns.bladeburner.getCurrentAction().name
  const currentCity = ns.bladeburner.getCity()
  const currentCityChaos = ns.bladeburner.getCityChaos(currentCity)
  let contractName = ''
  let remainingContractCount = 0
  let contractSuccessChance = [0, 0]
  for (const contract of contractNames) {
    const _contractName = contract
    const _remainingContractCount = ns.bladeburner.getActionCountRemaining('Contract', _contractName)
    const _contractSuccessChance = ns.bladeburner.getActionEstimatedSuccessChance('Contract', _contractName)
    if (remainingContractCount === 0 || remainingContractCount < _remainingContractCount) {
      contractName = _contractName
      contractSuccessChance = _contractSuccessChance
      remainingContractCount = _remainingContractCount
    }
    if (remainingContractCount > 50) {
      break
    }
  }
  if (remainingContractCount < 50) {
    return ['General', ns.bladeburner.getGeneralActionNames().find(e => e === 'Incite Violence')]
  } else if (remainingContractCount < 100 && currentActionType === 'General' && currentActionName === 'Incite Violence') {
    return ['General', ns.bladeburner.getGeneralActionNames().find(e => e === 'Incite Violence')]
  }
  if (currentCityChaos > 100 && contractSuccessChance[0] < 0.95) {
    return ['General', ns.bladeburner.getGeneralActionNames().find(e => e === 'Diplomacy')]
  } else if (currentCityChaos > 50 && currentActionType === 'General' && currentActionName === 'Diplomacy' && contractSuccessChance[0] < 0.95) {
    return ['General', ns.bladeburner.getGeneralActionNames().find(e => e === 'Diplomacy')]
  }
  if (staminaRatio > 0.5 && currentActionType === 'Contract' && currentActionName === contractName) {
    return ['Contract', ns.bladeburner.getContractNames().find(e => e === contractName)]
  } else if ((staminaRatio < 1 && currentActionType === 'General' && currentActionName === 'Field Analysis')) {
    return ['General', ns.bladeburner.getGeneralActionNames().find(e => e === 'Field Analysis')]
  } else if (staminaRatio > 0.5) {
    return ['Contract', ns.bladeburner.getContractNames().find(e => e === contractName)]
  } else {
    return ['General', ns.bladeburner.getGeneralActionNames().find(e => e === 'Field Analysis')]
  }
}

function spendSkillPoints (ns) {
  const skillNames = ns.bladeburner.getSkillNames()
  let skills = []
  for (const skill of skillNames) {
    const skillLevel = ns.bladeburner.getSkillLevel(skill)
    if (skill === 'Overclock' && skillLevel === 90) {
      continue
    }
    skills.push({ name: skill, level: skillLevel })
  }
  const minLevel = Math.min(...skills.map(e => e.level))
  skills = skills.filter(e => e.level === minLevel)
  for (const skill of skills) {
    const levelCount = 1
    const upgradeCost = ns.bladeburner.getSkillUpgradeCost(skill.name, levelCount)
    const skillPoints = ns.bladeburner.getSkillPoints()
    if (skillPoints > upgradeCost) {
      ns.bladeburner.upgradeSkill(skill.name, levelCount)
    }
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  joinBladeburner(ns)
  let didRun = false
  if (workFor(ns)) {
    if (!isAugInstalled(ns, "The Blade's Simulacrum")) {
      ns.print("We'll be running... kill deployer and start spendHashes")
      didRun = true
      ns.scriptKill('deployer.js', 'home')
      ns.run('spendHashes.js')
    }
  }
  let i = 0
  const cycles = (Math.floor(ns.getTimeSinceLastAug() / (1000 * 60)) < 30) ? 60 : 600
  while (workFor(ns) && i < cycles) {
    if (!isAugInstalled(ns, "The Blade's Simulacrum")) {
      i += 1
    }
    stopWork(ns)
    const [workType, workTask] = getWorkTask(ns)
    const currentWork = ns.bladeburner.getCurrentAction()
    if (currentWork.type !== workType || currentWork.name !== workTask) {
      ns.bladeburner.startAction(workType, workTask)
    }
    spendSkillPoints(ns)
    await ns.sleep(1000)
  }
  if (didRun) {
    if (!isAugInstalled(ns, "The Blade's Simulacrum")) {
      ns.print('We were running... kill spendHashes and start deployer')
      ns.scriptKill('spendHashes.js', 'home')
      ns.run('deployer.js')
    }
  }
  ns.print('bladeburner script finished')
}
