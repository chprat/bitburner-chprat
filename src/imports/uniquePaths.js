function factorial (n) {
  return factorialDivision(n, 1)
}

function factorialDivision (n, d) {
  if (n === 0 || n === 1 || n === d) { return 1 }
  return factorialDivision(n - 1, d) * n
}

export function uniquePathsI (grid) {
  const rightMoves = grid[0] - 1
  const downMoves = grid[1] - 1
  return Math.round(factorialDivision(rightMoves + downMoves, rightMoves) / (factorial(downMoves)))
}

export function uniquePathsII (grid, ignoreFirst = false, ignoreLast = false) {
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
