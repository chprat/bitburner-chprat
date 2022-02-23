/** @param {NS} ns **/
export async function main (ns) {
  const num = (ns.args[0]) ? ns.args[0] : 1
  const buy = ns.args[1]
  const levels = 19
  const cores = 2
  const rams = 4
  const nodeCost = ns.hacknet.getPurchaseNodeCost()
  const ramCost = ns.hacknet.getRamUpgradeCost(0, rams)
  const coreCost = ns.hacknet.getCoreUpgradeCost(0, cores)
  const levelCost = ns.hacknet.getLevelUpgradeCost(0, levels)
  const totalCost = (nodeCost + ramCost + coreCost + levelCost) * num
  ns.tprint(`Total cost for ${num} new node(s): ${ns.nFormat(totalCost, '$0.000a')}`)
  if (buy === 'y') {
    for (let i = 0; i < num; ++i) {
      ns.hacknet.purchaseNode()
      const node = ns.hacknet.numNodes() - 1
      ns.hacknet.upgradeCore(node, cores)
      ns.hacknet.upgradeLevel(node, levels)
      ns.hacknet.upgradeRam(node, rams)
    }
    ns.tprint('Bought ' + num + ' new hacknet nodes')
  }
}
