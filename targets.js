/** @param {NS} ns **/
export async function main (ns) {
  const infiltrations = []
  for (const infiltrationLocation of ns.infiltration.getPossibleLocations()) {
    infiltrations.push(ns.infiltration.getInfiltration(infiltrationLocation.name))
  }
  const sortedInfiltrations = infiltrations.sort((a, b) => a.reward.SoARep - b.reward.SoARep)
  for (const infiltration of sortedInfiltrations) {
    ns.tprint(`${infiltration.location.city} ${infiltration.location.name} ${infiltration.reward.SoARep}`)
  }
}
