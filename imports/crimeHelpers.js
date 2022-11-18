export function getCrimeForWork (ns) {
  let crime = 'Shoplift'
  if (ns.getPlayer().skills.dexterity >= 15) {
    crime = 'Rob Store'
  }
  if (ns.getPlayer().skills.dexterity >= 25) {
    crime = 'Mug'
  }
  if (ns.getPlayer().skills.dexterity >= 35) {
    crime = 'Larceny'
  }
  if (ns.getPlayer().skills.dexterity >= 95) {
    crime = 'Deal Drugs'
  }
  if (ns.getPlayer().skills.dexterity >= 200) {
    crime = 'Bond Forgery'
  }
  if (ns.getPlayer().skills.dexterity >= 300) {
    crime = 'Traffic Illegal Arms'
  }
  if (ns.getPlayer().skills.dexterity >= 300) {
    crime = 'Homicide'
  }
  if (ns.getPlayer().skills.dexterity >= 500) {
    crime = 'Grand Theft Auto'
  }
  if (ns.getPlayer().skills.dexterity >= 600) {
    crime = 'Kidnap and Ransom'
  }
  if (ns.getPlayer().skills.dexterity >= 700) {
    crime = 'Assassinate'
  }
  if (ns.getPlayer().skills.dexterity >= 800) {
    crime = 'Heist'
  }
  return crime
}
