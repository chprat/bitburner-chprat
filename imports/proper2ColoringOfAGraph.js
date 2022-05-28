export function proper2ColoringOfAGraph (data) {
  const n = data[0] // number of vertices
  const a = data[1] // adjacency data

  // create an adjacency matrix for the BFS
  const adjacencyMatrix = []
  for (let i = 0; i < n; i++) {
    adjacencyMatrix.push(new Array(n).fill(0))
  }
  for (const edge of a) {
    const v1 = edge[0]
    const v2 = edge[1]
    adjacencyMatrix[v1][v2] = 1
    adjacencyMatrix[v2][v1] = 1
  }

  // create response array, set v1 to color 0
  const colors = new Array(n).fill(-1)
  colors[0] = 0

  // BFS through the graph and assign colors
  const queue = []
  queue.push(0)

  while (queue.length > 0) {
    const next = queue.shift()
    const color1 = colors[next]
    const color2 = color1 ^ 1
    const adjacency = adjacencyMatrix[next]
    for (let v = 0; v < n; v++) {
      if (adjacency[v] !== 1) continue
      if (colors[v] === -1) {
        colors[v] = color2
        queue.push(v)
      } else if (colors[v] === color1) {
        return '[]' // invalid graph, why string?
      }
    }
  }
  return colors
}
