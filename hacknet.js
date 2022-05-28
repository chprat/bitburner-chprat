export async function upgrade (ns, nodeId) {
  const newNodeMaxCost = 76000000
  const upgrades = [{ type: 'ram', cost: 0 },
    { type: 'core', cost: 0 },
    { type: 'level', cost: 0 }]
  upgrades.find(e => e.type === 'ram').cost = ns.hacknet.getRamUpgradeCost(nodeId, 1)
  upgrades.find(e => e.type === 'core').cost = ns.hacknet.getCoreUpgradeCost(nodeId, 1)
  upgrades.find(e => e.type === 'level').cost = ns.hacknet.getLevelUpgradeCost(nodeId, 1)
  const availUpgrades = upgrades.filter(e => e.cost !== Infinity).sort(function (a, b) { return a.cost - b.cost })
  if (availUpgrades.length === 0) { return false }
  if (availUpgrades[0].cost > ns.getPlayer().money) { return false }
  if (availUpgrades[0].cost > ns.hacknet.getPurchaseNodeCost()) {
    if ((ns.hacknet.getPurchaseNodeCost() < newNodeMaxCost) && (ns.getPlayer().money > newNodeMaxCost)) { ns.hacknet.purchaseNode() }
    return false
  }
  if (availUpgrades[0].type === 'ram') { ns.hacknet.upgradeRam(nodeId, 1) } else if (availUpgrades[0].type === 'core') { ns.hacknet.upgradeCore(nodeId, 1) } else if (availUpgrades[0].type === 'level') { ns.hacknet.upgradeLevel(nodeId, 1) } else { return false }
  return true
}

/** @param {NS} ns **/
export async function main (ns) {
  if (ns.hacknet.numNodes() === 0) {
    const nodeId = ns.hacknet.purchaseNode()
    if (nodeId === -1) {
      ns.print('Not enough money to buy your first node')
    }
  }
  let i = 0
  while (i < ns.hacknet.numNodes()) {
    while (await upgrade(ns, i) === true) { await ns.sleep(100) }
    i++
  }
  ns.print('HackNet script finished')
}
