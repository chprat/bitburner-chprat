export async function upgrade (ns, nodeId) {
  const newNodeMaxCost = 76000000
  const upgrades = [{ type: 'ram', cost: 0 },
    { type: 'core', cost: 0 },
    { type: 'level', cost: 0 },
    { type: 'cache', cost: 0 }]
  upgrades.find(e => e.type === 'ram').cost = ns.hacknet.getRamUpgradeCost(nodeId, 1)
  upgrades.find(e => e.type === 'core').cost = ns.hacknet.getCoreUpgradeCost(nodeId, 1)
  upgrades.find(e => e.type === 'level').cost = ns.hacknet.getLevelUpgradeCost(nodeId, 1)
  upgrades.find(e => e.type === 'cache').cost = ns.hacknet.getCacheUpgradeCost(nodeId, 1)
  const availUpgrades = upgrades.filter(e => e.cost !== Infinity).sort(function (a, b) { return a.cost - b.cost })
  if (availUpgrades.length === 0) {
    ns.print(`No upgrade available for node ${nodeId}`)
    return false
  }
  if (availUpgrades[0].cost > ns.getPlayer().money) {
    ns.print(`Upgrades to expensive for ${nodeId}`)
    return false
  }
  const newNodeCost = ns.hacknet.getPurchaseNodeCost()
  if ((newNodeCost === Infinity) && (nodeId !== 0)) {
    ns.print('All servers bought, only upgrade the first one')
    return false
  }
  if (availUpgrades[0].cost > newNodeCost) {
    ns.print(`Upgrades to expensive for ${nodeId}, prefer buying a new node instead`)
    if ((newNodeCost < newNodeMaxCost) && (ns.getPlayer().money > newNodeCost)) {
      ns.print(`Upgrades to expensive for ${nodeId}, buying a new node instead`)
      ns.hacknet.purchaseNode()
    }
    return false
  }
  if (availUpgrades[0].type === 'ram') {
    ns.print(`Upgrading RAM for node ${nodeId}`)
    ns.hacknet.upgradeRam(nodeId, 1)
  } else if (availUpgrades[0].type === 'core') {
    ns.print(`Upgrading CPU for node ${nodeId}`)
    ns.hacknet.upgradeCore(nodeId, 1)
  } else if (availUpgrades[0].type === 'level') {
    ns.print(`Upgrading level for node ${nodeId}`)
    ns.hacknet.upgradeLevel(nodeId, 1)
  } else if (availUpgrades[0].type === 'cache') {
    ns.print(`Upgrading cache for node ${nodeId}`)
    ns.hacknet.upgradeCache(nodeId, 1)
  } else {
    ns.print(`Unknown update type for node ${nodeId}`)
    return false
  }
  return true
}

function hashes (ns) {
  const upgrades = ns.hacknet.getHashUpgrades()
  const corpFundUpgrade = upgrades.filter(s => s.includes('Corporation Funds')).toString()
  const corpResearchUpgrade = upgrades.filter(s => s.includes('Corporation Research')).toString()
  const moneyUpgrade = upgrades.filter(s => s.includes('Sell for Money')).toString()
  if (ns.corporation.hasCorporation()) {
    if ((ns.hacknet.getHashUpgradeLevel(corpFundUpgrade) < 10) && (ns.hacknet.numHashes() >= ns.hacknet.hashCost(corpFundUpgrade))) {
      ns.hacknet.spendHashes(corpFundUpgrade)
      ns.print('Spent hashes for corporation funds.')
    }
    if ((ns.hacknet.getHashUpgradeLevel(corpResearchUpgrade) < 10) && (ns.hacknet.numHashes() >= ns.hacknet.hashCost(corpResearchUpgrade))) {
      ns.hacknet.spendHashes(corpResearchUpgrade)
      ns.print('Spent money for corporation research.')
    }
  } else {
    ns.print("No corporation, can't spend hashes for it!")
  }
  let i = 0
  while (ns.hacknet.numHashes() >= ns.hacknet.hashCost(moneyUpgrade)) {
    i += 1
    const ret = ns.hacknet.spendHashes(moneyUpgrade)
    if (!ret) {
      ns.print('Error trading hashes for money!')
    }
  }
  if (i > 0) {
    ns.print(`Traded hashes for money ${i} times.`)
  }
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
  hashes(ns)
  ns.print('HackNet script finished')
}
