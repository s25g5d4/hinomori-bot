import { expect } from "chai";
import {
  EmptyIndexError,
  EmptyProfileError,
  IndexNotANumberError,
  IndexOutOfRangeError,
  NoProfileRecordError,
} from "src/commands/user/profile/remove-errors";

describe("Profile Remove Command Errors", function () {
  describe("EmptyIndexError", function () {
    it("should create", function () {
      expect(new EmptyIndexError()).to.be.instanceOf(EmptyIndexError);
    });
    it("should have correct id", function () {
      const err = new EmptyIndexError();
      expect(err.errorId).to.equal("profileRemove-emptyIndex");
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
      expect(err.errorId).to.equal("profileRemove-indexNotANumber");
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
      expect(err.errorId).to.equal("profileRemove-indexOutOfRange");
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
      expect(err.errorId).to.equal("profileRemove-noProfileRecord");
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
      expect(err.errorId).to.equal("profileRemove-emptyProfile");
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
