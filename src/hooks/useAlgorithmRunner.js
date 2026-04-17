/**
 * useAlgorithmRunner Hook
 *
 * Updated with History Logging for Weighted A*
 */

import { useState, useCallback, useRef } from 'react'
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra'
import { bfs } from '../algorithms/bfs'
import { astar } from '../algorithms/astar'
import { astarWeighted } from '../algorithms/astar_weighted'
import { ALGORITHMS, ANIMATION_TIMING } from '../constants/grid'
import { createFreshGrid } from '../utils/gridUtils'

export function useAlgorithmRunner(
  grid,
  startPos,
  finishPos,
  setGrid,
  isRunning,
  setIsRunning,
  setShowVisitedNodes,
  astarWeight,
) {
  const [algorithm, setAlgorithm] = useState(ALGORITHMS.DIJKSTRA)

  const [dijkstraResult, setDijkstraResult] = useState(null)
  const [bfsResult, setBfsResult] = useState(null)
  const [astarResult, setAstarResult] = useState(null)

  // NEW: History array for Weighted A* runs
  const [astarWeightedHistory, setAstarWeightedHistory] = useState([])

  const [dijkstraComplete, setDijkstraComplete] = useState(false)
  const [bfsComplete, setBfsComplete] = useState(false)
  const [astarComplete, setAstarComplete] = useState(false)

  const [dijkstraVisitedNodes, setDijkstraVisitedNodes] = useState([])
  const [dijkstraPath, setDijkstraPath] = useState([])
  const [bfsVisitedNodes, setBfsVisitedNodes] = useState([])
  const [bfsPath, setBfsPath] = useState([])
  const [astarVisitedNodes, setAstarVisitedNodes] = useState([])
  const [astarPath, setAstarPath] = useState([])
  const [astarWeightedVisitedNodes, setAstarWeightedVisitedNodes] = useState([])
  const [astarWeightedPath, setAstarWeightedPath] = useState([])

  const animationStartTime = useRef(null)

  const clearAlgorithmData = useCallback(() => {
    setDijkstraResult(null)
    setBfsResult(null)
    setAstarResult(null)
    setAstarWeightedHistory([]) // Clear history when map resets
    setDijkstraComplete(false)
    setBfsComplete(false)
    setAstarComplete(false)
    setDijkstraVisitedNodes([])
    setDijkstraPath([])
    setBfsVisitedNodes([])
    setBfsPath([])
    setAstarVisitedNodes([])
    setAstarPath([])
    setAstarWeightedVisitedNodes([])
    setAstarWeightedPath([])
  }, [])

  const restoreVisualization = useCallback(
    (algo) => {
      let visitedNodes, path
      switch (algo) {
        case ALGORITHMS.DIJKSTRA:
          visitedNodes = dijkstraVisitedNodes
          path = dijkstraPath
          break
        case ALGORITHMS.BFS:
          visitedNodes = bfsVisitedNodes
          path = bfsPath
          break
        case ALGORITHMS.ASTAR:
          visitedNodes = astarVisitedNodes
          path = astarPath
          break
        case ALGORITHMS.ASTAR_WEIGHTED:
          visitedNodes = astarWeightedVisitedNodes
          path = astarWeightedPath
          break
        default:
          visitedNodes = []
          path = []
      }

      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) =>
          row.map((node) => ({ ...node, isInPath: false, isVisited: false })),
        )
        visitedNodes.forEach((node) => {
          if (newGrid[node.row] && newGrid[node.row][node.col]) {
            newGrid[node.row][node.col] = {
              ...newGrid[node.row][node.col],
              isVisited: true,
            }
          }
        })
        path.forEach((node) => {
          if (newGrid[node.row] && newGrid[node.row][node.col]) {
            newGrid[node.row][node.col] = {
              ...newGrid[node.row][node.col],
              isInPath: true,
            }
          }
        })
        return newGrid
      })
    },
    [
      dijkstraVisitedNodes,
      dijkstraPath,
      bfsVisitedNodes,
      bfsPath,
      astarVisitedNodes,
      astarPath,
      astarWeightedVisitedNodes,
      astarWeightedPath,
      setGrid,
    ],
  )

  const handleAlgorithmChange = useCallback(
    (newAlgorithm) => {
      setAlgorithm(newAlgorithm)
      restoreVisualization(newAlgorithm)
    },
    [restoreVisualization],
  )

  const animateShortestPath = useCallback(
    (shortestPath, algo, onComplete) => {
      if (shortestPath.length === 0) {
        setIsRunning(false)
        setShowVisitedNodes(false)
        onComplete()
        return
      }

      let step = 0
      const pathInterval = setInterval(() => {
        if (step >= shortestPath.length) {
          clearInterval(pathInterval)
          setIsRunning(false)
          setShowVisitedNodes(false)
          onComplete()
          return
        }

        const node = shortestPath[step]
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid]
          newGrid[node.row] = [...newGrid[node.row]]
          newGrid[node.row][node.col] = {
            ...newGrid[node.row][node.col],
            isInPath: true,
          }
          return newGrid
        })
        step++
      }, 25)
    },
    [setGrid, setIsRunning, setShowVisitedNodes],
  )

  const animateVisitedThenPath = useCallback(
    (visitedNodes, shortestPath, algo, onComplete) => {
      let step = 0
      const isTurbo = ANIMATION_TIMING.VISITED_STEP_DELAY <= 5
      const nodesPerBatch = isTurbo ? 20 : 1
      const intervalDelay = isTurbo ? 10 : ANIMATION_TIMING.VISITED_STEP_DELAY

      const visitedInterval = setInterval(() => {
        if (step >= visitedNodes.length) {
          clearInterval(visitedInterval)
          animateShortestPath(shortestPath, algo, onComplete)
          return
        }

        setGrid((prevGrid) => {
          const newGrid = [...prevGrid]
          for (let i = 0; i < nodesPerBatch; i++) {
            const index = step + i
            if (index < visitedNodes.length) {
              const node = visitedNodes[index]
              newGrid[node.row] = [...newGrid[node.row]]
              newGrid[node.row][node.col] = {
                ...newGrid[node.row][node.col],
                isVisited: true,
              }
            }
          }
          return newGrid
        })

        step += nodesPerBatch
      }, intervalDelay)
    },
    [setGrid, animateShortestPath],
  )

  const runAlgorithm = useCallback(
    (clearPathFn) => {
      if (isRunning) return

      clearPathFn()

      // Lock the epsilon value at the moment the algorithm starts
      const currentEpsilon = astarWeight

      const freshGrid = createFreshGrid(
        grid,
        startPos.row,
        startPos.col,
        finishPos.row,
        finishPos.col,
      )
      const startNode = freshGrid[startPos.row][startPos.col]
      const finishNode = freshGrid[finishPos.row][finishPos.col]

      let visitedNodes, shortestPath

      switch (algorithm) {
        case ALGORITHMS.DIJKSTRA:
          visitedNodes = dijkstra(freshGrid, startNode, finishNode)
          shortestPath = getNodesInShortestPathOrder(finishNode)
          break
        case ALGORITHMS.BFS:
          const bfsRes = bfs(freshGrid, startNode, finishNode)
          visitedNodes = bfsRes.visitedNodes
          shortestPath = bfsRes.shortestPath
          break
        case ALGORITHMS.ASTAR:
          const astarRes = astar(freshGrid, startNode, finishNode)
          visitedNodes = astarRes.visitedNodes
          shortestPath = astarRes.shortestPath
          break
        case ALGORITHMS.ASTAR_WEIGHTED:
          const awRes = astarWeighted(
            freshGrid,
            startNode,
            finishNode,
            currentEpsilon,
          )
          visitedNodes = awRes.visitedNodes
          shortestPath = awRes.shortestPath
          break
        default:
          return
      }

      const hasPath = shortestPath.length > 0
      const weight = hasPath
        ? shortestPath.reduce((sum, node) => sum + node.weight, 0)
        : 0
      const resultData = {
        weight,
        length: shortestPath.length,
        noPath: !hasPath,
        timeToGoal: visitedNodes.length * ANIMATION_TIMING.VISITED_STEP_DELAY,
        visitedCount: visitedNodes.length,
      }

      if (algorithm === ALGORITHMS.DIJKSTRA) {
        setDijkstraResult(resultData)
        setDijkstraVisitedNodes(visitedNodes)
        setDijkstraPath(shortestPath)
      } else if (algorithm === ALGORITHMS.BFS) {
        setBfsResult(resultData)
        setBfsVisitedNodes(visitedNodes)
        setBfsPath(shortestPath)
      } else if (algorithm === ALGORITHMS.ASTAR) {
        setAstarResult(resultData)
        setAstarVisitedNodes(visitedNodes)
        setAstarPath(shortestPath)
      } else if (algorithm === ALGORITHMS.ASTAR_WEIGHTED) {
        // Append or overwrite the result for THIS specific epsilon
        setAstarWeightedHistory((prev) => {
          const existingIndex = prev.findIndex(
            (item) => item.epsilon === currentEpsilon,
          )
          const newEntry = {
            epsilon: currentEpsilon,
            result: resultData,
            isComplete: false,
          }

          if (existingIndex >= 0) {
            const next = [...prev]
            next[existingIndex] = newEntry // Overwrite if same epsilon ran again
            return next
          }
          return [...prev, newEntry] // Append new card
        })
        setAstarWeightedVisitedNodes(visitedNodes)
        setAstarWeightedPath(shortestPath)
      }

      setIsRunning(true)
      animationStartTime.current = Date.now()

      const onComplete = () => {
        if (algorithm === ALGORITHMS.DIJKSTRA) setDijkstraComplete(true)
        if (algorithm === ALGORITHMS.BFS) setBfsComplete(true)
        if (algorithm === ALGORITHMS.ASTAR) setAstarComplete(true)
        if (algorithm === ALGORITHMS.ASTAR_WEIGHTED) {
          // Mark THIS specific epsilon run as complete
          setAstarWeightedHistory((prev) =>
            prev.map((item) =>
              item.epsilon === currentEpsilon
                ? { ...item, isComplete: true }
                : item,
            ),
          )
        }
      }

      animateVisitedThenPath(visitedNodes, shortestPath, algorithm, onComplete)
    },
    [
      grid,
      startPos,
      finishPos,
      algorithm,
      isRunning,
      setGrid,
      setIsRunning,
      setShowVisitedNodes,
      animateVisitedThenPath,
      astarWeight,
    ],
  )

  return {
    algorithm,
    dijkstraResult,
    bfsResult,
    astarResult,
    astarWeightedHistory, // <-- Exposing history instead of single result
    dijkstraComplete,
    bfsComplete,
    astarComplete,
    setAlgorithm: handleAlgorithmChange,
    runAlgorithm,
    restoreVisualization,
    clearAlgorithmData,
  }
}
