/** @param {NS} ns **/
function upgradePC (ns) {
  const canUpgradeRAM = ns.singularity.getUpgradeHomeRamCost() <= ns.getPlayer().money
  if (canUpgradeRAM) {
    const success = ns.singularity.upgradeHomeRam()
    if (!success) {
      ns.print("Couldn't upgrade home RAM")
    } else {
      ns.print('Upgraded home RAM')
    }
  } else {
    ns.print('Not enough money to upgrade home RAM')
  }
  const canUpgradeCores = ns.singularity.getUpgradeHomeCoresCost() <= ns.getPlayer().money
  if (canUpgradeCores) {
    const success = ns.singularity.upgradeHomeCores()
    if (!success) {
      ns.print("Couldn't upgrade home cores")
    } else {
      ns.print('Upgraded home cores')
    }
  } else {
    ns.print('Not enough money to upgrade home cores')
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  upgradePC(ns)
}
