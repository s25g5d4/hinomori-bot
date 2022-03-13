import { expect } from "chai";
import {
  IndexNotANumberError,
  IndexOutOfRangeError,
  InvalidOptionPowerError,
  InvalidOptionTypeError,
  OptionPowerOutOfRangeError,
  InvalidOptionCardsError,
} from "../../../../src/commands/user/profile/update-errors";

describe("Profile Update Command Errors", function () {
  describe("IndexNotANumberError", function () {
    it("should create", function () {
      expect(new IndexNotANumberError()).to.be.instanceOf(IndexNotANumberError);
    });
    it("should have correct id", function () {
      const err = new IndexNotANumberError();
      expect(err.errorId).to.equal("profileUpdate-indexNotANumber");
      expect(IndexNotANumberError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new IndexNotANumberError();
      expect(err.data).to.deep.equal({
        reason: "index is not a number",
      });
    });
  });

  describe("IndexOutOfRangeError", function () {
    it("should create", function () {
      expect(new IndexOutOfRangeError()).to.be.instanceOf(IndexOutOfRangeError);
    });
    it("should have correct id", function () {
      const err = new IndexOutOfRangeError();
      expect(err.errorId).to.equal("profileUpdate-indexOutOfRange");
      expect(IndexOutOfRangeError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new IndexOutOfRangeError();
      expect(err.data).to.deep.equal({
        reason: "index out of range",
      });
    });
  });

  describe("InvalidOptionTypeError", function () {
    it("should create", function () {
      expect(new InvalidOptionTypeError()).to.be.instanceOf(
        InvalidOptionTypeError
      );
    });
    it("should have correct id", function () {
      const err = new InvalidOptionTypeError();
      expect(err.errorId).to.equal("profileUpdate-invalidOptionType");
      expect(InvalidOptionTypeError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new InvalidOptionTypeError();
      expect(err.data).to.deep.equal({
        reason: "option type is invalid",
      });
    });
  });

  describe("InvalidOptionPowerError", function () {
    it("should create", function () {
      expect(new InvalidOptionPowerError()).to.be.instanceOf(
        InvalidOptionPowerError
      );
    });
    it("should have correct id", function () {
      const err = new InvalidOptionPowerError();
      expect(err.errorId).to.equal("profileUpdate-invalidOptionPower");
      expect(InvalidOptionPowerError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new InvalidOptionPowerError();
      expect(err.data).to.deep.equal({
        reason: "option power is invalid",
      });
    });
  });

  describe("OptionPowerOutOfRangeError", function () {
    it("should create", function () {
      expect(new OptionPowerOutOfRangeError()).to.be.instanceOf(
        OptionPowerOutOfRangeError
      );
    });
    it("should have correct id", function () {
      const err = new OptionPowerOutOfRangeError();
      expect(err.errorId).to.equal("profileUpdate-optionPowerOutOfRange");
      expect(OptionPowerOutOfRangeError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new OptionPowerOutOfRangeError();
      expect(err.data).to.deep.equal({
        reason: "option power out of range",
      });
    });
  });

  describe("InvalidOptionCardsError", function () {
    it("should create", function () {
      expect(new InvalidOptionCardsError()).to.be.instanceOf(
        InvalidOptionCardsError
      );
    });
    it("should have correct id", function () {
      const err = new InvalidOptionCardsError();
      expect(err.errorId).to.equal("profileUpdate-invalidOptionCards");
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
