export function subarrayMaxSum (data) {
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
