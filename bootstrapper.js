import { getPrograms } from 'imports/workHelpers.js'
import { getCrimeForWork } from 'imports/crimeHelpers.js'

/** @param {NS} ns **/
export async function main (ns) {
  const programs = getPrograms(ns)
  for (const program of programs) {
    if (program.exists) {
      continue
    }
    const currentWork = ns.singularity.getCurrentWork()
    if (ns.singularity.isBusy() && currentWork.type === 'CREATE_PROGRAM' && currentWork.programName === program.name) {
      return
    }
    const success = ns.singularity.createProgram(program.name, focus)
    if (!success) {
      ns.print(`Couldn't start working on ${program.name}`)
    } else {
      ns.print(`Started working on ${program.name}`)
    }
    break
  }
  if (ns.singularity.isBusy() && ns.singularity.getCurrentWork().type === 'CREATE_PROGRAM') {
    return
  }
  const crime = getCrimeForWork(ns)
  ns.singularity.commitCrime(crime)
}
