import { K_FWD_PRE, EA_FWD, K_REV_PRE, EA_REV } from '../constants';

/**
 * Calculates the forward reaction rate constant based on Arrhenius equation
 * k = A * exp(-Ea / RT)
 * We treat R=1 for simplicity in this scaled model.
 */
export const getKFwd = (temp: number): number => {
  return K_FWD_PRE * Math.exp(-EA_FWD / temp);
};

/**
 * Calculates the reverse reaction rate constant.
 */
export const getKRev = (temp: number): number => {
  return K_REV_PRE * Math.exp(-EA_REV / temp);
};

/**
 * Calculates the instantaneous rate of reaction.
 * Rate = k_f * [N2] * [H2]^3 - k_r * [NH3]^2
 * Note: We use slightly reduced exponents for stability in this visual demo,
 * but keep the essence of the stoichiometry.
 */
export const calculateRate = (n2: number, h2: number, nh3: number, temp: number): number => {
  const kf = getKFwd(temp);
  const kr = getKRev(temp);

  // Use Math.max(0, val) to prevent NaN from Math.pow with negative bases due to floating point drift
  const safeN2 = Math.max(0, n2);
  const safeH2 = Math.max(0, h2);
  const safeNH3 = Math.max(0, nh3);

  // Using full powers [H2]^3 can be volatile in simple step simulations without small dt.
  // We dampen the exponents slightly for smoother UI interaction, or ensure dt is small.
  // Here we try standard mass action with normalized concentrations (~0.5 to 2.0).
  const forwardRate = kf * safeN2 * Math.pow(safeH2, 2.5); 
  const reverseRate = kr * Math.pow(safeNH3, 1.8);

  return forwardRate - reverseRate;
};