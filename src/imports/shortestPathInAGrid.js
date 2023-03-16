class PathStep {
  constructor (fy, fx, ty, tx) {
    this.fromY = fy
    this.fromX = fx
    this.toY = ty
    this.toX = tx
  }

  toString () {
    if (this.fromY < this.toY) {
      return 'D'
    }
    if (this.fromY > this.toY) {
      return 'U'
    }
    if (this.fromX < this.toX) {
      return 'R'
    }
    if (this.fromX > this.toX) {
      return 'L'
    }
    return ''
  }
}
class BinHeap {
  constructor () {
    this.data = []
  }

  get size () {
    return this.data.length
  }

  push (value, weight) {
    const i = this.data.length
    this.data[i] = [weight, value]
    this.heapifyUp(i)
  }

  peek () {
    if (this.data.length === 0) { return undefined }
    return this.data[0][1]
  }

  pop () {
    if (this.data.length === 0) { return undefined }
    const value = this.data[0][1]
    this.data[0] = this.data[this.data.length - 1]
    this.data.length = this.data.length - 1
    this.heapifyDown(0)
    return value
  }

  changeWeight (predicate, weight) {
    const i = this.data.findIndex((e) => predicate(e[1]))
    if (i === -1) { return }
    this.data[i][0] = weight
    const p = Math.floor((i - 1) / 2)
    if (!this.heapOrderABeforeB(this.data[p][0], this.data[i][0])) { this.heapifyUp(i) } else { this.heapifyDown(i) }
  }

  heapifyUp (i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2)
      if (this.heapOrderABeforeB(this.data[p][0], this.data[i][0])) { break }
      const tmp = this.data[p]
      this.data[p] = this.data[i]
      this.data[i] = tmp
      i = p
    }
  }

  heapifyDown (i) {
    while (i < this.data.length) {
      const l = i * 2 + 1
      const r = i * 2 + 2
      let toSwap = i
      if (l < this.data.length && this.heapOrderABeforeB(this.data[l][0], this.data[toSwap][0])) { toSwap = l }
      if (r < this.data.length && this.heapOrderABeforeB(this.data[r][0], this.data[toSwap][0])) { toSwap = r }
      if (i === toSwap) { break }
      const tmp = this.data[toSwap]
      this.data[toSwap] = this.data[i]
      this.data[i] = tmp
      i = toSwap
    }
  }
}

class MinHeap extends BinHeap {
  heapOrderABeforeB (weightA, weightB) {
    return weightA < weightB
  }
}

export function shortestPathInAGrid (data) {
  const width = data[0].length
  const height = data.length
  const dstY = height - 1
  const dstX = width - 1
  const distance = new Array(height)
  const queue = new MinHeap()
  const cameFrom = new Map()
  for (let y = 0; y < height; y++) {
    distance[y] = new Array(width).fill(Infinity)
  }
  function validPosition (y, x) {
    return y >= 0 && y < height && x >= 0 && x < width && data[y][x] === 0
  }
  function * neighbors (y, x) {
    if (validPosition(y - 1, x)) { yield [y - 1, x] } // Up
    if (validPosition(y + 1, x)) { yield [y + 1, x] } // Down
    if (validPosition(y, x - 1)) { yield [y, x - 1] } // Left
    if (validPosition(y, x + 1)) { yield [y, x + 1] } // Right
  }
  distance[0][0] = 0
  queue.push([0, 0], 0)
  while (queue.size > 0) {
    const [y, x] = queue.pop()
    for (const [yN, xN] of neighbors(y, x)) {
      const d = distance[y][x] + 1
      if (d < distance[yN][xN]) {
        if (distance[yN][xN] === Infinity) { queue.push([yN, xN], d) } else { queue.changeWeight(([yQ, xQ]) => yQ === yN && xQ === xN, d) }
        distance[yN][xN] = d
        cameFrom.set(`${yN},${xN}`, [y, x])
      }
    }
  }
  if (distance[dstY][dstX] === Infinity) { return '' }
  const thePath = []
  let current = [dstY, dstX]
  while (!(current[0] === 0 && current[1] === 0)) {
    const from = cameFrom.get(`${current[0]},${current[1]}`)
    thePath.unshift(new PathStep(from[0], from[1], current[0], current[1]))
    current = from
  }
  return thePath.map(p => p.toString()).join('')
}
