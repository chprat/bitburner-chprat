function minJumps (data, n) {
  if (n === 1) { return 0 }
  let res = Number.MAX_VALUE
  for (let i = n - 2; i >= 0; i--) {
    if (i + data[i] >= n - 1) {
      const subRes = minJumps(data, i + 1)
      if (subRes !== Number.MAX_VALUE) { res = Math.min(res, subRes + 1) }
    }
  }
  return res
}

export function arrayJumpingGame2 (data) {
  if (data.length === 1) return 0
  if (data[0] === 0) return 0
  const res = minJumps(data, data.length)
  return (res === Number.MAX_VALUE) ? 0 : res
}
