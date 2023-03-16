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

export function allValidMaths (data) {
  const input = data[0]
  const target = data[1]
  const res = []
  getExprUtil(res, '', input, target, 0, 0, 0)
  return res
}
