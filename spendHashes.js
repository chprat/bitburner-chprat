/** @param {NS} ns **/
export async function main (ns) {
  while (true) {
    const upgrades = ns.hacknet.getHashUpgrades()
    const moneyUpgrade = upgrades.filter(s => s.includes('Sell for Money')).toString()
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
    await ns.sleep(600000)
  }
}
