export function totalWaysToSum2 (data) {
  const n = data[0]
  const s = data[1]
  const ways = [1]
  ways.length = n + 1
  ways.fill(0, 1)
  for (let i = 0; i < s.length; i++) {
    for (let j = s[i]; j <= n; j++) {
      ways[j] += ways[j - s[i]]
    }
  }
  return ways[n]
}
