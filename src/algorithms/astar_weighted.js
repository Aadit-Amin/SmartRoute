// Weighted A* (ε-admissible A*)
// Uses a weighted heuristic to explore fewer nodes, trading optimality for speed
// Time Complexity: O(E log V) with binary heap
// Giving more weightage to heuristic (manhattan distance in this case)

// Manhattan distance heuristic
function manhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col)
}

// Min-Heap class for priority queue
class MinHeap {
  constructor() {
    this.heap = []
  }

  parent(i) {
    return Math.floor((i - 1) / 2)
  }

  leftChild(i) {
    return 2 * i + 1
  }

  rightChild(i) {
    return 2 * i + 2
  }

  swap(i, j) {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  bubbleUp(i) {
    while (i > 0 && this.heap[this.parent(i)].fScore > this.heap[i].fScore) {
      this.swap(i, this.parent(i))
      i = this.parent(i)
    }
  }

  bubbleDown(i) {
    let minIndex = i
    const left = this.leftChild(i)
    const right = this.rightChild(i)

    if (
      left < this.heap.length &&
      this.heap[left].fScore < this.heap[minIndex].fScore
    ) {
      minIndex = left
    }

    if (
      right < this.heap.length &&
      this.heap[right].fScore < this.heap[minIndex].fScore
    ) {
      minIndex = right
    }

    if (i !== minIndex) {
      this.swap(i, minIndex)
      this.bubbleDown(minIndex)
    }
  }

  insert(node) {
    this.heap.push(node)
    this.bubbleUp(this.heap.length - 1)
  }

  extractMin() {
    if (this.heap.length === 0) return null
    if (this.heap.length === 1) return this.heap.pop()

    const min = this.heap[0]
    this.heap[0] = this.heap.pop()
    this.bubbleDown(0)
    return min
  }

  decreaseKey(node, newFScore) {
    const index = this.heap.indexOf(node)
    if (index !== -1) {
      this.heap[index].fScore = newFScore
      this.bubbleUp(index)
    }
  }

  includes(node) {
    return this.heap.includes(node)
  }
}

// Updated to accept epsilon as a parameter (defaulting to 3.0)
export function astarWeighted(grid, startNode, finishNode, epsilon = 3.0) {
  const visitedNodesInOrder = []
  const openSet = new MinHeap()
  const closedSet = new Set()

  startNode.gScore = 0
  startNode.fScore = epsilon * manhattanDistance(startNode, finishNode)
  openSet.insert(startNode)

  while (openSet.heap.length > 0) {
    const currentNode = openSet.extractMin()

    // Skip walls
    if (currentNode.isWall) continue

    // If we reach a node with infinite distance, we're trapped
    if (currentNode.gScore === Infinity) break

    currentNode.isVisited = true
    visitedNodesInOrder.push(currentNode)
    closedSet.add(`${currentNode.row},${currentNode.col}`)

    // If we reached the finish node
    if (currentNode === finishNode) {
      return {
        visitedNodes: visitedNodesInOrder,
        shortestPath: reconstructPath(finishNode),
      }
    }

    // Get unvisited neighbors
    const neighbors = getUnvisitedNeighbors(currentNode, grid, closedSet)

    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue

      const tentativeGScore = currentNode.gScore + neighbor.weight
      const inOpenSet = openSet.includes(neighbor)

      if (!inOpenSet || tentativeGScore < neighbor.gScore) {
        neighbor.previousNode = currentNode
        neighbor.gScore = tentativeGScore

        // This is where epsilon is now dynamically applied
        neighbor.fScore =
          neighbor.gScore + epsilon * manhattanDistance(neighbor, finishNode)

        if (!inOpenSet) {
          openSet.insert(neighbor)
        } else {
          openSet.decreaseKey(neighbor, neighbor.fScore)
        }
      }
    }
  }

  // No path found
  return { visitedNodes: visitedNodesInOrder, shortestPath: [] }
}

function getUnvisitedNeighbors(node, grid, closedSet) {
  const neighbors = []
  const { row, col } = node

  if (row > 0) neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  if (col > 0) neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])

  return neighbors.filter((n) => !closedSet.has(`${n.row},${n.col}`))
}

function reconstructPath(finishNode) {
  const path = []
  let current = finishNode
  while (current !== null) {
    path.unshift(current)
    current = current.previousNode
  }
  return path
}
