import { expect } from "chai";
import { User } from "discord.js";
import { match } from "sinon";
import { ArrangePlayers } from "../../../src/commands/user/arrange";
import { logger } from "../../../src/logger";
import {
  UserProfileRecord,
  UserProfileType,
} from "../../../src/models/user-profile";
import { StubInteraction } from "../../mocks/interaction";
import { StubUserProfileStore } from "../../mocks/profile-store";
import { genUserProfileRecord } from "../../mocks/record";
import { genUser } from "../../mocks/user";

describe("Arrange Command", function () {
  let users: User[] = [];
  let records: UserProfileRecord[] = [];
  beforeEach(function () {
    users = [
      genUser("user1_id", "user1", "1234"),
      genUser("user2_id", "user2", "2345"),
      genUser("user3_id", "user3", "3456"),
      genUser("user4_id", "user4", "4567"),
      genUser("user5_id", "user5", "5678"),
      genUser("user6_id", "no-active-profile", "6789"),
      genUser("user7_id", "no-active-profile-1", "7890"),
      genUser("user8_id", "no-profile", "8901"),
      genUser("user9_id", "no-profile-1", "9012"),
    ];
    records = [
      genUserProfileRecord({
        // user 1
        0: {
          type: UserProfileType.Runner,
          cards: [110, 80, 80, 60, 60],
          power: 150000,
        },
      }),
      genUserProfileRecord({
        // user 2
        0: {
          type: UserProfileType.Helper,
          cards: [130, 110, 110, 110, 110],
          power: 200000,
        },
      }),
      genUserProfileRecord({
        // user 3
        0: {
          type: UserProfileType.Helper,
          cards: [130, 110, 110, 110, 110],
          power: 150000,
        },
      }),
      genUserProfileRecord({
        // user 4
        0: {
          type: UserProfileType.Helper,
          cards: [130, 110, 110, 110, 110],
          power: 150000,
        },
      }),
      genUserProfileRecord({
        // user 5
        0: {
          type: UserProfileType.Helper,
          cards: [130, 110, 110, 110, 110],
          power: 150000,
        },
      }),
      genUserProfileRecord(
        {
          // user 6
          0: {
            type: UserProfileType.Helper,
            cards: [130, 110, 110, 110, 110],
            power: 150000,
          },
        },
        1
      ),
      genUserProfileRecord({
        // user 7
        1: {
          type: UserProfileType.Helper,
          cards: [130, 110, 110, 110, 110],
          power: 150000,
        },
      }),
      null,
      null,
    ];
  });

  it("should create", function () {
    const cmd = new ArrangePlayers(logger, null, null, false);
    expect(cmd).to.be.instanceOf(ArrangePlayers);
  });

  it("should reply", async function () {
    const stubProfileStore = new StubUserProfileStore()
      .withGet([match.string, users[0].id], records[0])
      .withGet([match.string, users[1].id], records[1])
      .withGet([match.string, users[2].id], records[2])
      .withGet([match.string, users[3].id], records[3])
      .withGet([match.string, users[4].id], records[4]);

    const stubInteraction = new StubInteraction()
      .withGetUser(["player1"], users[0])
      .withGetUser(["player2"], users[1])
      .withGetUser(["player3"], users[2])
      .withGetUser(["player4"], users[3])
      .withGetUser(["player5"], users[4]);

    const cmd = new ArrangePlayers(
      logger,
      stubInteraction.build(),
      stubProfileStore.build(),
      true
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: `推薦站位：<@user3_id>,<@user2_id>,<@user1_id>,<@user4_id>,<@user5_id>
\` 1: 幫手 綜合力: 150000 倍率: 5.10\` user3
\`*2: 幫手 綜合力: 200000 倍率: 5.10\` user2
\` 3: 跑者 綜合力: 150000 倍率: 3.54\` user1
\` 4: 幫手 綜合力: 150000 倍率: 5.10\` user4
\` 5: 幫手 綜合力: 150000 倍率: 5.10\` user5`,
        allowedMentions: undefined,
      },
    ]);
  });

  it("should reply (no mention)", async function () {
    const stubProfileStore = new StubUserProfileStore()
      .withGet([match.string, users[0].id], records[0])
      .withGet([match.string, users[1].id], records[1])
      .withGet([match.string, users[2].id], records[2])
      .withGet([match.string, users[3].id], records[3])
      .withGet([match.string, users[4].id], records[4]);

    const stubInteraction = new StubInteraction()
      .withGetUser(["player1"], users[0])
      .withGetUser(["player2"], users[1])
      .withGetUser(["player3"], users[2])
      .withGetUser(["player4"], users[3])
      .withGetUser(["player5"], users[4]);

    const cmd = new ArrangePlayers(
      logger,
      stubInteraction.build(),
      stubProfileStore.build(),
      false
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: `推薦站位：<@user3_id>,<@user2_id>,<@user1_id>,<@user4_id>,<@user5_id>
\` 1: 幫手 綜合力: 150000 倍率: 5.10\` user3
\`*2: 幫手 綜合力: 200000 倍率: 5.10\` user2
\` 3: 跑者 綜合力: 150000 倍率: 3.54\` user1
\` 4: 幫手 綜合力: 150000 倍率: 5.10\` user4
\` 5: 幫手 綜合力: 150000 倍率: 5.10\` user5`,
        allowedMentions: { users: [] },
      },
    ]);
  });

  it("should remove duplicated players", async function () {
    const stubProfileStore = new StubUserProfileStore()
      .withGet([match.string, users[0].id], records[0])
      .withGet([match.string, users[1].id], records[1])
      .withGet([match.string, users[2].id], records[2])
      .withGet([match.string, users[3].id], records[3]);

    const stubInteraction = new StubInteraction()
      .withGetUser(["player1"], users[0])
      .withGetUser(["player2"], users[1])
      .withGetUser(["player3"], users[2])
      .withGetUser(["player4"], users[3])
      .withGetUser(["player5"], users[3]);

    const cmd = new ArrangePlayers(
      logger,
      stubInteraction.build(),
      stubProfileStore.build(),
      true
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: `已過濾重複的玩家。
推薦站位：<@user3_id>,<@user2_id>,<@user1_id>,<@user4_id>
\` 1: 幫手 綜合力: 150000 倍率: 5.10\` user3
\`*2: 幫手 綜合力: 200000 倍率: 5.10\` user2
\` 3: 跑者 綜合力: 150000 倍率: 3.54\` user1
\` 4: 幫手 綜合力: 150000 倍率: 5.10\` user4`,
        allowedMentions: undefined,
      },
    ]);
  });

  it("should throw player not enough error", async function () {
    const stubProfileStore = new StubUserProfileStore();

    const stubInteraction = new StubInteraction()
      .withGetUser(["player1"], users[0])
      .withGetUser(["player2"], users[1])
      .withGetUser(["player3"], users[2]);

    const cmd = new ArrangePlayers(
      logger,
      stubInteraction.build(),
      stubProfileStore.build(),
      true
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "玩家人數不足四人，不建議開協力 LIVE。",
      },
    ]);
  });

  it("should throw empty profile records error", async function () {
    const stubProfileStore = new StubUserProfileStore()
      .withGet([match.string, users[7].id], records[7])
      .withGet([match.string, users[0].id], records[0])
      .withGet([match.string, users[8].id], records[8])
      .withGet([match.string, users[1].id], records[1])
      .withGet([match.string, users[2].id], records[2]);

    const stubInteraction = new StubInteraction()
      .withGetUser(["player1"], users[7])
      .withGetUser(["player2"], users[0])
      .withGetUser(["player3"], users[8])
      .withGetUser(["player4"], users[1])
      .withGetUser(["player5"], users[2]);

    const cmd = new ArrangePlayers(
      logger,
      stubInteraction.build(),
      stubProfileStore.build(),
      true
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content:
          "<@user8_id> (no-profile) <@user9_id> (no-profile-1) 沒有設定編組。",
        allowedMentions: undefined,
      },
    ]);

    it("should throw empty profile records error (no mention)", async function () {
      const stubProfileStore = new StubUserProfileStore()
        .withGet([match.string, users[7].id], records[7])
        .withGet([match.string, users[0].id], records[0])
        .withGet([match.string, users[8].id], records[8])
        .withGet([match.string, users[1].id], records[1])
        .withGet([match.string, users[2].id], records[2]);

      const stubInteraction = new StubInteraction()
        .withGetUser(["player1"], users[7])
        .withGetUser(["player2"], users[0])
        .withGetUser(["player3"], users[8])
        .withGetUser(["player4"], users[1])
        .withGetUser(["player5"], users[2]);

      const cmd = new ArrangePlayers(
        logger,
        stubInteraction.build(),
        stubProfileStore.build(),
        false
      );
      expect(await cmd.executeCommand()).to.not.exist;
      expect(stubInteraction.fakeReply.callCount).to.equal(1);
      expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
        {
          content:
            "<@user8_id> (no-profile) <@user9_id> (no-profile-1) 沒有設定編組。",
          allowedMentions: [],
        },
      ]);
    });
  });

  it("should throw empty active profiles error", async function () {
    const stubProfileStore = new StubUserProfileStore()
      .withGet([match.string, users[0].id], records[0])
      .withGet([match.string, users[1].id], records[1])
      .withGet([match.string, users[2].id], records[2])
      .withGet([match.string, users[5].id], records[5])
      .withGet([match.string, users[6].id], records[6]);

    const stubInteraction = new StubInteraction()
      .withGetUser(["player1"], users[0])
      .withGetUser(["player2"], users[1])
      .withGetUser(["player3"], users[2])
      .withGetUser(["player4"], users[5])
      .withGetUser(["player5"], users[6]);

    const cmd = new ArrangePlayers(
      logger,
      stubInteraction.build(),
      stubProfileStore.build(),
      true
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content:
          "<@user6_id> (no-active-profile) <@user7_id> (no-active-profile-1) 沒有設定使用中編組。",
        allowedMentions: undefined,
      },
    ]);

    it("should throw empty active profiles error (no mention)", async function () {
      const stubProfileStore = new StubUserProfileStore()
        .withGet([match.string, users[0].id], records[0])
        .withGet([match.string, users[1].id], records[1])
        .withGet([match.string, users[2].id], records[2])
        .withGet([match.string, users[5].id], records[5])
        .withGet([match.string, users[6].id], records[6]);

      const stubInteraction = new StubInteraction()
        .withGetUser(["player1"], users[0])
        .withGetUser(["player2"], users[1])
        .withGetUser(["player3"], users[2])
        .withGetUser(["player4"], users[5])
        .withGetUser(["player5"], users[6]);

      const cmd = new ArrangePlayers(
        logger,
        stubInteraction.build(),
        stubProfileStore.build(),
        false
      );
      expect(await cmd.executeCommand()).to.not.exist;
      expect(stubInteraction.fakeReply.callCount).to.equal(1);
      expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
        {
          content:
            "<@user6_id> (no-active-profile) <@user7_id> (no-active-profile-1) 沒有設定使用中編組。",
          allowedMentions: [],
        },
      ]);
    });
  });
});
