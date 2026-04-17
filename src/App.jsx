import { useState } from 'react';
import Grid from './components/grid'
import { GridControls } from './components/GridControls'
import { AlgorithmResults } from './components/AlgorithmResults'
import { GridLegend } from './components/GridLegend'

import { useGridState } from './hooks/useGridState'
import { useAlgorithmRunner } from './hooks/useAlgorithmRunner'
import { generateRandomSeed } from './utils/mapGenerator'

function App() {
  const [astarWeight, setAstarWeight] = useState(3.0);

  const {
    grid,
    startPos,
    finishPos,
    mapSeed,
    isRunning,
    showVisitedNodes,
    editMode,
    setGrid,
    setMapSeed,
    setShowVisitedNodes,
    setEditMode,
    handleCellClick,
    clearPath,
    regenerateMap,
    resetGrid,
    setIsRunning,
  } = useGridState();

  const {
    algorithm,
    dijkstraResult,
    bfsResult,
    astarResult,
    astarWeightedHistory,
    dijkstraComplete,
    bfsComplete,
    astarComplete,
    setAlgorithm,
    runAlgorithm,
    clearAlgorithmData,
  } = useAlgorithmRunner(
    grid,
    startPos,
    finishPos,
    setGrid,
    isRunning,
    setIsRunning,
    setShowVisitedNodes,
    astarWeight 
  );

  const handleGenerateMap = () => {
    regenerateMap(mapSeed);
    clearAlgorithmData();
  };

  const handleRandomizeMap = () => {
    const newSeed = generateRandomSeed();
    regenerateMap(newSeed);
    clearAlgorithmData();
  };

  const handleResetGrid = () => {
    resetGrid();
    clearAlgorithmData();
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white font-sans">
      <div className="w-80 bg-[#0f172a] p-5 flex flex-col border-r border-gray-700 shadow-xl overflow-y-auto z-10 custom-scrollbar">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
          SmartRoute
        </h1>
        <p className="text-xs text-gray-400 mb-3">
          Pathfinding Visualizer
        </p>

        <GridControls
          mapSeed={mapSeed}
          setMapSeed={setMapSeed}
          onGenerateMap={handleGenerateMap}
          onRandomizeMap={handleRandomizeMap}
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          onRunAlgorithm={() => runAlgorithm(clearPath)}
          onResetGrid={handleResetGrid}
          isRunning={isRunning}
          editMode={editMode}
          setEditMode={setEditMode}
          showVisitedNodes={showVisitedNodes}
          setShowVisitedNodes={setShowVisitedNodes}
          astarWeight={astarWeight}       
          setAstarWeight={setAstarWeight} 
        />

        <AlgorithmResults
          dijkstraResult={dijkstraResult}
          bfsResult={bfsResult}
          astarResult={astarResult}
          astarWeightedHistory={astarWeightedHistory}
          dijkstraComplete={dijkstraComplete}
          bfsComplete={bfsComplete}
          astarComplete={astarComplete}
        />
      </div>

      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex justify-center items-center flex-1">
          <Grid
            grid={grid}
            handleCellClick={handleCellClick}
            showVisitedNodes={showVisitedNodes}
          />
        </div>

        <div className="w-full bg-[#020617] p-4 rounded-lg border border-gray-700">
          <GridLegend />
        </div>
      </div>
    </div>
  )
}

export default App;