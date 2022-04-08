import { expect } from "chai";
import {
  errIncorrectPlayerNumbers,
  polePosition,
} from "../../src/models/pole-position";

describe("Pole Position", function () {
  it("should return correct pole position (5 players)", function () {
    const testData1: number[] = [1, 2, 3, 4, 5];
    expect(polePosition(testData1)).to.deep.equal([2, 1, 0, 3, 4]);

    const testData2: number[] = [3, 5, 2, 4, 1];
    expect(polePosition(testData2)).to.deep.equal([0, 2, 4, 3, 1]);
  });

  it("should return correct pole position (4 players)", function () {
    const testData1: number[] = [1, 2, 3, 4];
    expect(polePosition(testData1)).to.deep.equal([2, 1, 0, 3]);

    const testData2: number[] = [3, 5, 4, 1];
    expect(polePosition(testData2)).to.deep.equal([2, 0, 3, 1]);
  });

  it("should throw error if less than 4 players are given", function () {
    const testData1: number[] = [1, 2, 3];
    expect(() => polePosition(testData1)).to.throw(errIncorrectPlayerNumbers);
  });

  it("should throw error if more than 5 players are given", function () {
    const testData1: number[] = [1, 2, 3, 4, 5, 6];
    expect(() => polePosition(testData1)).to.throw(errIncorrectPlayerNumbers);
  });
});
