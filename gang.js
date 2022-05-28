/** @param {NS} ns **/
export async function main (ns) {
  if (!ns.gang.inGang()) {
    return
  }
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

  if (ns.gang.canRecruitMember()) {
    const newMemberName = `mem${members.length + 1}`
    ns.gang.recruitMember(newMemberName)
    ns.print(`New member ${newMemberName} recruited`)
    members.push(newMemberName)
    detailedMembers.push(ns.gang.getMemberInformation(newMemberName))
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
        ns.print(`Ascended ${member}`)
      }
    })
  }

  const gangInformation = ns.gang.getGangInformation()
  if ((1 - gangInformation.wantedPenalty) > 0.5 && !detailedMembers[0].task.startsWith('Vigilante')) {
    const task = tasks.find(element => element.startsWith('Vigilante'))
    ns.print(`Time to decrease the wanted level: ${task}`)
    for (const member of members) {
      ns.gang.setMemberTask(member, task)
    }
  } else if (gangInformation.wantedLevel < 2 && detailedMembers[0].task.startsWith('Vigilante')) {
    const task = tasks.find(element => element.startsWith('Run'))
    ns.print(`Time to work: ${task}`)
    for (const member of members) {
      ns.gang.setMemberTask(member, task)
    }
  }
}
