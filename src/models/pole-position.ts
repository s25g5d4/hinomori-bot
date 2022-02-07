import { range } from "lodash";

const optimizedOrder5 = [2, 1, 0, 3, 4] as const;
const optimizedOrder4 = [2, 1, 0, 3] as const;

export const errIncorrectPlayerNumbers = new Error("incorrect player numbers");

export interface PlayerRatio {
  ratio: number;
}

function indirectSort(arr: PlayerRatio[]): number[] {
  const indices = range(0, arr.length);
  return indices.sort((a, b) => arr[a].ratio - arr[b].ratio);
}

export function polePosition(players: PlayerRatio[]): number[] {
  if (players.length < 4 || players.length > 5) {
    throw errIncorrectPlayerNumbers;
  }

  const ratioOrder = indirectSort(players);

  switch (ratioOrder.length) {
    case optimizedOrder4.length:
      return optimizedOrder4.map((i) => ratioOrder[i]);
    case optimizedOrder5.length:
      return optimizedOrder5.map((i) => ratioOrder[i]);
  }
}
