/** @param {NS} ns */
function wseAccount (ns) {
  const hasWSEAccount = ns.stock.hasWSEAccount()
  if (!hasWSEAccount) {
    const cost = ns.stock.getConstants().WSEAccountCost
    if (ns.getPlayer().money > cost) {
      return ns.stock.purchaseWseAccount()
    }
  }
  return hasWSEAccount
}

/** @param {NS} ns */
function tixAPI (ns) {
  const hasTIXAPIAccess = ns.stock.hasTIXAPIAccess()
  if (!hasTIXAPIAccess) {
    const cost = ns.stock.getConstants().TIXAPICost
    if (ns.getPlayer().money > cost) {
      return ns.stock.purchaseTixApi()
    }
  }
  return hasTIXAPIAccess
}

/** @param {NS} ns */
function MD4SData (ns) {
  const hasMD4SData = ns.stock.has4SData()
  if (!hasMD4SData) {
    const cost = ns.stock.getConstants().MarketData4SCost * 1.5
    if (ns.getPlayer().money > cost) {
      return ns.stock.purchase4SMarketData()
    }
  }
  return hasMD4SData
}

/** @param {NS} ns */
function tix4SAPI (ns) {
  const hasTIX4SAPIAccess = ns.stock.has4SDataTIXAPI()
  if (!hasTIX4SAPIAccess) {
    const cost = ns.stock.getConstants().MarketDataTixApi4SCost * 1.5
    if (ns.getPlayer().money > cost) {
      return ns.stock.purchase4SMarketDataTixApi()
    }
  }
  return hasTIX4SAPIAccess
}

/** @param {NS} ns */
function initStockData (ns, stockSymbols) {
  // prepare array with stock price performance
  const stockData = []
  for (const stock of stockSymbols) {
    stockData.push({
      sym: stock,
      values: [ns.stock.getPrice(stock)],
      lastAvg: 0,
      trends: [],
      valid: false,
      positive: 0,
      forecast: 0,
      volatility: 0
    })
  }
  return stockData
}

/** @param {NS} ns */
function initPortfolio (ns, stockSymbols) {
  const portfolio = []
  ns.print('Starting run - Do we own any stocks?')
  for (const stock of stockSymbols) {
    const pos = ns.stock.getPosition(stock)
    if (pos[0] > 0) {
      portfolio.push({ sym: stock, lValue: pos[1], lShares: pos[0], sValue: pos[3], sShares: pos[2] })
      ns.print(`Detected: ${stock}, long quant: ${ns.formatNumber(pos[0])} @ ${ns.formatNumber(pos[1])}$, short quant: ${ns.formatNumber(pos[2])} @ ${ns.formatNumber(pos[3])}$`)
    }
  }
  return portfolio
}

/** @param {NS} ns */
function buyLongStock (ns, stock, use4S, amt = 0) {
  const maxShares = ns.stock.getMaxShares(stock)
  const commission = ns.stock.getConstants().StockMarketCommission
  const singlePrice = ns.stock.getPrice(stock)
  let amount = (() => {
    if (amt === 0) {
      const moneyKeep = 1e6
      const money = ns.getPlayer().money - commission - moneyKeep
      const shares = Math.floor(money / singlePrice)
      if (shares > 0) {
        return (shares > maxShares) ? maxShares : shares
      } else {
        return 0
      }
    }
    if (amt > maxShares) {
      return (amt > 0) ? maxShares : 0
    }
    return (amt > 0) ? amt : 0
  })()
  if (amount === 0) {
    return
  }
  const price = (() => {
    let tPrice = ns.stock.getPurchaseCost(stock, amount, 'Long')
    while (tPrice > ns.getPlayer().money) {
      amount--
      tPrice = ns.stock.getPurchaseCost(stock, amount, 'Long')
    }
    return tPrice
  })()

  if (price > ns.getPlayer().money) {
    ns.print(`Can't buy ${amount} shares of ${stock}, we don't have enough money`)
    return
  }
  const sharePrice = ns.stock.buyStock(stock, amount)
  if (sharePrice === 0) {
    ns.print(`Couldn't buy ${amount} shares of ${stock}`)
    return
  }
  return { sym: stock, lValue: sharePrice, lShares: amount, sValue: 0, sShares: 0 }
}

/** @param {NS} ns */
function sellStocks (ns, portfolio, sortedStockData, use4S) {
  let tPortfolio = portfolio
  let didSell = false
  // const commission = ns.stock.getConstants().StockMarketCommission
  for (const stock of portfolio) {
    if (stock.lShares > 0) {
      // const buyPrice = stock.lShares * stock.lValue + commission
      // const sellPrice = ns.stock.getSaleGain(stock.sym, stock.lShares, 'Long')
      // TODO: trends
      // if (sellPrice > (buyPrice + (buyPrice / 10)) && sortedStockData.find(e => e.sym === stock.sym).trend < 0) {
      const sell = use4S
        ? sortedStockData.find(e => e.sym === stock.sym).forecast < 0.6
        : sortedStockData.find(e => e.sym === stock.sym).positive < 5
      if (sell) {
        const sold = ns.stock.sellStock(stock.sym, stock.lShares)
        if (sold === 0) {
          ns.print(`Selling ${stock.lShares} shares of ${stock.sym} failed!`)
        } else {
          didSell = true
          tPortfolio = tPortfolio.filter(e => e.sym !== stock.sym)
        }
      }
    }
    if (stock.sShares > 0) {
      ns.print('Short stocks currently not implemented')
    }
  }
  return (didSell) ? tPortfolio : false
}

/** @param {NS} ns */
function stocksSMA (ns, stockSymbols, stockData) {
  for (const stock of stockSymbols) {
    stockData.find(e => e.sym === stock).values.push(ns.stock.getPrice(stock))
    if (stockData.find(e => e.sym === stock).values.length > 10) {
      stockData.find(e => e.sym === stock).values.shift()
      const stockHistory = stockData.find(e => e.sym === stock).values
      const sma = stockHistory.reduce((a, b) => (a + b)) / stockHistory.length
      if (stockData.find(e => e.sym === stock).lastAvg !== 0) {
        const lastAvg = stockData.find(e => e.sym === stock).lastAvg
        const trends = stockData.find(e => e.sym === stock).trends
        trends.push((sma - lastAvg) / lastAvg)
        if (trends.length > 10) {
          trends.shift()
          let pos = 0
          for (const trend of trends) {
            if (trend > 0) {
              pos++
            }
          }
          stockData.find(e => e.sym === stock).positive = pos
          if (stockData.find(e => e.sym === stock).valid === false) {
            stockData.find(e => e.sym === stock).valid = true
          }
        }
        stockData.find(e => e.sym === stock).trends = trends
      }
      stockData.find(e => e.sym === stock).lastAvg = sma
    }
  }
  return stockData
}

/** @param {NS} ns */
function stocks4S (ns, stockSymbols, stockData) {
  for (const stock of stockSymbols) {
    stockData.find(e => e.sym === stock).forecast = ns.stock.getForecast(stock)
    stockData.find(e => e.sym === stock).volatility = ns.stock.getVolatility(stock)
  }
  return stockData
}

/** @param {NS} ns */
// export function so the linter will not complain that it's unused
export function printStockData (ns, stockData, use4S = false) {
  for (const stock of stockData) {
    const red = '\u001b[31m'
    const reset = '\u001b[0m'
    let trendString = ''
    for (const trend of stock.trends) {
      if (trend > 0) {
        trendString += ns.vsprintf('%.4f ', trend)
      } else {
        trendString += ns.vsprintf(`${red}%.4f${reset} `, trend)
      }
    }
    if (use4S) {
      ns.print(`${stock.sym} $${ns.formatNumber(ns.stock.getPrice(stock.sym))} forecast: ${ns.formatNumber(stock.forecast)} volatility: ${ns.formatNumber(stock.volatility)}`)
    } else {
      ns.print(`${stock.sym} $${ns.formatNumber(stock.lastAvg)} ${trendString}`)
    }
  }
  ns.print(' ')
}

/** @param {NS} ns */
export async function main (ns) {
  ns.disableLog('sleep')
  if (!wseAccount(ns)) {
    ns.print("WSE account missing, can't continue")
    return
  }

  if (!tixAPI(ns)) {
    ns.print("TIX API access missing, can't continue")
    return
  }

  const stockSymbols = ns.stock.getSymbols()
  let stockData = initStockData(ns, stockSymbols)
  let portfolio = initPortfolio(ns, stockSymbols)

  ns.print('Transitioning into loop')
  while (true) {
    const use4S = MD4SData(ns) && tix4SAPI(ns)

    // update stock price history performance
    stockData = use4S ? stocks4S(ns, stockSymbols, stockData) : stocksSMA(ns, stockSymbols, stockData)

    // wait until stockData has enough data
    if (!use4S && stockData[0].valid === false) {
      ns.print('stockData not ready yet, waiting')
      await ns.sleep(6000)
      continue
    }
    const sortedStockData = use4S
      ? stockData.sort((a, b) => b.forecast - a.forecast)
      : stockData.sort((a, b) => b.trends[b.trends.length - 1] - a.trends[a.trends.length - 1])
    const limitedStockData = use4S
      ? sortedStockData
        .filter(e => e.forecast > 0.6)
      : sortedStockData
        .filter(e => e.trends[e.trends.length - 1] > 0.002)
        .filter(e => e.positive > 8)
        .filter(e => e.trends[e.trends.length - 1] > 0)
        .filter(e => e.trends[e.trends.length - 2] > 0)

    // printStockData(ns, sortedStockData.slice(0, 5), use4S)
    // printStockData(ns, stockData.filter(a => portfolio.some(b => a.sym === b.sym)), use4S)

    // buy shares if we do not own any shares of the stock
    if (!ns.fileExists('dontbuyshares.txt')) {
      for (const stock of limitedStockData) {
        if (!portfolio.find(e => e.sym === stock.sym)) {
          const bought = buyLongStock(ns, stock.sym, use4S)
          if (bought) {
            portfolio.push(bought)
            break
          }
        }
      }
    }

    // check if we should sell any shares
    const sold = sellStocks(ns, portfolio, sortedStockData, use4S)
    if (sold) {
      portfolio = sold
    }
    await ns.sleep(6000)
  }
}
