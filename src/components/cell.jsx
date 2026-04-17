const TERRAIN_STYLES = {
  1: 'bg-[url("/road.png")] bg-cover bg-center [image-rendering:pixelated]', // W1: Road (Fallback)
  2: 'bg-[url("/grass.png")] bg-cover bg-center [image-rendering:pixelated]', // W2: Grass
  3: 'bg-[url("/sand.png")] bg-cover bg-center [image-rendering:pixelated]', // W3: Sand
  4: 'bg-[url("/grass.png")] bg-cover bg-center [image-rendering:pixelated]', // W4: Shrub (Fallback)
  5: 'bg-[url("/mud.png")] bg-cover bg-center [image-rendering:pixelated]', // W5: Mud (Fallback)
  6: 'bg-[url("/forest.png")] bg-cover bg-center [image-rendering:pixelated]', // W6: Forest (Fallback)
  7: 'bg-[url("/water.png")] bg-cover bg-center [image-rendering:pixelated]', // W7: Water/Swamp
  8: 'bg-[url("/mountain.png")] bg-cover bg-center [image-rendering:pixelated]', // W8: Mountain
  9: 'bg-[url("/snow.png")] bg-cover bg-center [image-rendering:pixelated]', // W9: Snow (Fallback)
};

function Cell({
  row,
  col,
  isStart,
  isFinish,
  isWall,
  isVisited,
  isInPath,
  weight,
  showVisited,
  onClick
}) {

  let cellClass =
    "w-6 h-6 border border-[#1f2937]/50 cursor-pointer transition-all duration-150";

  // START NODE
  if (isStart) {
    cellClass += " bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-400/60 rounded-sm border-green-300 z-20";
  }

  // FINISH NODE
  else if (isFinish) {
    cellClass += " bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-400/60 rounded-sm border-red-300 z-20";
  }

  // WALL (Using the uploaded wall texture)
  else if (isWall) {
    cellClass += " bg-[url('/wall.png')] bg-cover bg-center [image-rendering:pixelated] border-black shadow-[inset_0_0_10px_rgba(0,0,0,0.6)]";
  }

  // SHORTEST PATH (GLOW EFFECT)
  else if (isInPath) {
    cellClass +=
      " bg-gradient-to-r from-yellow-200 to-yellow-400 shadow-[0_0_12px_4px_rgba(253,224,71,0.9)] scale-110 z-10 border-yellow-200 rounded-sm";
  }

  // VISITED
  else if (isVisited && showVisited) {
    cellClass += " bg-blue-400/80 backdrop-blur-sm shadow-[inset_0_0_5px_rgba(255,255,255,0.4)]";
  }

  // TERRAIN
  else {
    // If an invalid weight sneaks in, fall back to a dark gray
    const style = TERRAIN_STYLES[weight] || 'bg-gray-800';
    cellClass += ` ${style}`;
  }

  return (
    <div
      className="relative group"
      onClick={() => onClick(row, col)}
    >
      {/* CELL */} 
      <div className={cellClass}></div>

      {/* HOVER NUMBER */}
      {!isWall && !isStart && !isFinish && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition pointer-events-none drop-shadow-[0_0_4px_black]">
          {weight !== Infinity ? weight : ''}
        </span>
      )}
    </div>
  );
}

export default Cell;