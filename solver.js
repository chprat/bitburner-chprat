import { listServers } from 'imports/scanner.js'
import { arrayJumpingGame2 } from 'imports/arrayJumpingGame2.js'
import { shortestPathInAGrid } from 'imports/shortestPathInAGrid.js'
import { totalWaysToSum2 } from 'imports/totalWaysToSum2.js'
import { hammingEncode } from 'imports/hammingEncode.js'
import { hammingDecode } from 'imports/hammingDecode.js'

function solve (type, data, server, contract, ns) {
  let solution = '~'
  switch (type) {
    case 'Algorithmic Stock Trader I':
      solution = maxProfit([1, data])
      break
    case 'Algorithmic Stock Trader II':
      solution = maxProfit([Math.ceil(data.length / 2), data])
      break
    case 'Algorithmic Stock Trader III':
      solution = maxProfit([2, data])
      break
    case 'Algorithmic Stock Trader IV':
      solution = maxProfit(data)
      break
    case 'Minimum Path Sum in a Triangle':
      solution = solveTriangleSum(data)
      break
    case 'Unique Paths in a Grid I':
      solution = uniquePathsI(data)
      break
    case 'Unique Paths in a Grid II':
      solution = uniquePathsII(data)
      break
    case 'Generate IP Addresses':
      solution = generateIps(data)
      break
    case 'Find Largest Prime Factor':
      solution = factor(data)
      break
    case 'Spiralize Matrix':
      solution = spiral(data)
      break
    case 'Merge Overlapping Intervals':
      solution = mergeOverlap(data)
      break
    case 'Total Ways to Sum':
      solution = numberOfWays(data)
      break
    case 'Subarray with Maximum Sum':
      solution = solveSum(data)
      break
    case 'Sanitize Parentheses in Expression':
      solution = sanitizeParentheses(data)
      break
    case 'Array Jumping Game':
      solution = (solveJump(data)) ? 1 : 0
      break
    case 'Array Jumping Game II':
      solution = (arrayJumpingGame2(data))
      break
    case 'Find All Valid Math Expressions':
      solution = getExprs(data)
      break
    case 'Shortest Path in a Grid':
      solution = shortestPathInAGrid(data)
      break
    case 'Total Ways to Sum II':
      solution = totalWaysToSum2(data)
      break
    case 'HammingCodes: Integer to Encoded Binary':
      solution = hammingEncode(data)
      break
    case 'HammingCodes: Encoded Binary to Integer':
      solution = hammingDecode(data)
      break
  }
  return (solution !== '~') ? ns.codingcontract.attempt(solution, contract, server, { returnReward: true }) : ''
}

/** @param {NS} ns **/
export async function main (ns) {
  ns.disableLog('codingcontract.attempt')
  ns.disableLog('sleep')
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
    .filter(s => !s.includes('psrv'))
  while (true) {
    const contracts = servers.flatMap((s) => {
      const onServer = ns.ls(s, '.cct').map((contract) => {
        const type = ns.codingcontract.getContractType(contract, s)
        const data = ns.codingcontract.getData(contract, s)
        const didSolve = solve(type, data, s, contract, ns)
        return `${s} - ${contract} - ${type} - ${didSolve || 'FAILED!'}`
      })
      return onServer
    })
    contracts.filter(s => s.includes('FAILED'))
      .forEach((contract) => ns.print(contract))
    await ns.sleep(600000)
  }
}

function maxProfit (arrayData) {
  let i, j, k
  const maxTrades = arrayData[0]
  const stockPrices = arrayData[1]
  let tempStr = '[0'
  for (i = 0; i < stockPrices.length; i++) {
    tempStr += ',0'
  }
  tempStr += ']'
  let tempArr = '[' + tempStr
  for (i = 0; i < maxTrades - 1; i++) {
    tempArr += ',' + tempStr
  }
  tempArr += ']'
  const highestProfit = JSON.parse(tempArr)
  for (i = 0; i < maxTrades; i++) {
    for (j = 0; j < stockPrices.length; j++) {
      for (k = j; k < stockPrices.length; k++) {
        if (i > 0 && j > 0 && k > 0) {
          highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j])
        } else if (i > 0 && j > 0) {
          highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j])
        } else if (i > 0 && k > 0) {
          highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i - 1][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j])
        } else if (j > 0 && k > 0) {
          highestProfit[i][k] = Math.max(highestProfit[i][k], highestProfit[i][k - 1], stockPrices[k] - stockPrices[j])
        } else {
          highestProfit[i][k] = Math.max(highestProfit[i][k], stockPrices[k] - stockPrices[j])
        }
      }
    }
  }
  return highestProfit[maxTrades - 1][stockPrices.length - 1]
}

function solveTriangleSum (arrayData) {
  const triangle = arrayData
  let nextArray
  let previousArray = triangle[0]
  for (let i = 1; i < triangle.length; i++) {
    nextArray = []
    for (let j = 0; j < triangle[i].length; j++) {
      if (j === 0) {
        nextArray.push(previousArray[j] + triangle[i][j])
      } else if (j === triangle[i].length - 1) {
        nextArray.push(previousArray[j - 1] + triangle[i][j])
      } else {
        nextArray.push(Math.min(previousArray[j], previousArray[j - 1]) + triangle[i][j])
      }
    }
    previousArray = nextArray
  }
  return Math.min.apply(null, nextArray)
}

function uniquePathsI (grid) {
  const rightMoves = grid[0] - 1
  const downMoves = grid[1] - 1
  return Math.round(factorialDivision(rightMoves + downMoves, rightMoves) / (factorial(downMoves)))
}

function factorial (n) {
  return factorialDivision(n, 1)
}

function factorialDivision (n, d) {
  if (n === 0 || n === 1 || n === d) { return 1 }
  return factorialDivision(n - 1, d) * n
}

function uniquePathsII (grid, ignoreFirst = false, ignoreLast = false) {
  const rightMoves = grid[0].length - 1
  const downMoves = grid.length - 1
  let totalPossiblePaths = Math.round(factorialDivision(rightMoves + downMoves, rightMoves) / (factorial(downMoves)))
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 1 && (!ignoreFirst || (i !== 0 || j !== 0)) && (!ignoreLast || (i !== grid.length - 1 || j !== grid[i].length - 1))) {
        const newArray = []
        for (let k = i; k < grid.length; k++) {
          newArray.push(grid[k].slice(j, grid[i].length))
        }
        let removedPaths = uniquePathsII(newArray, true, ignoreLast)
        removedPaths *= uniquePathsI([i + 1, j + 1])
        totalPossiblePaths -= removedPaths
      }
    }
  }
  return totalPossiblePaths
}

function generateIps (num) {
  num = num.toString()
  const length = num.length
  const ips = []
  for (let i = 1; i < length - 2; i++) {
    for (let j = i + 1; j < length - 1; j++) {
      for (let k = j + 1; k < length; k++) {
        const ip = [
          num.slice(0, i),
          num.slice(i, j),
          num.slice(j, k),
          num.slice(k, num.length)
        ]
        let isValid = true
        ip.forEach(seg => {
          isValid = isValid && isValidIpSegment(seg)
        })
        if (isValid) ips.push(ip.join('.'))
      }
    }
  }
  return ips
}

function isValidIpSegment (segment) {
  if (segment[0] === '0' && segment !== '0') return false
  segment = Number(segment)
  if (segment < 0 || segment > 255) return false
  return true
}

function factor (num) {
  for (let div = 2; div <= Math.sqrt(num); div++) {
    if (num % div !== 0) {
      continue
    }
    num = num / div
    div = 1
  }
  return num
}

function spiral (arr, accum = []) {
  if (arr.length === 0 || arr[0].length === 0) {
    return accum
  }
  accum = accum.concat(arr.shift())
  if (arr.length === 0 || arr[0].length === 0) {
    return accum
  }
  accum = accum.concat(column(arr, arr[0].length - 1))
  if (arr.length === 0 || arr[0].length === 0) {
    return accum
  }
  accum = accum.concat(arr.pop().reverse())
  if (arr.length === 0 || arr[0].length === 0) {
    return accum
  }
  accum = accum.concat(column(arr, 0).reverse())
  if (arr.length === 0 || arr[0].length === 0) {
    return accum
  }
  return spiral(arr, accum)
}

function column (arr, index) {
  const res = []
  for (let i = 0; i < arr.length; i++) {
    const elm = arr[i].splice(index, 1)[0]
    if (elm) {
      res.push(elm)
    }
  }
  return res
}

function mergeOverlap (intervals) {
  intervals.sort(([minA], [minB]) => minA - minB)
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const [min, max] = intervals[i]
      const [laterMin, laterMax] = intervals[j]
      if (laterMin <= max) {
        const newMax = laterMax > max ? laterMax : max
        const newInterval = [min, newMax]
        intervals[i] = newInterval
        intervals.splice(j, 1)
        j = i
      }
    }
  }
  return intervals
}

function numberOfWays (n) {
  const dp = Array(n + 1).fill(0)
  dp[0] = 1
  for (let row = 1; row < n; ++row) {
    for (let col = 1; col < n + 1; ++col) {
      if (col >= row) {
        dp[col] = dp[col] + dp[col - row]
      }
    }
  }
  return (dp[n])
}

export function solveSum (data) {
  const arrLength = data.length
  let maxSum = -Infinity
  for (let i = 0; i < arrLength; i++) {
    const sub = data.slice(0, i + 1)
    for (let j = 0; j < sub.length; j++) {
      const sub2 = sub.slice(j, sub.length)
      const sum = sub2.reduce((prev, cur) => { prev += cur; return prev }, 0)
      if (sum > maxSum) maxSum = sum
    }
  }
  return maxSum
}

function sanitizeParentheses (data) {
  const solution = Sanitize(data)
  if (solution == null) { return ('[""]') } else if (solution[0].constructor !== Array) { return solution } else { return ('[' + solution.join(',') + ']') }
}

function SanitizeRemoveOneParth (item) {
  const possibleAnswers = []
  for (let i = 0; i < item.length; i++) {
    if (item[i].toLowerCase().indexOf('(') === -1 && item[i].toLowerCase().indexOf(')') === -1) {
      continue
    }
    const possible = item.substring(0, i) + item.substring(i + 1)
    possibleAnswers.push(possible)
  }
  return possibleAnswers
}

function SanitizeIsValid (item) {
  let unclosed = 0
  for (let i = 0; i < item.length; i++) {
    if (item[i] === '(') { unclosed++ } else if (item[i] === ')') { unclosed-- }
    if (unclosed < 0) { return false }
  }
  return unclosed === 0
}

function Sanitize (data) {
  if (SanitizeIsValid(data) === true) {
    return data
  }
  let currentPossible = [data]
  for (let i = 0; i < currentPossible.length; i++) {
    let newPossible = new Set()
    for (let j = 0; j < currentPossible.length; j++) {
      const newRemovedPossible = SanitizeRemoveOneParth(currentPossible[j])

      for (const item of newRemovedPossible) {
        newPossible.add(item)
      }
    }

    const validBoolList = []

    for (const item of newPossible) {
      validBoolList.push(SanitizeIsValid(item))
    }
    if (validBoolList.includes(true)) {
      let finalList = []
      newPossible = [...newPossible]

      for (let j = 0; j < validBoolList.length; j++) {
        if (validBoolList[j]) {
          finalList.push(newPossible[j])
        }
      }

      finalList = new Set(finalList)

      return [...finalList]
    }
    currentPossible = [...newPossible]
  }

  return null
}

function solveJump (data) {
  let i = 0
  let maxReach = 0
  while (i < data.length && i <= maxReach) {
    maxReach = Math.max(i + data[i], maxReach)
    i++
  }
  if (i === data.length) {
    return true
  }
  return false
}

function getExprUtil (res, curExp, input, target, pos, curVal, last) {
  if (pos === input.length) {
    if (curVal === target) { res.push(curExp) }
    return
  }
  for (let i = pos; i < input.length; i++) {
    if (i !== pos && input[pos] === '0') { break }
    const part = input.substr(pos, i + 1 - pos)
    const cur = parseInt(part, 10)
    if (pos === 0) {
      getExprUtil(res, curExp + part, input,
        target, i + 1, cur, cur)
    } else {
      getExprUtil(res, curExp + '+' + part, input,
        target, i + 1, curVal + cur, cur)
      getExprUtil(res, curExp + '-' + part, input,
        target, i + 1, curVal - cur, -cur)
      getExprUtil(res, curExp + '*' + part, input,
        target, i + 1, curVal - last + last * cur,
        last * cur)
    }
  }
}

function getExprs (data) {
  const input = data[0]
  const target = data[1]
  const res = []
  getExprUtil(res, '', input, target, 0, 0, 0)
  return res
}
