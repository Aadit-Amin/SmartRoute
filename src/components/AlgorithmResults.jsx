/**
 * AlgorithmResults Component
 * Displays the results of pathfinding algorithm executions.
 * Stacked history for Weighted A* runs.
 */

function ResultCard({ name, result, isComplete, bgColor, accentColor }) {
  if (!result || !isComplete) return null;

  return (
    <div className={`text-sm font-bold px-3 py-2 rounded border border-gray-700 shadow-sm ${result.noPath ? 'bg-red-900/50 text-red-200 border-red-800' : bgColor}`}>
      <div className="mb-1 text-sm">{name}</div>
      
      {result.noPath ? (
        <span className="text-red-400 text-xs">Goal not reached</span>
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-[11px] font-normal tracking-wide">
          <div>
            <span className="text-gray-400">Cost: </span>
            <span className={accentColor}>{result.weight}</span>
          </div>
          <div>
            <span className="text-gray-400">Length: </span>
            <span className={accentColor}>{result.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Visited: </span>
            <span className={accentColor}>{result.visitedCount}</span>
          </div>
          <div>
            <span className="text-gray-400">Time: </span>
            <span className={accentColor}>{result.timeToGoal} ms</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function AlgorithmResults({
  dijkstraResult,
  bfsResult,
  astarResult,
  dijkstraComplete,
  bfsComplete,
  astarComplete,
  astarWeightedHistory = []
}) {
  return (
    <div className="flex flex-col gap-2 mt-4 pb-4">
      <ResultCard
        name="Dijkstra"
        result={dijkstraResult}
        isComplete={dijkstraComplete}
        bgColor="bg-[#020617]"
        accentColor="text-blue-400 font-bold"
      />
      
      <ResultCard
        name="BFS"
        result={bfsResult}
        isComplete={bfsComplete}
        bgColor="bg-[#020617]"
        accentColor="text-purple-400 font-bold"
      />
      
      <ResultCard
        name="A*"
        result={astarResult}
        isComplete={astarComplete}
        bgColor="bg-[#020617]"
        accentColor="text-green-400 font-bold"
      />
      
      {astarWeightedHistory.map((historyItem) => (
        <ResultCard
          key={`weighted-astar-${historyItem.epsilon}`}
          name={`Weighted A* (ε=${historyItem.epsilon})`}
          result={historyItem.result}
          isComplete={historyItem.isComplete}
          bgColor="bg-[#020617]"
          accentColor="text-red-400 font-bold"
        />
      ))}
    </div>
  );
}