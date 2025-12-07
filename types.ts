export interface SimulationState {
  n2: number;
  h2: number;
  nh3: number;
  temperature: number;
}

export interface DataPoint {
  time: number;
  n2: number;
  h2: number;
  nh3: number;
}

export enum MoleculeType {
  N2 = 'N2',
  H2 = 'H2',
  NH3 = 'NH3',
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: MoleculeType;
}