import { listServers } from 'imports/scanner.js'
import { largestPrimeFactor } from 'imports/largestPrimeFactor.js'
import { subarrayMaxSum } from 'imports/subarrayMaxSum.js'
import { totalWaysToSum } from 'imports/totalWaysToSum.js'
import { totalWaysToSum2 } from 'imports/totalWaysToSum2.js'
import { spiralizeMatrix } from 'imports/spiralizeMatrix.js'
import { arrayJumpingGame } from 'imports/arrayJumpingGame.js'
import { arrayJumpingGame2 } from 'imports/arrayJumpingGame2.js'
import { mergeOverlap } from 'imports/mergeOverlap.js'
import { generateIPs } from 'imports/generateIPs.js'
import { algorithmicStockTrader } from 'imports/algorithmicStockTrader.js'
import { minimumTriangleSum } from 'imports/minimumTriangleSum.js'
import { uniquePathsI, uniquePathsII } from 'imports/uniquePaths.js'
import { shortestPathInAGrid } from 'imports/shortestPathInAGrid.js'
import { sanitizeParentheses } from 'imports/sanitizeParentheses.js'
import { allValidMaths } from 'imports/allValidMaths.js'
import { hammingEncode } from 'imports/hammingEncode.js'
import { hammingDecode } from 'imports/hammingDecode.js'
import { proper2ColoringOfAGraph } from 'imports/proper2ColoringOfAGraph.js'
import { rleCompress } from 'imports/rleCompress.js'
import { lzDecompress } from 'imports/lzDecompress.js'
import { lzCompress } from 'imports/lzCompress.js'
import { caesar } from 'imports/caesar.js'
import { vigenere } from 'imports/vigenere.js'

/** @param {NS} ns **/
function solve (type, data, server, contract, ns) {
  let solution = '~'
  switch (type) {
    case 'Find Largest Prime Factor':
      solution = largestPrimeFactor(data)
      break
    case 'Subarray with Maximum Sum':
      solution = subarrayMaxSum(data)
      break
    case 'Total Ways to Sum':
      solution = totalWaysToSum(data)
      break
    case 'Total Ways to Sum II':
      solution = totalWaysToSum2(data)
      break
    case 'Spiralize Matrix':
      solution = spiralizeMatrix(data)
      break
    case 'Array Jumping Game':
      solution = (arrayJumpingGame(data)) ? 1 : 0
      break
    case 'Array Jumping Game II':
      solution = (arrayJumpingGame2(data))
      break
    case 'Merge Overlapping Intervals':
      solution = mergeOverlap(data)
      break
    case 'Generate IP Addresses':
      solution = generateIPs(data)
      break
    case 'Algorithmic Stock Trader I':
      solution = algorithmicStockTrader([1, data])
      break
    case 'Algorithmic Stock Trader II':
      solution = algorithmicStockTrader([Math.ceil(data.length / 2), data])
      break
    case 'Algorithmic Stock Trader III':
      solution = algorithmicStockTrader([2, data])
      break
    case 'Algorithmic Stock Trader IV':
      solution = algorithmicStockTrader(data)
      break
    case 'Minimum Path Sum in a Triangle':
      solution = minimumTriangleSum(data)
      break
    case 'Unique Paths in a Grid I':
      solution = uniquePathsI(data)
      break
    case 'Unique Paths in a Grid II':
      solution = uniquePathsII(data)
      break
    case 'Shortest Path in a Grid':
      solution = shortestPathInAGrid(data)
      break
    case 'Sanitize Parentheses in Expression':
      solution = sanitizeParentheses(data)
      break
    case 'Find All Valid Math Expressions':
      solution = allValidMaths(data)
      break
    case 'HammingCodes: Integer to Encoded Binary':
      solution = hammingEncode(data)
      break
    case 'HammingCodes: Encoded Binary to Integer':
      solution = hammingDecode(data)
      break
    case 'Proper 2-Coloring of a Graph':
      solution = proper2ColoringOfAGraph(data)
      break
    case 'Compression I: RLE Compression':
      solution = rleCompress(data)
      break
    case 'Compression II: LZ Decompression':
      solution = lzDecompress(data)
      break
    case 'Compression III: LZ Compression':
      solution = lzCompress(data)
      break
    case 'Encryption I: Caesar Cipher':
      solution = caesar(data)
      break
    case 'Encryption II: Vigenère Cipher':
      solution = vigenere(data)
      break
    default:
      ns.print(`New type on ${server}: ${contract} is of type ${type}`)
      ns.print(ns.codingcontract.getDescription(contract, server))
  }
  ns.print(`${type} - ${data} - ${solution}`)
  return (solution !== '~') ? ns.codingcontract.attempt(solution, contract, server, { returnReward: true }) : ''
}

/** @param {NS} ns **/
export async function main (ns) {
  ns.disableLog('codingcontract.attempt')
  ns.disableLog('sleep')
  const servers = listServers(ns).filter(s => s !== 'darkweb')
    .filter(s => s !== 'home')
    .filter(s => !s.includes('psrv'))
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
    .forEach((contract) => ns.tprint(contract))
}
