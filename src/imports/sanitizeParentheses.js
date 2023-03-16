export function sanitizeParentheses (data) {
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
  while (currentPossible.length >= 0) {
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
