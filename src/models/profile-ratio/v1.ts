export const errNotEnoughRatios = new Error("not enough ratios; 5 is required");

export function profileRatio(ratios: number[]): number {
  if (ratios.length < 5) {
    throw errNotEnoughRatios;
  }
  return [
    100 + ratios[0],
    100 + ratios[1] / 5,
    100 + ratios[2] / 5,
    100 + ratios[3] / 5,
    100 + ratios[4] / 5,
  ]
    .map((p) => p / 100)
    .reduce((p, c) => p * c);
}
