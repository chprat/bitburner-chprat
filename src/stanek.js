/** @param {NS} ns */
function setup6Board (ns) {
  ns.stanek.placeFragment(3, 4, 0, 28)
  ns.stanek.placeFragment(0, 4, 0, 27)
  ns.stanek.placeFragment(3, 3, 0, 30)
  ns.stanek.placeFragment(0, 3, 0, 1)
  ns.stanek.placeFragment(1, 0, 0, 0)
  ns.stanek.placeFragment(0, 2, 2, 25)
  ns.stanek.placeFragment(3, 1, 3, 5)
  ns.stanek.placeFragment(4, 0, 1, 18)
}

/** @param {NS} ns */
export async function main (ns) {
  if (!ns.stanek.acceptGift()) {
    ns.print("Couldn't join the Church of the Machine God")
    return
  }
  const placedFragments = ns.stanek.activeFragments()
  const boosterFragmentID = 18
  const boardHeight = ns.stanek.giftHeight()
  const boardWidth = ns.stanek.giftWidth()
  const boardSize = (boardHeight === boardWidth) ? boardHeight : 0
  const boardFragments = ns.stanek.activeFragments().length

  if (boardSize === 6 && boardFragments === 0) {
    setup6Board(ns)
  }

  while (true) {
    for (const fragment of placedFragments) {
      // booster fragments can't be charged
      if (fragment.type !== boosterFragmentID) {
        await ns.stanek.chargeFragment(fragment.x, fragment.y)
      }
    }
  }
}

// fragment overview
// id fragment                       shape
//  0 hacking skill                  -Z
//  1 hacking skill                  Z
//  5 faster hack, grow, weaken      T
//  6 hack power                     I
//  7 grow power                     -L
// 10 strength                       T
// 12 defense                        L
// 14 dexterity                      L
// 16 agility                        -Z
// 18 charisma                       -Z
// 20 hacknet production             I
// 21 cheaper hacknet                O
// 25 faction + company reputation   -L
// 27 work money                     -L
// 28 crime money                    L
// 30 all bladeburner stats          -Z
