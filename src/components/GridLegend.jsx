/**
 * GridLegend Component (Styled - Dark UI)
 *
 * Matches SmartRoute design:
 * * Terrain Complexity Index
 * * Path Glossary
 */

function LegendBox({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      {/* Box strictly takes the complex color classes passed to it */}
      <div className={`w-4 h-4 rounded border border-[#1f2937]/50 ${color}`}></div> 
      <span className="text-gray-300 text-sm">{label}</span> 
    </div>
  );
}

export function GridLegend() {
  return (
    <div className="flex justify-between flex-wrap gap-6 text-sm">

      {/* LEFT: TERRAIN INDEX */}
      <div>
        <p className="text-xs text-gray-400 mb-2">TERRAIN COMPLEXITY INDEX</p>

        <div className="flex flex-wrap gap-3">
          <LegendBox color="bg-[repeating-conic-gradient(#78716c_0%_25%,#57534e_0%_50%)] [background-size:6px_6px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" label="W1 Road" />
          <LegendBox color="bg-[repeating-conic-gradient(#a3e635_0%_25%,#22c55e_0%_50%)] [background-size:8px_8px] shadow-[inset_0_0_6px_rgba(0,0,0,0.3)]" label="W2 Grass" />
          <LegendBox color="bg-[repeating-conic-gradient(#facc15_0%_25%,#eab308_0%_50%)] [background-size:4px_4px] shadow-[inset_0_0_4px_rgba(0,0,0,0.1)]" label="W3 Sand" />
          <LegendBox color="bg-[repeating-conic-gradient(#166534_0%_25%,#14532d_0%_50%)] [background-size:8px_8px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]" label="W4 Forest" />
          <LegendBox color="bg-[repeating-conic-gradient(#64748b_0%_25%,#475569_0%_50%)] [background-size:10px_10px] shadow-[inset_0_0_10px_rgba(0,0,0,0.6)]" label="W5 Mountain" />
          <LegendBox color="bg-[repeating-linear-gradient(0deg,#1e3a8a_0px,#1e3a8a_6px,#0ea5e9_6px,#0ea5e9_8px)] shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]" label="W6 Water" />
          <LegendBox color="bg-[repeating-conic-gradient(#44403c_0%_25%,#292524_0%_50%)] [background-size:12px_12px] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] border-[#1c1917]" label="Wall" />
        </div>
      </div>

      {/* RIGHT: PATH LEGEND */}
      <div>
        <p className="text-xs text-gray-400 mb-2">PATH GLOSSARY</p>

        <div className="flex flex-col gap-2">
          <LegendBox color="bg-gradient-to-r from-yellow-200 to-yellow-400 shadow-[0_0_8px_rgba(253,224,71,0.9)]" label="Shortest Path" />
          <LegendBox color="bg-gradient-to-br from-blue-300 to-blue-500 opacity-80" label="Visited" />
          <LegendBox color="bg-gradient-to-br from-green-400 to-green-600 border border-green-300" label="Start Node" />
          <LegendBox color="bg-gradient-to-br from-red-400 to-red-600 border border-red-300" label="Finish Node" />
        </div>
      </div>

    </div>
  );
}