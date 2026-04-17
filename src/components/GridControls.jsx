import { ALGORITHMS } from '../constants/grid';

// Fallback just in case your constants file doesn't export these exact names
const SAFE_EDIT_MODES = {
  WALL: 'WALL',
  WEIGHT: 'WEIGHT',
  START: 'START',
  FINISH: 'FINISH'
};

function AlgorithmButton({ algo, label, currentAlgorithm, isRunning, onSelect, activeColor }) {
  const isActive = currentAlgorithm === algo;
  const colorClass = activeColor && isActive ? activeColor : (isActive ? 'bg-blue-500 text-white border-blue-400' : 'bg-[#1E293B] text-gray-300 border-gray-600 hover:bg-[#334155]');

  return (
    <button
      onClick={() => onSelect(algo)}
      disabled={isRunning}
      className={`px-3 py-2 rounded text-sm transition-all border ${colorClass}`}
    >
      {label}
    </button>
  );
}

function EditModeButton({ mode, label, currentMode, isRunning, onSelect }) {
  const isActive = currentMode === mode;

  return (
    <button
      onClick={() => onSelect(mode)}
      disabled={isRunning}
      className={`px-3 py-2 rounded text-sm transition-all border ${isActive
          ? 'bg-green-500 text-white border-green-400'
          : 'bg-[#1E293B] text-gray-300 border-gray-600 hover:bg-[#334155]'
        }`}
    >
      {label}
    </button>
  );
}

export function GridControls({
  mapSeed,
  setMapSeed,
  onGenerateMap,
  onRandomizeMap,
  algorithm,
  onAlgorithmChange,
  onRunAlgorithm,
  onResetGrid,
  isRunning,
  editMode,
  setEditMode,
  showVisitedNodes,
  setShowVisitedNodes,
  astarWeight = 3.0, // <-- CRASH FIX 1: Default to 3.0 if undefined
  setAstarWeight
}) {
  
  // Safe number conversion for the slider display
  const safeWeight = Number(astarWeight) || 3.0;

  return (
    <div className="flex flex-col gap-4">
      
      {/* ALGORITHM SELECTION */}
      <div className="bg-[#020617] p-4 rounded-lg border border-gray-700 shadow-sm">
        <p className="text-xs text-gray-400 mb-2 font-semibold tracking-wider">ALGORITHM</p>

        <div className="flex flex-wrap gap-2">
          <AlgorithmButton
            algo={ALGORITHMS.DIJKSTRA}
            label="Dijkstra"
            currentAlgorithm={algorithm}
            isRunning={isRunning}
            onSelect={onAlgorithmChange}
          />
          <AlgorithmButton
            algo={ALGORITHMS.BFS}
            label="BFS"
            currentAlgorithm={algorithm}
            isRunning={isRunning}
            onSelect={onAlgorithmChange}
          />
          <AlgorithmButton
            algo={ALGORITHMS.ASTAR}
            label="A*"
            currentAlgorithm={algorithm}
            isRunning={isRunning}
            onSelect={onAlgorithmChange}
          />
          <AlgorithmButton
            algo={ALGORITHMS.ASTAR_WEIGHTED}
            label={`Weighted A*`}
            currentAlgorithm={algorithm}
            isRunning={isRunning}
            onSelect={onAlgorithmChange}
            activeColor="bg-red-500 border-red-400 text-white"
          />
        </div>

        {/* DYNAMIC WEIGHT SLIDER */}
        {algorithm === ALGORITHMS.ASTAR_WEIGHTED && (
          <div className="mt-3 flex items-center gap-3 bg-[#1E293B] p-2 rounded border border-gray-600 animate-fade-in">
            <label className="text-xs text-gray-300 font-bold whitespace-nowrap">Weight (ε):</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={safeWeight}
              onChange={(e) => setAstarWeight && setAstarWeight(parseFloat(e.target.value))}
              disabled={isRunning}
              className="flex-1 accent-red-500 cursor-pointer h-2 bg-gray-700 rounded-lg appearance-none"
            />
            {/* CRASH FIX 2: safeWeight ensures .toFixed doesn't break */}
            <span className="text-xs text-white font-mono w-6 text-right">
              {safeWeight.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* EDIT MODE */}
      <div className="bg-[#020617] p-4 rounded-lg border border-gray-700 shadow-sm">
        <p className="text-xs text-gray-400 mb-2 font-semibold tracking-wider">EDIT MODE</p>

        <div className="grid grid-cols-2 gap-2">
          {/* CRASH FIX 3: Using SAFE_EDIT_MODES so missing imports don't crash the app */}
          <EditModeButton mode={SAFE_EDIT_MODES.WALL} label="Wall" currentMode={editMode} isRunning={isRunning} onSelect={setEditMode} />
          <EditModeButton mode={SAFE_EDIT_MODES.WEIGHT} label="Terrain" currentMode={editMode} isRunning={isRunning} onSelect={setEditMode} />
          <EditModeButton mode={SAFE_EDIT_MODES.START} label="Start" currentMode={editMode} isRunning={isRunning} onSelect={setEditMode} />
          <EditModeButton mode={SAFE_EDIT_MODES.FINISH} label="Finish" currentMode={editMode} isRunning={isRunning} onSelect={setEditMode} />
        </div>
      </div>
      
      {/* MAP GENERATION AND RUN CONTROLS */}
      <div className="bg-[#020617] p-4 rounded-lg border border-gray-700 shadow-sm flex flex-col gap-3">
         <div className="flex gap-2">
            <input 
              type="text" 
              value={mapSeed || ''} 
              onChange={(e) => setMapSeed && setMapSeed(e.target.value)}
              className="bg-gray-800 text-white px-2 py-1.5 rounded text-sm w-full border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="Map Seed"
              disabled={isRunning}
            />
            <button 
              onClick={onGenerateMap}
              disabled={isRunning}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors"
            >
              Generate
            </button>
         </div>
         
         <button 
            onClick={onRandomizeMap}
            disabled={isRunning}
            className="bg-[#1E293B] hover:bg-[#334155] text-white border border-gray-600 px-4 py-2 rounded text-sm w-full transition-colors"
         >
            Randomize Map
         </button>

         <div className="flex items-center gap-2 mt-1">
            <input 
              type="checkbox" 
              id="showVisited" 
              checked={!!showVisitedNodes}
              onChange={(e) => setShowVisitedNodes && setShowVisitedNodes(e.target.checked)}
              disabled={isRunning}
              className="accent-blue-500 w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="showVisited" className="text-sm text-gray-300 cursor-pointer select-none">
              Show Visited Nodes
            </label>
         </div>

         <div className="grid grid-cols-2 gap-2 mt-2">
            <button 
              onClick={onRunAlgorithm}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded shadow-md transition-colors disabled:opacity-50"
            >
              {isRunning ? 'Running...' : 'Run'}
            </button>
            <button 
              onClick={onResetGrid}
              disabled={isRunning}
              className="bg-red-900/50 hover:bg-red-800/80 text-red-200 border border-red-800 py-2 rounded transition-colors disabled:opacity-50"
            >
              Reset
            </button>
         </div>
      </div>
    </div>
  );
}