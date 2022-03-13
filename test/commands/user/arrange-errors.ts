import { expect } from "chai";
import { User } from "discord.js";
import {
  EmptyActiveProfilesError,
  EmptyProfilesError,
  PlayerNotEnoughError,
} from "../../../src/commands/user/arrange-errors";

describe("Arrange Command Errors", function () {
  describe("PlayerNotEnoughError", function () {
    it("should create", function () {
      expect(new PlayerNotEnoughError(1)).to.be.instanceOf(
        PlayerNotEnoughError
      );
    });
    it("should have correct id", function () {
      const err = new PlayerNotEnoughError(1);
      expect(err.errorId).to.equal("arrange-noEnoughPlayers");
      expect(PlayerNotEnoughError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const err = new PlayerNotEnoughError(1);
      expect(err.data).to.deep.equal({
        reason: "no enough players",
        count: 1,
      });
    });
  });

  describe("EmptyProfilesError", function () {
    it("should create", function () {
      expect(new EmptyProfilesError([], false)).to.be.instanceOf(
        EmptyProfilesError
      );
    });
    it("should have correct id", function () {
      const err = new EmptyProfilesError([], false);
      expect(err.errorId).to.equal("arrange-emptyProfiles");
      expect(EmptyProfilesError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const users: User[] = [{ id: "user1" } as User, { id: "user2" } as User];
      const err1 = new EmptyProfilesError(users, true);
      expect(err1.data).to.deep.equal({
        reason: "empty profile records",
        users: [{ id: "user1" } as User, { id: "user2" } as User],
        mention: true,
      });
      const err2 = new EmptyProfilesError(users, false);
      expect(err2.data).to.deep.equal({
        reason: "empty profile records",
        users: [{ id: "user1" } as User, { id: "user2" } as User],
        mention: false,
      });
    });
  });

  describe("EmptyActiveProfilesError", function () {
    it("should create", function () {
      expect(new EmptyActiveProfilesError([], false)).to.be.instanceOf(
        EmptyActiveProfilesError
      );
    });
    it("should have correct id", function () {
      const err = new EmptyActiveProfilesError([], false);
      expect(err.errorId).to.equal("arrange-emptyActiveProfiles");
      expect(EmptyActiveProfilesError.id).to.equal(err.errorId);
    });
    it("should have correct data", function () {
      const users: User[] = [{ id: "user1" } as User, { id: "user2" } as User];
      const err1 = new EmptyActiveProfilesError(users, true);
      expect(err1.data).to.deep.equal({
        reason: "empty active profiles",
        users: [{ id: "user1" } as User, { id: "user2" } as User],
        mention: true,
      });
      const err2 = new EmptyActiveProfilesError(users, false);
      expect(err2.data).to.deep.equal({
        reason: "empty active profiles",
        users: [{ id: "user1" } as User, { id: "user2" } as User],
        mention: false,
      });
    });
  });
});
