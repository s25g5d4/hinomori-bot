import { expect } from "chai";
import {
  EmptyIndexError,
  EmptyNickNameError,
  EmptyProfileError,
  IndexNotANumberError,
  IndexOutOfRangeError,
  InvalidNickNameError,
  NoProfileRecordError,
} from "src/commands/user/profile/25-miku-errors";

describe("Generate 25 Miku Profile Command Errors", function () {
  describe("EmptyNickNameError", function () {
    it("should create", function () {
      expect(new EmptyNickNameError()).to.be.instanceOf(EmptyNickNameError);
    });
    it("should have correct id", function () {
      const err = new EmptyNickNameError();
      expect(err.errorId).to.equal("generate25Miku-emptyNickName");
      expect(EmptyNickNameError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new EmptyNickNameError();
      expect(err.data).to.deep.equal({
        reason: "nickname is empty",
      });
    });
  });

  describe("InvalidNickNameError", function () {
    it("should create", function () {
      expect(new InvalidNickNameError()).to.be.instanceOf(InvalidNickNameError);
    });
    it("should have correct id", function () {
      const err = new InvalidNickNameError();
      expect(err.errorId).to.equal("generate25Miku-invalidNickName");
      expect(InvalidNickNameError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new InvalidNickNameError();
      expect(err.data).to.deep.equal({
        reason: "invalid nickname",
      });
    });
  });

  describe("EmptyIndexError", function () {
    it("should create", function () {
      expect(new EmptyIndexError()).to.be.instanceOf(EmptyIndexError);
    });
    it("should have correct id", function () {
      const err = new EmptyIndexError();
      expect(err.errorId).to.equal("generate25Miku-emptyIndex");
      expect(EmptyIndexError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new EmptyIndexError();
      expect(err.data).to.deep.equal({
        reason: "index is empty",
      });
    });
  });

  describe("IndexNotANumberError", function () {
    it("should create", function () {
      expect(new IndexNotANumberError()).to.be.instanceOf(IndexNotANumberError);
    });
    it("should have correct id", function () {
      const err = new IndexNotANumberError();
      expect(err.errorId).to.equal("generate25Miku-indexNotANumber");
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
      expect(err.errorId).to.equal("generate25Miku-indexOutOfRange");
      expect(IndexOutOfRangeError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new IndexOutOfRangeError();
      expect(err.data).to.deep.equal({
        reason: "index out of range",
      });
    });
  });

  describe("NoProfileRecordError", function () {
    it("should create", function () {
      expect(new NoProfileRecordError()).to.be.instanceOf(NoProfileRecordError);
    });
    it("should have correct id", function () {
      const err = new NoProfileRecordError();
      expect(err.errorId).to.equal("generate25Miku-noProfileRecord");
      expect(NoProfileRecordError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new NoProfileRecordError();
      expect(err.data).to.deep.equal({
        reason: "user does not have profile record",
      });
    });
  });

  describe("EmptyProfileError", function () {
    it("should create", function () {
      expect(new EmptyProfileError()).to.be.instanceOf(EmptyProfileError);
    });
    it("should have correct id", function () {
      const err = new EmptyProfileError();
      expect(err.errorId).to.equal("generate25Miku-emptyProfile");
      expect(EmptyProfileError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new EmptyProfileError();
      expect(err.data).to.deep.equal({
        reason: "empty profile selected",
      });
    });
  });
});
