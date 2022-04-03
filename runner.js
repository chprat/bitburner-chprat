/** @param {NS} ns **/
export async function main (ns) {
  ns.run('rooter.js', 1)
  ns.run('deployer.js', 1)
  ns.run('solver.js', 1)
  ns.run('hacker.js', 80)
}
