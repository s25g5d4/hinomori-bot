export const errNotEnoughRatios = new Error("not enough ratios; 5 is required");

export function profileRatio(ratios: number[]): number {
  if (ratios.length < 5) {
    throw errNotEnoughRatios;
  }
  const factor = [
    ratios[0],
    ratios[1] / 5,
    ratios[2] / 5,
    ratios[3] / 5,
    ratios[4] / 5,
  ]
    .map((p) => p / 100)
    .reduce((p, c) => p + c);
  return factor + 1;
}
