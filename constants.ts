export const HISTORY_LENGTH = 100;
export const SIMULATION_SPEED = 0.1; // Multiplier for reaction steps
export const PARTICLE_SCALE = 25; // Particles per concentration unit
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 300;

// Colors matching Tailwind classes
export const COLORS = {
  N2: '#3b82f6', // blue-500
  H2: '#94a3b8', // slate-400
  NH3: '#ef4444', // red-500
  BG: '#1e293b', // slate-800
};

// Arrhenius Constants
// Reaction: N2 + 3H2 <-> 2NH3 + Heat
// Exothermic: Forward Ea is lower than Reverse Ea.
// High T -> Faster rates, but Reverse increases MORE -> Shift Left.
export const K_FWD_PRE = 20.0;
export const EA_FWD = 2.0; 

export const K_REV_PRE = 5000.0; 
export const EA_REV = 8.0; 
