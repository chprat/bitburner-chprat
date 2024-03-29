/** @param {NS} ns **/
async function sleepOneCycle (ns) {
  await ns.sleep(10 * 1000)
}

/** @param {NS} ns **/
function getProductData (ns, division) {
  const productData = []
  for (const product of division.products) {
    productData.push(ns.corporation.getProduct(division.name, mainCity, product))
  }
  return productData
}

/** @param {NS} ns **/
function getLowestProduct (ns, division) {
  if (division.products.length === 0) {
    return undefined
  }
  const productData = getProductData(ns, division)
  const lowestProduct = productData.reduce((a, b) => a.rat < b.rat ? a : b)
  ns.print(`${lowestProduct.name} is the product with the lowest rating in ${division.name}`)
  return lowestProduct
}

/** @param {NS} ns **/
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

/** @param {NS} ns **/
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

/** @param {NS} ns **/
async function smallTownAchievement (ns) {
  const divisionName = 'Toba'
  const cityName = 'Aevum'
  const officeUpgradeSize = 15

  if (!doSmallTownAchievement) {
    ns.print('We don\'t want to do the SmallTownAchievement')
    return
  }

  const currentEmployeesNo = ns.corporation.getOffice(divisionName, cityName).employees
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
    while (ns.corporation.hireEmployee(divisionName, cityName)) {
      await ns.sleep(1000)
    }
    const newEmployeesNo = ns.corporation.getOffice(divisionName, cityName).employees
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

/** @param {NS} ns **/
function getFreeProductName (ns, division) {
  for (let i = 0; i < division.products.length + 1; i++) {
    const prodName = division.name.concat((i + 1).toString())
    try {
      ns.corporation.getProduct(division.name, mainCity, prodName)
    } catch (err) {
      return prodName
    }
  }
}

/** @param {NS} ns **/
async function developNewProduct (ns, division, productName) {
  ns.print(`Develop new product ${productName} in ${division.name}`)
  const corporationFunds = ns.corporation.getCorporation().funds
  const developmentCost = designInvest + marketingInvest
  try {
    if (corporationFunds > developmentCost) {
      ns.corporation.makeProduct(division.name, mainCity, productName, designInvest, marketingInvest)
    } else {
      ns.print(`Not enough money to develop new product ${productName} for ` +
        `${division.name} in ${mainCity} (has ${ns.formatNumber(corporationFunds)}, ` +
        `${ns.formatNumber(developmentCost)} required)`)
      return
    }
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

/** @param {NS} ns **/
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

/** @param {NS} ns **/
function maxConcurrentProducts (ns, division) {
  if (ns.corporation.hasResearched(division.name, researchNames.cap2)) {
    return 5
  } else if (ns.corporation.hasResearched(division.name, researchNames.cap1)) {
    return 4
  } else {
    return 3
  }
}

/** @param {NS} ns **/
function hasMaxProducts (ns, division) {
  const concurrentProducts = maxConcurrentProducts(ns, division)
  const maxedProducts = (division.products.length === concurrentProducts)
  ns.print(`${division.name} can have ${concurrentProducts} concurrent products, at max: ${maxedProducts}`)
  return maxedProducts
}

/** @param {NS} ns **/
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

/** @param {NS} ns **/
async function setProductSales (ns, division) {
  const products = getProductData(ns, division)
  for (const product of products) {
    if (product.developmentProgress < 100) {
      continue
    }
    if (product.desiredSellPrice === 0) {
      ns.print(`Sell ${product.name} in ${division.name}`)
      ns.corporation.sellProduct(division.name, mainCity, product.name, 'MAX', 'MP', true)
    }
    if (ns.corporation.hasResearched(division.name, researchNames.mta1) &&
        ns.corporation.hasResearched(division.name, researchNames.mta2)) {
      ns.print(`Enable Market-TA for ${product.name} in ${division.name}`)
      ns.corporation.setProductMarketTA1(division.name, product.name, true)
      ns.corporation.setProductMarketTA2(division.name, product.name, true)
    } else {
      if (product.desiredSellPrice === 'MP' || product.cityData[mainCity][0] > 0) {
        await findBestPrice(ns, division, product)
      }
    }
  }
}

/** @param {NS} ns **/
function hasAPIAccess (ns) {
  return ns.corporation.hasUnlock('Warehouse API') & ns.corporation.hasUnlock('Office API')
}

/** @param {NS} ns **/
function expandedToAllCities (ns, division) {
  return ns.corporation.getDivision(division).cities.length === cities.length
}

/** @param {NS} ns **/
function expandCities (ns, division) {
  if (expandedToAllCities(ns, division)) {
    ns.print(`${division} already expanded to all cities`)
    return true
  }
  const existingCities = ns.corporation.getDivision(division).cities
  for (const city of cities) {
    if (!existingCities.includes(city)) {
      if (ns.corporation.getCorporation().funds > ns.corporation.getConstants().officeInitialCost) {
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

/** @param {NS} ns **/
function purchasedAllWarehouses (ns, division) {
  const existingCities = ns.corporation.getDivision(division).cities
  for (const city of existingCities) {
    if (!ns.corporation.hasWarehouse(division, city)) {
      return false
    }
  }
  return true
}

/** @param {NS} ns **/
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
      if (ns.corporation.getCorporation().funds > ns.corporation.getConstants().warehouseInitialCost) {
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

/** @param {NS} ns **/
function raisedDivision (ns, division) {
  const { CorporationValuation } = ns.getBitNodeMultipliers()
  const employeeScalingFactor = 1 / CorporationValuation
  const existingCities = ns.corporation.getDivision(division).cities
  for (const city of existingCities) {
    if (city !== mainCity) {
      if (ns.corporation.getOffice(division, city).size < sideCityEmployees * employeeScalingFactor) {
        return false
      }
    } else {
      if (ns.corporation.getOffice(division, city).size < mainCityEmployees * employeeScalingFactor) {
        return false
      }
    }
  }
  return true
}

/** @param {NS} ns **/
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
    stats.employees = ns.corporation.getOffice(division, city).employees
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

  const officeUpgradeSize = (ns.corporation.getOffice(division, city.name).employees < 15) ? 3 : 15
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
      while (ns.corporation.hireEmployee(division, city.name)) {
        await ns.sleep(1000)
      }
      const newEmployeesNo = ns.corporation.getOffice(division, city.name).employees
      const employeesPerJob = Math.floor(newEmployeesNo / 5)
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

/** @param {NS} ns **/
function enableSmartSupply (ns) {
  for (const divisionName of ns.corporation.getCorporation().divisions) {
    const division = ns.corporation.getDivision(divisionName)
    for (const city of division.cities) {
      if (ns.corporation.hasWarehouse(division.name, city)) {
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
  }
  return true
}

/** @param {NS} ns **/
async function assignEmployees (ns) {
  for (const divisionName of ns.corporation.getCorporation().divisions) {
    const division = ns.corporation.getDivision(divisionName)
    for (const city of division.cities) {
      while (ns.corporation.hireEmployee(division.name, city)) {
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
      if (officeData.size === 30) {
        if (officeData.employeeJobs.Unassigned > 0) {
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Operations', 6)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Engineer', 6)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Business', 6)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Management', 6)
          await ns.corporation.setAutoJobAssignment(division.name, city, 'Research & Development', 6)
        }
      }
    }
  }
}

/** @param {NS} ns **/
function buyFirstAdVert (ns) {
  for (const divisionName of ns.corporation.getCorporation().divisions) {
    const division = ns.corporation.getDivision(divisionName)
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

/** @param {NS} ns **/
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

/** @param {NS} ns **/
function sellMaterials (ns, divisionName) {
  const division = ns.corporation.getDivision(divisionName)
  for (const city of division.cities) {
    for (const material of producedMaterials[division.type]) {
      if (ns.corporation.getMaterial(division.name, city, material).desiredSellPrice === 0) {
        ns.corporation.sellMaterial(division.name, city, material, 'MAX', 'MP')
      }
    }
  }
}

/** @param {NS} ns **/
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

/** @param {NS} ns **/
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

/** @param {NS} ns **/
async function buyMaterial (ns, divisionName, cityName, materialName, amount) {
  const material = ns.corporation.getMaterial(divisionName, cityName, materialName)
  const missingMat = amount - material.stored
  if (missingMat <= 0) {
    ns.corporation.buyMaterial(divisionName, cityName, materialName, 0)
    return true
  }
  if ((material.cost * missingMat) > ns.corporation.getCorporation().funds) {
    ns.print(`Not enough money to buy ${missingMat} of ${materialName}`)
    return false
  }
  ns.corporation.buyMaterial(divisionName, cityName, materialName, missingMat / 10)
  while (ns.corporation.getMaterial(divisionName, cityName, materialName).stored < amount) {
    await ns.sleep(100)
  }
  ns.corporation.buyMaterial(divisionName, cityName, materialName, 0)
  return true
}

/** @param {NS} ns **/
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
    },
    3: {
      materials: ['Hardware', 'Robots', 'AI Cores', 'Real Estate'],
      Hardware: 9300,
      Robots: 726,
      'AI Cores': 6270,
      'Real Estate': 230400
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

/** @param {NS} ns **/
function checkInvestmentOffer (ns, round) {
  const { CorporationValuation } = ns.getBitNodeMultipliers()
  const offers = {
    1: 210e9 * CorporationValuation,
    2: 5e12 * CorporationValuation,
    3: 800e12 * CorporationValuation,
    4: 10e15 * CorporationValuation
  }
  const offer = ns.corporation.getInvestmentOffer()
  if (round !== offer.round) {
    return true
  }
  if (round === 5) {
    if (!ns.corporation.getCorporation().public) {
      ns.corporation.goPublic(50e6)
      ns.corporation.issueDividends(0.9)
    }
    return true
  }
  if (offer.funds >= offers[round]) {
    ns.corporation.acceptInvestmentOffer()
    return true
  } else {
    ns.print(`Offer ${ns.formatNumber(offer.funds)} in round ${offer.round} is to low (${ns.formatNumber(offers[round])}).`)
    return false
  }
}

/** @param {NS} ns **/
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

/** @param {NS} ns **/
async function upgradeMainOfficeSize (ns, divisionName, newSize) {
  const division = ns.corporation.getDivision(divisionName)
  const currentSize = ns.corporation.getOffice(division.name, mainCity).size
  if (currentSize >= newSize) {
    return true
  }
  if (ns.corporation.getOfficeSizeUpgradeCost(division.name, mainCity, newSize - currentSize) > ns.corporation.getCorporation().funds) {
    ns.print(`Not enough money to upgrade ${mainCity} office of ${division.name} to ${newSize}`)
    return false
  }
  ns.corporation.upgradeOfficeSize(division.name, mainCity, newSize - currentSize)
  await assignEmployees(ns)
  return true
}

/** @param {NS} ns **/
function hasIndustry (ns, industry) {
  for (const divisionName of ns.corporation.getCorporation().divisions) {
    const division = ns.corporation.getDivision(divisionName)
    if (division.type === industry) {
      return true
    }
  }
  return false
}

/** @param {NS} ns **/
function expandIndustry (ns, industry, name) {
  if (hasIndustry(ns, industry)) {
    return true
  }
  if (ns.corporation.getIndustryData(industry).startingCost > ns.corporation.getCorporation().funds) {
    ns.print(`Not enough money to expand to ${industry}`)
    return false
  }
  ns.corporation.expandIndustry(industry, name)
  return true
}

/** @param {NS} ns **/
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
  if (!await buyMaterials(ns, 'Agri', 3)) {
    return false
  }
  if (!expandIndustry(ns, 'Tobacco', 'Toba')) {
    return false
  }
  if (!expandCities(ns, 'Toba')) {
    return false
  }
  if (!purchaseWarehouses(ns, 'Toba')) {
    return false
  }
  if (!await upgradeMainOfficeSize(ns, 'Toba', 30)) {
    return false
  }
  if (!await upgradeOfficeSize(ns, 'Toba', 9)) {
    return false
  }
  return true
}

/** @param {NS} ns **/
function research (ns, divisionName) {
  const division = ns.corporation.getDivision(divisionName)
  if (!ns.corporation.hasResearched(division.name, researchNames.lab)) {
    if (ns.corporation.getResearchCost(division.name, researchNames.lab) * 2 < division.research) {
      ns.corporation.research(division.name, researchNames.lab)
      return
    } else {
      return
    }
  }
  if (division.makesProducts === true) {
    if (!ns.corporation.hasResearched(division.name, researchNames.mta1) &&
          !ns.corporation.hasResearched(division.name, researchNames.mta2)) {
      let researchCost = ns.corporation.getResearchCost(division.name, researchNames.mta1)
      researchCost += ns.corporation.getResearchCost(division.name, researchNames.mta2)
      if (researchCost * 2 < division.research) {
        ns.corporation.research(division.name, researchNames.mta1)
        ns.corporation.research(division.name, researchNames.mta2)
        return
      } else {
        return
      }
    }
    for (const researchName of Object.values(researchNames)) {
      if (!ns.corporation.hasResearched(division.name, researchName)) {
        if (ns.corporation.getResearchCost(division.name, researchName) * 2 < division.research) {
          ns.corporation.research(division.name, researchName)
          return
        } else {
          return
        }
      }
    }
  }
}

/** @param {NS} ns **/
export async function main (ns) {
  if (!ns.corporation.hasCorporation()) {
    ns.print("You don't have a company!")
    const success = tryCreateCorp(ns)
    if (!success) {
      return
    }
  }
  if (ns.corporation.getCorporation().divisions.length === 0) {
    ns.print("You don't have a division, yet. Creating Agriculture sector")
    ns.corporation.expandIndustry('Agriculture', 'Agri')
    ns.corporation.purchaseUnlock('Smart Supply')
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
    doUpgrade(ns, 'FocusWires', 20)
    doUpgrade(ns, 'Neural Accelerators', 20)
    doUpgrade(ns, 'Speech Processor Implants', 20)
    doUpgrade(ns, 'Nuoptimal Nootropic Injector Implants', 20)
    if (ns.corporation.getCorporation().funds > 3e12) {
      doUpgrade(ns, 'Wilson Analytics', 14)
    }
    checkInvestmentOffer(ns, 3)
    checkInvestmentOffer(ns, 4)
    checkInvestmentOffer(ns, 5)
    const corp = ns.corporation.getCorporation()
    for (const divisionName of corp.divisions) {
      const division = ns.corporation.getDivision(divisionName)
      expandCities(ns, division.name)
      research(ns, division.name)
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
