/** @param {NS} ns **/
export async function main (ns) {
  if (!ns.gang.inGang()) {
    return
  }

  const isHackingGang = ns.gang.getGangInformation().isHacking

  const tasks = ns.gang.getTaskNames()
  const detailedTasks = []
  for (const task of tasks) {
    detailedTasks.push(ns.gang.getTaskStats(task))
  }

  const members = ns.gang.getMemberNames()
  const detailedMembers = []
  for (const member of members) {
    detailedMembers.push(ns.gang.getMemberInformation(member))
  }

  const equipments = ns.gang.getEquipmentNames()
  let detailedEquipments = []
  let detailedAugmentations = []
  for (const equipment of equipments) {
    const detailedEquipment = ns.gang.getEquipmentStats(equipment)
    detailedEquipment.name = equipment
    detailedEquipment.type = ns.gang.getEquipmentType(equipment)
    detailedEquipment.cost = ns.gang.getEquipmentCost(equipment)
    if (detailedEquipment.type === 'Augmentation') {
      detailedAugmentations.push(detailedEquipment)
    } else {
      detailedEquipments.push(detailedEquipment)
    }
  }

  if (isHackingGang) {
    const hackEquip = detailedEquipments.filter(e => e?.hack > 0)
    const chaEquip = detailedEquipments.filter(e => e?.cha > 0)
    const filteredDetailedEquipments = [...hackEquip, ...chaEquip]
    const uniqueFilteredDetailedEquipments = [...new Map(filteredDetailedEquipments.map(e => [e.name, e])).values()]
    detailedEquipments = uniqueFilteredDetailedEquipments
    const hackAugs = detailedAugmentations.filter(e => e?.hack > 0)
    const chaAugs = detailedAugmentations.filter(e => e?.cha > 0)
    const filteredDetailedAugmentations = [...hackAugs, ...chaAugs]
    const uniqueFilteredDetailedAugmentations = [...new Map(filteredDetailedAugmentations.map(e => [e.name, e])).values()]
    detailedAugmentations = uniqueFilteredDetailedAugmentations
  } else {
    const agiEquip = detailedEquipments.filter(e => e?.agi > 0)
    const defEquip = detailedEquipments.filter(e => e?.def > 0)
    const dexEquip = detailedEquipments.filter(e => e?.dex > 0)
    const strEquip = detailedEquipments.filter(e => e?.str > 0)
    const chaEquip = detailedEquipments.filter(e => e?.cha > 0)
    const filteredDetailedEquipments = [...agiEquip, ...defEquip, ...dexEquip, ...strEquip, ...chaEquip]
    const uniqueFilteredDetailedEquipments = [...new Map(filteredDetailedEquipments.map(e => [e.name, e])).values()]
    detailedEquipments = uniqueFilteredDetailedEquipments
    const agiAugs = detailedAugmentations.filter(e => e?.agi > 0)
    const defAugs = detailedAugmentations.filter(e => e?.def > 0)
    const dexAugs = detailedAugmentations.filter(e => e?.dex > 0)
    const strAugs = detailedAugmentations.filter(e => e?.str > 0)
    const chaAugs = detailedAugmentations.filter(e => e?.cha > 0)
    const filteredDetailedAugmentations = [...agiAugs, ...defAugs, ...dexAugs, ...strAugs, ...chaAugs]
    const uniqueFilteredDetailedAugmentations = [...new Map(filteredDetailedAugmentations.map(e => [e.name, e])).values()]
    detailedAugmentations = uniqueFilteredDetailedAugmentations
  }
  detailedEquipments = detailedEquipments.sort((a, b) => a.cost - b.cost)
  detailedAugmentations = detailedAugmentations.sort((a, b) => a.cost - b.cost)

  if (ns.gang.canRecruitMember()) {
    const newMemberName = `mem${members.length + 1}`
    ns.gang.recruitMember(newMemberName)
    ns.print(`New member ${newMemberName} recruited`)
    members.push(newMemberName)
    detailedMembers.push(ns.gang.getMemberInformation(newMemberName))
    const workTasks = tasks.filter(t => t !== 'Unassigned')
    ns.gang.setMemberTask(newMemberName, workTasks[0])
  }

  for (const member of members) {
    const ascensionResult = ns.gang.getAscensionResult(member)
    if (ascensionResult === undefined) {
      continue
    }
    delete ascensionResult.respect
    Object.keys(ascensionResult).forEach(function (elem) {
      if (ascensionResult[elem] > 3) {
        ns.gang.ascendMember(member)
        const workTasks = tasks.filter(t => t !== 'Unassigned')
        ns.gang.setMemberTask(member, workTasks[0])
        ns.print(`Ascended ${member}`)
      }
    })
  }

  for (const member of members) {
    const memberAugmentations = ns.gang.getMemberInformation(member).augmentations
    const memberUpgrades = ns.gang.getMemberInformation(member).upgrades
    for (const aug of detailedAugmentations) {
      if (!memberAugmentations.includes(aug)) {
        if (ns.getPlayer().money > aug.cost) {
          ns.gang.purchaseEquipment(member, aug.name)
        }
      }
    }
    for (const equ of detailedEquipments) {
      if (!memberUpgrades.includes(equ)) {
        if (ns.getPlayer().money > equ.cost) {
          ns.gang.purchaseEquipment(member, equ.name)
        }
      }
    }
  }

  const gangInformation = ns.gang.getGangInformation()
  if ((1 - gangInformation.wantedPenalty) > 0.5 && !detailedMembers[0].task.startsWith('Vigilante')) {
    const task = tasks.find(element => element.startsWith('Vigilante'))
    ns.print(`Time to decrease the wanted level: ${task}`)
    for (const member of members) {
      ns.gang.setMemberTask(member, task)
    }
  } else if ((gangInformation.wantedLevel < 2 && detailedMembers[0].task.startsWith('Vigilante')) ||
             !detailedMembers[0].task.startsWith('Vigilante')) {
    for (const member of members) {
      const workTasks = tasks.filter(t => t !== 'Unassigned')
      const moneyGains = {}
      for (const workTask of workTasks) {
        ns.gang.setMemberTask(member, workTask)
        moneyGains[workTask] = ns.gang.getMemberInformation(member).moneyGain
      }
      const maxMoneyGain = { task: workTasks[0], gain: 0 }
      Object.keys(moneyGains).forEach(function (elem) {
        if (moneyGains[elem] > maxMoneyGain.gain) {
          maxMoneyGain.gain = moneyGains[elem]
          maxMoneyGain.task = elem
        }
      })
      ns.print(`Time to work: ${maxMoneyGain.task}`)
      ns.gang.setMemberTask(member, maxMoneyGain.task)
    }
  }
}
