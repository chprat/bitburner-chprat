async function sleepOneCycle (ns) {
  await ns.sleep(10 * 1000)
}

function getProductData (ns, division) {
  const productData = []
  for (const product of division.products) {
    productData.push(ns.corporation.getProduct(division.name, product))
  }
  return productData
}

function getLowestProduct (ns, division) {
  if (division.products.length === 0) {
    return undefined
  }
  const productData = getProductData(ns, division)
  const lowestProduct = productData.reduce((a, b) => a.rat < b.rat ? a : b)
  ns.print(`${lowestProduct.name} is the product with the lowest rating in ${division.name}`)
  return lowestProduct
}

function isDevelopingProduct (ns, division) {
  for (const product of getProductData(ns, division)) {
    if (product.developmentProgress < 100) {
      ns.print(`Division ${division.name} is currently developing a product`)
      return true
    }
  }
  ns.print(`Division ${division.name} is currently not developing a product`)
  return false
}

function tryCreateCorp (ns) {
  const success = ns.corporation.createCorporation(corpName)
  if (success) {
    ns.print(`Created corporation ${corpName}`)
    return true
  } else {
    ns.print('Couldn\'t create corporation! Do you have enough money?')
    return false
  }
}

async function smallTownAchievement (ns) {
  const divisionName = 'Toba'
  const cityName = 'Aevum'
  const officeUpgradeSize = 15

  if (!doSmallTownAchievement) {
    ns.print('We don\'t want to do the SmallTownAchievement')
    return
  }

  const currentEmployeesNo = ns.corporation.getOffice(divisionName, cityName).employees.length
  if (currentEmployeesNo > 3000) {
    ns.print(`We already have more than 3000 employees in ${divisionName}s ${cityName} office`)
    return
  }

  ns.print(`We bring ${divisionName}s ${cityName} office to 3000 employees for the SmallCityAchievement`)

  const moneyAvail = ns.corporation.getCorporation().funds
  const officeUpgradeCost = ns.corporation.getOfficeSizeUpgradeCost(divisionName, cityName, officeUpgradeSize)

  if (officeUpgradeCost < moneyAvail) {
    ns.print('(smalltown) Extend the office')
    ns.corporation.upgradeOfficeSize(divisionName, cityName, officeUpgradeSize)
    while (ns.corporation.hireEmployee(divisionName, cityName) !== undefined) {
      await ns.sleep(1000)
    }
    const newEmployeesNo = ns.corporation.getOffice(divisionName, cityName).employees.length
    const employeesPerJob = newEmployeesNo / 5
    await ns.corporation.setAutoJobAssignment(divisionName, cityName, 'Training', 0)
    await ns.corporation.setAutoJobAssignment(divisionName, cityName, 'Operations', employeesPerJob)
    await ns.corporation.setAutoJobAssignment(divisionName, cityName, 'Engineer', employeesPerJob)
    await ns.corporation.setAutoJobAssignment(divisionName, cityName, 'Business', employeesPerJob)
    await ns.corporation.setAutoJobAssignment(divisionName, cityName, 'Management', employeesPerJob)
    await ns.corporation.setAutoJobAssignment(divisionName, cityName, 'Research & Development', employeesPerJob)
  } else {
    ns.print('(smalltown) Not enough money to extend office')
  }
}

function getFreeProductName (ns, division) {
  for (let i = 0; i < division.products.length + 1; i++) {
    const prodName = division.name.concat((i + 1).toString())
    try {
      ns.corporation.getProduct(division.name, prodName)
    } catch (err) {
      return prodName
    }
  }
}

async function developNewProduct (ns, division, productName) {
  ns.print(`Develop new product ${productName} in ${division.name}`)
  try {
    ns.corporation.makeProduct(division.name, mainCity, productName, designInvest, marketingInvest)
  } catch (err) {
    const newProductName = getFreeProductName(ns, division)
    ns.print(`${productName} in ${division.name} already exists, retry ${newProductName}`)
    await developNewProduct(ns, division, newProductName)
  }
  if (ns.corporation.hasResearched(division.name, researchNames.dash)) {
    await sleepOneCycle(ns)
    ns.print(`Sell ${productName} in ${division.name}`)
    ns.corporation.sellProduct(division.name, mainCity, productName, 'MAX', 'MP', true)
    await sleepOneCycle(ns)
    if (ns.corporation.hasResearched(division.name, researchNames.mta1) &&
        ns.corporation.hasResearched(division.name, researchNames.mta2)) {
      ns.print(`Enable Market-TA for ${productName} in ${division.name}`)
      ns.corporation.setProductMarketTA1(division.name, productName, true)
      ns.corporation.setProductMarketTA2(division.name, productName, true)
    }
  }
}

async function thrashProductAndDevelopNew (ns, division) {
  const lowestProduct = getLowestProduct(ns, division)
  if (lowestProduct === undefined) {
    ns.print(`Couldn't find the lowest performing product for ${division.name}`)
    return
  }
  ns.print(`Discontinue ${lowestProduct.name} in ${division.name}`)
  ns.corporation.discontinueProduct(division.name, lowestProduct.name)
  await sleepOneCycle(ns)
  await developNewProduct(ns, division, lowestProduct.name)
}

function maxConcurrentProducts (ns, division) {
  if (ns.corporation.hasResearched(division.name, researchNames.cap2)) {
    return 5
  } else if (ns.corporation.hasResearched(division.name, researchNames.cap1)) {
    return 4
  } else {
    return 3
  }
}

function hasMaxProducts (ns, division) {
  const concurrentProducts = maxConcurrentProducts(ns, division)
  const maxedProducts = (division.products.length === concurrentProducts)
  ns.print(`${division.name} can have ${concurrentProducts} concurrent products, at max: ${maxedProducts}`)
  return maxedProducts
}

async function findBestPrice (ns, division, product) {
  let multi = 1
  ns.print(`Trying to find the best price of ${product.name} of ${division.name}`)
  ns.print(`Current stock of ${product.name} of ${division.name} in ${mainCity}: ${product.cityData[mainCity][0]}`)
  while (product.cityData[mainCity][0] === 0) {
    ns.print(`Current stock of ${product.name} of ${division.name} in ${mainCity}: ${product.cityData[mainCity][0]}`)
    multi += 1
    const price = 'MP*'.concat(multi.toString())
    ns.print(`Trying multiplier of ${multi}`)
    ns.corporation.sellProduct(division.name, mainCity, product.name, 'MAX', price, true)
    await sleepOneCycle(ns)
  }
  multi -= 1
  multi = (multi <= 0) ? 1 : multi
  ns.print(`${multi} seems to be the best price multiplier for ${product.name} of ${division.name}`)
  ns.corporation.sellProduct(division.name, mainCity, product.name, 'MAX', 'MP*'.concat(multi.toString()), true)
}

async function setProductSales (ns, division) {
  const products = getProductData(ns, division)
  for (const product of products) {
    if (product.developmentProgress < 100) {
      continue
    }
    if (product.sCost === 0) {
      ns.print(`Sell ${product.name} in ${division.name}`)
      ns.corporation.sellProduct(division.name, mainCity, product.name, 'MAX', 'MP', true)
    }
    if (ns.corporation.hasResearched(division.name, researchNames.mta1) &&
        ns.corporation.hasResearched(division.name, researchNames.mta2)) {
      ns.print(`Enable Market-TA for ${product.name} in ${division.name}`)
      ns.corporation.setProductMarketTA1(division.name, product.name, true)
      ns.corporation.setProductMarketTA2(division.name, product.name, true)
    } else {
      if (product.sCost === 'MP' || product.cityData[mainCity][0] > 0) {
        await findBestPrice(ns, division, product)
      }
    }
  }
}

function hasAPIAccess (ns) {
  return ns.corporation.hasUnlockUpgrade('Warehouse API') & ns.corporation.hasUnlockUpgrade('Office API')
}

function expandedToAllCities (ns, division) {
  return ns.corporation.getDivision(division).cities.length === cities.length
}

function expandCities (ns, division) {
  if (expandedToAllCities(ns, division)) {
    ns.print(`${division} already expanded to all cities`)
    return true
  }
  const existingCities = ns.corporation.getDivision(division).cities
  for (const city of cities) {
    if (!existingCities.includes(city)) {
      if (ns.corporation.getCorporation().funds > ns.corporation.getExpandCityCost()) {
        ns.print(`Expanded ${division} to ${city}`)
        ns.corporation.expandCity(division, city)
      } else {
        ns.print(`Not enough funds to expand ${division} to another city`)
        return false
      }
    }
  }
  return true
}

function purchasedAllWarehouses (ns, division) {
  const existingCities = ns.corporation.getDivision(division).cities
  for (const city of existingCities) {
    if (!ns.corporation.hasWarehouse(division, city)) {
      return false
    }
  }
  return true
}

function purchaseWarehouses (ns, division) {
  if (!expandedToAllCities(ns, division)) {
    ns.print(`${division} not expanded to all cities, not purchasing warehouses`)
    return false
  }
  if (purchasedAllWarehouses(ns, division)) {
    ns.print(`${division} already has all warehouses`)
    return true
  }
  const existingCities = ns.corporation.getDivision(division).cities
  for (const city of existingCities) {
    if (!ns.corporation.hasWarehouse(division, city)) {
      if (ns.corporation.getCorporation().funds > ns.corporation.getPurchaseWarehouseCost()) {
        ns.print(`Purchased warehouse for ${division} in ${city}`)
        ns.corporation.purchaseWarehouse(division, city)
      } else {
        ns.print(`Not enough funds to buy another warehouse for ${division}`)
        return false
      }
    }
  }
  return true
}

function raisedDivision (ns, division) {
  const existingCities = ns.corporation.getDivision(division).cities
  for (const city of existingCities) {
    if (city !== mainCity) {
      if (ns.corporation.getOffice(division, city).size < sideCityEmployees) {
        return false
      }
    } else {
      if (ns.corporation.getOffice(division, city).size < mainCityEmployees) {
        return false
      }
    }
  }
  return true
}

async function raiseDivision (ns, division) {
  if (!expandedToAllCities(ns, division)) {
    ns.print(`${division} not expanded to all cities, not raising it`)
    return
  }
  if (!purchasedAllWarehouses(ns, division)) {
    ns.print(`${division} doesn't has all warehouses, not raising it`)
    return
  }
  if (raisedDivision(ns, division)) {
    ns.print(`${division} already raised`)
    return
  }

  ns.print(`Raising ${division}`)

  const officeStats = []
  for (const city of cities) {
    const stats = { name: city, employees: 0 }
    stats.employees = ns.corporation.getOffice(division, city).employees.length
    officeStats.push(stats)
  }

  const minEmployees = Math.min(...officeStats.map(e => e.employees))
  const mainEmployees = officeStats.filter(e => e.name === mainCity)[0].employees

  let city = ''
  if (mainEmployees - minEmployees > employeeDifference) {
    city = officeStats.filter(e => e.employees === minEmployees)[0]
  } else {
    city = officeStats.filter(e => e.name === mainCity)[0]
  }

  const officeUpgradeSize = (ns.corporation.getOffice(division, city.name).employees.length < 15) ? 3 : 15
  const moneyAvail = ns.corporation.getCorporation().funds
  const officeUpgradeCost = ns.corporation.getOfficeSizeUpgradeCost(division, city.name, officeUpgradeSize)
  const adVertUpgradeCost = ns.corporation.getHireAdVertCost(division)

  if ((adVertUpgradeCost < officeUpgradeCost) && (city.name === mainCity)) {
    ns.print('AdVert is currently cheaper than office extension')
    if (adVertUpgradeCost < moneyAvail) {
      ns.print('Buying AdVert')
      ns.corporation.hireAdVert(division)
    } else {
      ns.print('Not enough money to buy AdVert')
    }
  } else {
    ns.print('Office extension is currently cheaper than AdVert')
    if (officeUpgradeCost < moneyAvail) {
      ns.print('Extend the office')
      ns.corporation.upgradeOfficeSize(division, city.name, officeUpgradeSize)
      while (ns.corporation.hireEmployee(division, city.name) !== undefined) {
        await ns.sleep(1000)
      }
      const newEmployeesNo = ns.corporation.getOffice(division, city.name).employees.length
      const employeesPerJob = newEmployeesNo / 5
      await ns.corporation.setAutoJobAssignment(division, city.name, 'Training', 0)
      await ns.corporation.setAutoJobAssignment(division, city.name, 'Operations', employeesPerJob)
      await ns.corporation.setAutoJobAssignment(division, city.name, 'Engineer', employeesPerJob)
      await ns.corporation.setAutoJobAssignment(division, city.name, 'Business', employeesPerJob)
      await ns.corporation.setAutoJobAssignment(division, city.name, 'Management', employeesPerJob)
      await ns.corporation.setAutoJobAssignment(division, city.name, 'Research & Development', employeesPerJob)
    } else {
      ns.print('Not enough money to extend office')
    }
  }
}

function enableSmartSupply (ns) {
  const divisions = ns.corporation.getCorporation().divisions
  for (const division of divisions) {
    for (const city of division.cities) {
      if (!ns.corporation.getWarehouse(division.name, city).smartSupplyEnabled) {
        if (ns.corporation.hasWarehouse(division.name, city)) {
          ns.corporation.setSmartSupply(division.name, city, true)
        } else {
          ns.print(`${city} of ${division.name} doesn't have a warehouse, can't enable SmartSupply!`)
          return false
        }
      }
    }
  }
  return true
}

async function assignEmployees (ns) {
  const divisions = ns.corporation.getCorporation().divisions
  for (const division of divisions) {
    for (const city of division.cities) {
      while (ns.corporation.hireEmployee(division.name, city) !== undefined) {
        await ns.sleep(1000)
      }
      const officeData = ns.corporation.getOffice(division.name, city)
      if (officeData.size === 3) {
        if (officeData.employeeJobs.Unassigned > 0) {
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Operations', 1)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Engineer', 1)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Business', 1)
        }
      }
      if (officeData.size === 9) {
        if (officeData.employeeJobs.Unassigned > 0) {
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Operations', 2)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Engineer', 2)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Business', 1)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Management', 2)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Research & Development', 2)
        }
      }
    }
  }
}

function buyFirstAdVert (ns) {
  const divisions = ns.corporation.getCorporation().divisions
  for (const division of divisions) {
    if (ns.corporation.getHireAdVertCount(division.name) === 0) {
      if (ns.corporation.getHireAdVertCost(division.name) <= ns.corporation.getCorporation().funds) {
        ns.corporation.hireAdVert(division.name)
      } else {
        ns.print(`Not enough money to buy 1st AdVert for ${division.name}`)
        return false
      }
    }
  }
  return true
}

function upgradeStorageSize (ns, division, size) {
  for (const city of cities) {
    if (!ns.corporation.hasWarehouse(division, city)) {
      ns.print(`${city} of ${division} doesn't have a warehouse, can't upgrade it!`)
      return false
    }
    while (ns.corporation.getWarehouse(division, city).size < size) {
      if (ns.corporation.getUpgradeWarehouseCost(division, city) <= ns.corporation.getCorporation().funds) {
        ns.corporation.upgradeWarehouse(division, city)
      } else {
        ns.print(`Not enough money to upgrade warehouse in ${city} of ${division}`)
        return false
      }
    }
  }
  return true
}

function sellMaterials (ns, divisionName) {
  const division = ns.corporation.getDivision(divisionName)
  for (const city of division.cities) {
    for (const material of producedMaterials[division.type]) {
      if (ns.corporation.getMaterial(division.name, city, material).sCost === 0) {
        ns.corporation.sellMaterial(division.name, city, material, 'MAX', 'MP')
      }
    }
  }
}

function doUpgrade (ns, upgradeName, targetLevel) {
  const currentLevel = ns.corporation.getUpgradeLevel(upgradeName)
  if (currentLevel >= targetLevel) {
    return true
  }
  if (ns.corporation.getUpgradeLevelCost(upgradeName) <= ns.corporation.getCorporation().funds) {
    ns.corporation.levelUpgrade(upgradeName)
  } else {
    ns.print(`Not enough money to upgrade ${upgradeName} to ${targetLevel}`)
    return false
  }
  return true
}

function buyFirstUpgrades (ns) {
  const upgrades = ['FocusWires', 'Neural Accelerators', 'Speech Processor Implants', 'Nuoptimal Nootropic Injector Implants', 'Smart Factories']
  for (let i = 1; i <= 2; i++) {
    for (const upgrade of upgrades) {
      if (!doUpgrade(ns, upgrade, i)) {
        return false
      }
    }
  }
  return true
}

async function buyMaterial (ns, divisionName, cityName, materialName, amount) {
  const material = ns.corporation.getMaterial(divisionName, cityName, materialName)
  const missingMat = amount - material.qty
  if (missingMat <= 0) {
    ns.corporation.buyMaterial(divisionName, cityName, materialName, 0)
    return true
  }
  if ((material.cost * missingMat) > ns.corporation.getCorporation().funds) {
    ns.print(`Not enough money to buy ${missingMat} of ${materialName}`)
    return false
  }
  ns.corporation.buyMaterial(divisionName, cityName, materialName, missingMat / 10)
  while (ns.corporation.getMaterial(divisionName, cityName, materialName).qty < amount) {
    await ns.sleep(100)
  }
  ns.corporation.buyMaterial(divisionName, cityName, materialName, 0)
  return true
}

async function buyMaterials (ns, divisionName, stage) {
  const materials = {
    1: {
      materials: ['Hardware', 'AI Cores', 'Real Estate'],
      Hardware: 125,
      'AI Cores': 75,
      'Real Estate': 27000
    },
    2: {
      materials: ['Hardware', 'Robots', 'AI Cores', 'Real Estate'],
      Hardware: 2800,
      Robots: 96,
      'AI Cores': 2520,
      'Real Estate': 146400
    }
  }
  const division = ns.corporation.getDivision(divisionName)
  for (const city of division.cities) {
    for (const material of materials[stage].materials) {
      if (!await buyMaterial(ns, division.name, city, material, materials[stage][material])) {
        return false
      }
    }
  }
  return true
}

function checkInvestmentOffer (ns, round) {
  const offers = {
    1: 210e9,
    2: 5e12
  }
  const offer = ns.corporation.getInvestmentOffer()
  if (round !== offer.round) {
    return true
  }
  if (offer.funds >= offers[round]) {
    ns.corporation.acceptInvestmentOffer()
    return true
  } else {
    ns.print(`Offer ${offer.funds} in round ${offer.round} is to low (${offers[round]}).`)
    return false
  }
}

async function upgradeOfficeSize (ns, divisionName, newSize) {
  const division = ns.corporation.getDivision(divisionName)
  for (const city of division.cities) {
    const currentSize = ns.corporation.getOffice(division.name, city).size
    if (currentSize >= newSize) {
      continue
    }
    if (ns.corporation.getOfficeSizeUpgradeCost(division.name, city, newSize - currentSize) > ns.corporation.getCorporation().funds) {
      ns.print(`Not enough money to upgrade ${city} office of ${division.name} to ${newSize}`)
      return false
    }
    ns.corporation.upgradeOfficeSize(division.name, city, newSize - currentSize)
  }
  await assignEmployees(ns)
  return true
}

async function initialSetup (ns) {
  if (!purchaseWarehouses(ns, 'Agri')) {
    return false
  }
  if (!enableSmartSupply(ns)) {
    return false
  }
  await assignEmployees(ns)
  if (!buyFirstAdVert(ns)) {
    return false
  }
  if (!upgradeStorageSize(ns, 'Agri', 300)) {
    return false
  }
  sellMaterials(ns, 'Agri')
  if (!buyFirstUpgrades(ns)) {
    return false
  }
  if (!await buyMaterials(ns, 'Agri', 1)) {
    return false
  }
  if (!checkInvestmentOffer(ns, 1)) {
    return false
  }
  if (!await upgradeOfficeSize(ns, 'Agri', 9)) {
    return false
  }
  if (!doUpgrade(ns, 'Smart Factories', 10)) {
    return false
  }
  if (!doUpgrade(ns, 'Smart Storage', 10)) {
    return false
  }
  if (!upgradeStorageSize(ns, 'Agri', 2000)) {
    return false
  }
  if (!await buyMaterials(ns, 'Agri', 2)) {
    return false
  }
  if (!checkInvestmentOffer(ns, 2)) {
    return false
  }
  if (!upgradeStorageSize(ns, 'Agri', 3800)) {
    return false
  }
  return true
}

/** @param {NS} ns **/
export async function main (ns) {
  if (!ns.getPlayer().hasCorporation) {
    ns.print("You don't have a company!")
    const success = tryCreateCorp(ns)
    if (!success) {
      return
    }
  }
  if (ns.corporation.getCorporation().divisions.length === 0) {
    ns.print("You don't have a division, yet. Creating Agriculture sector")
    ns.corporation.expandIndustry('Agriculture', 'Agri')
    ns.corporation.unlockUpgrade('Smart Supply')
    expandCities(ns, 'Agri')
  }
  if (!hasAPIAccess(ns)) {
    ns.print("We don't have full API access, corp must be run manually!")
    return
  }
  if (!await initialSetup(ns)) {
    ns.print('Still setting up the company!')
    return
  }
  while (true) {
    await smallTownAchievement(ns)
    const corp = ns.corporation.getCorporation()
    for (const division of corp.divisions) {
      expandCities(ns, division.name)
      purchaseWarehouses(ns, division.name)
      if (division.makesProducts === true) {
        await raiseDivision(ns, division.name)
        await setProductSales(ns, division)
        if (isDevelopingProduct(ns, division) === false) {
          if (hasMaxProducts(ns, division)) {
            await thrashProductAndDevelopNew(ns, division)
          } else {
            await developNewProduct(ns, division, division.name.concat((division.products.length + 1).toString()))
          }
        }
      }
    }
    await sleepOneCycle(ns)
    ns.print('')
  }
}

const corpName = 'MiniCorp'
const mainCity = 'Aevum'
const mainCityEmployees = 300
const employeeDifference = 60
const sideCityEmployees = mainCityEmployees - employeeDifference
const designInvest = 1e9
const marketingInvest = 1e9
const doSmallTownAchievement = false

const researchNames = {
  lab: 'Hi-Tech R&D Laboratory',
  mta1: 'Market-TA.I',
  mta2: 'Market-TA.II',
  fulc: 'uPgrade: Fulcrum',
  dash: 'uPgrade: Dashboard',
  cap1: 'uPgrade: Capacity.I',
  cap2: 'uPgrade: Capacity.II'
}

const producedMaterials = {
  Agriculture: ['Plants', 'Food']
}

const cities = ['Aevum', 'Chongqing', 'Sector-12', 'New Tokyo', 'Ishima', 'Volhaven']
