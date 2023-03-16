export function totalWaysToSum (n) {
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
