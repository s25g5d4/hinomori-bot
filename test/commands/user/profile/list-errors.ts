import { expect } from "chai";
import {
  NoProfileRecordError,
  NoValidProfileError,
} from "src/commands/user/profile/list-errors";

describe("Profile List Command Errors", function () {
  describe("NoProfileRecordError", function () {
    it("should create", function () {
      expect(new NoProfileRecordError()).to.be.instanceOf(NoProfileRecordError);
    });
    it("should have correct id", function () {
      const err = new NoProfileRecordError();
      expect(err.errorId).to.equal("profileList-noProfileRecord");
      expect(NoProfileRecordError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new NoProfileRecordError();
      expect(err.data).to.deep.equal({
        reason: "user does not have profile record",
      });
    });
  });

  describe("NoValidProfileError", function () {
    it("should create", function () {
      expect(new NoValidProfileError()).to.be.instanceOf(NoValidProfileError);
    });
    it("should have correct id", function () {
      const err = new NoValidProfileError();
      expect(err.errorId).to.equal("profileList-noValidProfile");
      expect(NoValidProfileError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new NoValidProfileError();
      expect(err.data).to.deep.equal({
        reason: "user does not have any valid profile",
      });
    });
  });
});
