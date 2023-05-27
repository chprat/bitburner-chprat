import { listServers } from 'imports/scanner.js'

/** @param {NS} ns **/
function own (ns, server) {
  let srv = ns.getServer(server)
  const hackingLevel = ns.getHackingLevel()
  if (srv.requiredHackingSkill > hackingLevel) {
    return
  }
  const hasBruteSSH = ns.fileExists('BruteSSH.exe', 'home')
  const hasFTPCrack = ns.fileExists('FTPCrack.exe', 'home')
  const hasRelaySMTP = ns.fileExists('relaySMTP.exe', 'home')
  const hasHTTPWorm = ns.fileExists('HTTPWorm.exe', 'home')
  const hasSQLInject = ns.fileExists('SQLInject.exe', 'home')
  if (!srv.hasAdminRights) {
    if (hasBruteSSH && !srv.sshPortOpen) {
      ns.brutessh(server)
    }
    if (hasFTPCrack && !srv.ftpPortOpen) {
      ns.ftpcrack(server)
    }
    if (hasRelaySMTP && !srv.smtpPortOpen) {
      ns.relaysmtp(server)
    }
    if (hasHTTPWorm && !srv.httpPortOpen) {
      ns.httpworm(server)
    }
    if (hasSQLInject && !srv.sqlPortOpen) {
      ns.sqlinject(server)
    }
    srv = ns.getServer(server)
    if (srv.openPortCount >= srv.numOpenPortsRequired) {
      ns.nuke(server)
    }
  } else {
    if (!srv.sshPortOpen && hasBruteSSH) {
      ns.brutessh(server)
    }
    if (!srv.ftpPortOpen && hasFTPCrack) {
      ns.ftpcrack(server)
    }
    if (!srv.smtpPortOpen && hasRelaySMTP) {
      ns.relaysmtp(server)
    }
    if (!srv.httpPortOpen && hasHTTPWorm) {
      ns.httpworm(server)
    }
    if (!srv.sqlPortOpen && hasSQLInject) {
      ns.sqlinject(server)
    }
    if (!srv.backdoorInstalled) {
      ns.print(`${server} has no backdoor installed`)
    }
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  ns.disableLog('getHackingLevel')
  ns.disableLog('sleep')
  ns.disableLog('brutessh')
  ns.disableLog('ftpcrack')
  ns.disableLog('relaysmtp')
  ns.disableLog('httpworm')
  ns.disableLog('sqlinject')
  ns.disableLog('nuke')
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
    .filter(s => !s.includes('psrv'))
    .filter(s => !s.includes('hacknet-server'))
  while (true) {
    for (const server of servers) {
      own(ns, server)
    }
    const sleepTime = (Math.floor((Date.now() - ns.getResetInfo().lastAugReset) / (1000 * 60)) < 30) ? 60000 : 600000
    await ns.sleep(sleepTime)
  }
}
