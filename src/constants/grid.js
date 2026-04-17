/**
 * Grid Constants
 */

/** Grid size */
export const ROWS = 30;
export const COLS = 30;

/** Default positions */
export const DEFAULT_START_ROW = 5;
export const DEFAULT_START_COL = 5;
export const DEFAULT_FINISH_ROW = 25;
export const DEFAULT_FINISH_COL = 25;

/** Default seed */
export const DEFAULT_MAP_SEED = 'default-seed-123';

/** Edit modes */
export const EDIT_MODES = {
  WALL: 'wall',
  WEIGHT: 'weight',
  START: 'start',
  FINISH: 'finish',
};

/** Algorithms */
export const ALGORITHMS = {
  DIJKSTRA: 'dijkstra',
  BFS: 'bfs',
  ASTAR: 'astar',
  ASTAR_WEIGHTED: 'astar-weighted',
};

/** * Animation timing 
 * To make it "Faster" in the UI, you should decrease these numbers.
 * Note: Setting these to 0 can sometimes cause browser lag. 10 is a good "Fast" base.
 */
export const ANIMATION_TIMING = {
  VISITED_STEP_DELAY: 10,
  PATH_STEP_DELAY: 25,
};

/**
 * 🌍 TERRAIN SYSTEM (FINAL)
 *
 * weight → used by algorithm
 * name → used by UI
 */
export const TERRAIN_TYPES = {
  1: { name: "road", cost: 1 },        // fastest
  2: { name: "grass", cost: 2 },
  3: { name: "sand", cost: 3 },
  4: { name: "shrub", cost: 4 },
  5: { name: "mud", cost: 5 },
  6: { name: "forest", cost: 6 },
  7: { name: "swamp", cost: 7 },
  8: { name: "mountain", cost: 8 },
  9: { name: "snow", cost: 9 },        // slowest
};