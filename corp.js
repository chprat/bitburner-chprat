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
  const divisionName = 'toba'
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
  const adVertUpgradeCost = ns.corporation.getHireAdVertCost(divisionName)

  if (adVertUpgradeCost < officeUpgradeCost) {
    ns.print('AdVert is currently cheaper than office extension')
    if (adVertUpgradeCost < moneyAvail) {
      ns.print('Buying AdVert')
      ns.corporation.hireAdVert(divisionName)
    } else {
      ns.print('Not enough money to buy AdVert')
    }
  } else {
    ns.print('Office extension is currently cheaper than AdVert')
    if (officeUpgradeCost < moneyAvail) {
      ns.print('Extend the office')
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
      ns.print('Not enough money to extend office')
    }
  }
}

async function developNewProduct (ns, division, productName) {
  ns.print(`Develop new product ${productName} in ${division.name}`)
  ns.corporation.makeProduct(division.name, mainCity, productName, designInvest, marketingInvest)
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
      // await findBestPrice(ns, division, product)
    }
  }
}

function buyUpgrades (ns) {
  const oneTimeUpgrades = ['Smart Supply', 'Warehouse API', 'Office API']
  for (const oneTimeUpgrade of oneTimeUpgrades) {
    if (!ns.corporation.hasUnlockUpgrade(oneTimeUpgrade)) {
      if (ns.corporation.getCorporation().funds > ns.corporation.getUnlockUpgradeCost(oneTimeUpgrade)) {
        ns.corporation.unlockUpgrade(oneTimeUpgrade)
        ns.print(`Bought ${oneTimeUpgrade}!`)
      } else {
        ns.print(`Not enough funds to buy ${oneTimeUpgrade}!`)
      }
    } else {
      ns.print(`Already bought ${oneTimeUpgrade}!`)
    }
  }
}

function hasAPIAccess (ns) {
  return ns.corporation.hasUnlockUpgrade('Warehouse API') & ns.corporation.hasUnlockUpgrade('Office API')
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
    ns.corporation.expandCity("Agri", "Aevum")
    ns.corporation.expandCity("Agri", "Chongqing")
    ns.corporation.expandCity("Agri", "Sector-12")
    ns.corporation.expandCity("Agri", "New Tokyo")
    ns.corporation.expandCity("Agri", "Ishima")
    ns.corporation.expandCity("Agri", "Volhaven")
  }
  if (!hasAPIAccess(ns)) {
    ns.print("We don't have full API access, corp must be run manually!")
    return
  }
  while (true) {
    await smallTownAchievement(ns)
    const corp = ns.corporation.getCorporation()
    for (const division of corp.divisions) {
      if (division.makesProducts === true) {
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
