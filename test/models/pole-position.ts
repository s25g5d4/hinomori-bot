import { expect } from "chai";
import {
  errIncorrectPlayerNumbers,
  PlayerRatio,
  polePosition,
} from "../../src/models/pole-position";

describe("Pole Position", function () {
  it("should return correct pole position", function () {
    const testData1: PlayerRatio[] = [
      { ratio: 1 },
      { ratio: 2 },
      { ratio: 3 },
      { ratio: 4 },
      { ratio: 5 },
    ];
    expect(polePosition(testData1)).to.deep.equal([2, 1, 0, 3, 4]);

    const testData2: PlayerRatio[] = [
      { ratio: 3 },
      { ratio: 5 },
      { ratio: 2 },
      { ratio: 4 },
      { ratio: 1 },
    ];
    expect(polePosition(testData2)).to.deep.equal([0, 2, 4, 3, 1]);
  });

  it("should throw error if less than 4 players are given", function () {
    const testData1: PlayerRatio[] = [{ ratio: 1 }, { ratio: 2 }, { ratio: 3 }];
    expect(() => polePosition(testData1)).to.throw(errIncorrectPlayerNumbers);
  });

  it("should throw error if more than 5 players are given", function () {
    const testData1: PlayerRatio[] = [
      { ratio: 1 },
      { ratio: 2 },
      { ratio: 3 },
      { ratio: 4 },
      { ratio: 5 },
      { ratio: 6 },
    ];
    expect(() => polePosition(testData1)).to.throw(errIncorrectPlayerNumbers);
  });
});
