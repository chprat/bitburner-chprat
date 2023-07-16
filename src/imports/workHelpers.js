import { isAugInstalled } from 'imports/augmentationHelpers.js'

/** @param {NS} ns **/
export function getPrograms (ns) {
  ns.print('Check if we need a program')
  const programs = [
    { name: 'BruteSSH.exe', exists: false },
    { name: 'FTPCrack.exe', exists: false },
    { name: 'relaySMTP.exe', exists: false },
    { name: 'HTTPWorm.exe', exists: false },
    { name: 'SQLInject.exe', exists: false }
  ]
  programs.find(e => e.name === 'BruteSSH.exe').exists = ns.fileExists('BruteSSH.exe', 'home')
  programs.find(e => e.name === 'FTPCrack.exe').exists = ns.fileExists('FTPCrack.exe', 'home')
  programs.find(e => e.name === 'relaySMTP.exe').exists = ns.fileExists('relaySMTP.exe', 'home')
  programs.find(e => e.name === 'HTTPWorm.exe').exists = ns.fileExists('HTTPWorm.exe', 'home')
  programs.find(e => e.name === 'SQLInject.exe').exists = ns.fileExists('SQLInject.exe', 'home')
  return programs
}

/** @param {NS} ns **/
export function workForBladeburner (ns, ignoreSimulacrum = false) {
  if (!ignoreSimulacrum) {
    if (isAugInstalled(ns, "The Blade's Simulacrum", false)) {
      return true
    }
  }
  if (ns.getResetInfo().currentNode === 7) {
    return true
  }
  const bonusTime = ns.bladeburner.getBonusTime()
  if (bonusTime > 1000) {
    ns.print(`We have some bonus time, continuing... (${bonusTime})`)
    return true
  } else {
    ns.print(`No bonus time, nothing to do. (${bonusTime})`)
  }
  return false
}
