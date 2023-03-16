export function rleCompress (data) {
  let response = ''
  if (data === '') {
    return response
  }

  let currentRun = ''
  let runLength = 0

  function addEncodedRun (char, length) {
    while (length > 0) {
      if (length >= 9) {
        response += `9${char}`
      } else {
        response += `${length}${char}`
      }
      length -= 9
    }
  }

  for (const c of data) {
    if (currentRun === '') {
      currentRun = c
      runLength = 1
    } else if (currentRun === c) {
      runLength++
    } else if (currentRun !== c) {
      addEncodedRun(currentRun, runLength)
      currentRun = c
      runLength = 1
    }
  }
  addEncodedRun(currentRun, runLength)
  return response
}
