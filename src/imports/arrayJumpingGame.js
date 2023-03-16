export function arrayJumpingGame (data) {
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
