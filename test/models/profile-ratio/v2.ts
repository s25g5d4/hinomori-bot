import { expect } from "chai";
import { errNotEnoughRatios, profileRatio } from "src/models/profile-ratio/v2";

describe("Profile Ratio v2", function () {
  it("should return correct ratio", function () {
    expect(profileRatio([100, 100, 100, 100, 100])).to.be.closeTo(2.8, 0.001);
    expect(profileRatio([150, 150, 140, 140, 130])).to.be.closeTo(3.62, 0.001);
    expect(profileRatio([120, 110, 100, 80, 30])).to.be.closeTo(2.84, 0.001);
  });

  it("should throw error if less than 5 ratios are given", function () {
    expect(() => profileRatio([100])).to.throw(errNotEnoughRatios);
  });

  it("should ignore ratios more than 5", function () {
    expect(profileRatio([100, 100, 100, 100, 100, 100])).to.be.closeTo(
      2.8,
      0.001,
    );
  });
});
