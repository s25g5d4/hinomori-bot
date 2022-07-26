import { expect } from "chai";
import { InvalidOptionCardsError } from "src/commands/user/ratio/v1-errors";

describe("Ratio-V1 Command Errors", function () {
  describe("InvalidOptionCardsError", function () {
    it("should create", function () {
      expect(new InvalidOptionCardsError()).to.be.instanceOf(
        InvalidOptionCardsError
      );
    });
    it("should have correct id", function () {
      const err = new InvalidOptionCardsError();
      expect(err.errorId).to.equal("ratioV1-invalidOptionCards");
      expect(InvalidOptionCardsError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new InvalidOptionCardsError();
      expect(err.data).to.deep.equal({
        reason: "option cards is invalid",
      });
    });
  });
});
