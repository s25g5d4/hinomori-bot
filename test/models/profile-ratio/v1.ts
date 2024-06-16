import { expect } from "chai";
import { errNotEnoughRatios, profileRatio } from "src/models/profile-ratio/v1";

describe("Profile Ratio v1", function () {
  it("should return correct ratio", function () {
    expect(profileRatio([100, 100, 100, 100, 100])).to.be.closeTo(4.147, 0.001);
    expect(profileRatio([130, 115, 110, 110, 110])).to.be.closeTo(5.137, 0.001);
    expect(profileRatio([110, 100, 80, 30, 30])).to.be.closeTo(3.285, 0.001);
  });

  it("should throw error if less than 5 ratios are given", function () {
    expect(() => profileRatio([100])).to.throw(errNotEnoughRatios);
  });

  it("should ignore ratios more than 5", function () {
    expect(profileRatio([100, 100, 100, 100, 100, 100])).to.be.closeTo(
      4.147,
      0.001,
    );
  });
});
