/** @param {NS} ns **/
export async function main (ns) {
  while (true) {
    ns.run('deploy.js', 1, 'weaker.js', 1)
    ns.run('deploy.js', 1, 'hacker.js', 0)
    await ns.sleep(600000)
  }
}
