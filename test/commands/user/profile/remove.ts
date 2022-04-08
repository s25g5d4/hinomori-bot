import { expect } from "chai";
import { User } from "discord.js";
import { match } from "sinon";
import { RemoveProfile } from "../../../../src/commands/user/profile/remove";
import { logger } from "../../../../src/logger";
import {
  UserProfileRecord,
  UserProfileType,
} from "../../../../src/models/user-profile";
import { StubInteraction } from "../../../mocks/interaction";
import { StubUserProfileStore } from "../../../mocks/profile-store";
import { genUserProfileRecord } from "../../../mocks/record";
import { genUser } from "../../../mocks/user";

describe("Profile Remove Command", function () {
  let users: User[] = [];
  let records: UserProfileRecord[];
  beforeEach(function () {
    users = [
      genUser("user1_id", "user1", "1234"),
      genUser("user2_id", "no-profile", "2345"),
      genUser("user3_id", "one-profile", "3456"),
    ];
    records = [
      genUserProfileRecord({
        0: {
          type: UserProfileType.Runner,
          power: 250000,
          cards: [110, 80, 80, 60, 60],
        },
        1: {
          type: UserProfileType.Helper,
          power: 200000,
          cards: [130, 110, 110, 110, 110],
        },
      }),
      null,
      genUserProfileRecord({
        0: {
          type: UserProfileType.Runner,
          power: 250000,
          cards: [110, 80, 80, 60, 60],
        },
      }),
    ];
  });

  it("should create", function () {
    const cmd = new RemoveProfile(logger, null, null);
    expect(cmd).to.be.instanceOf(RemoveProfile);
  });

  it("should remove profile and reply", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[0])
      .withGetNumber(["index"], 2);

    const stubProfileStore = new StubUserProfileStore()
      .withGet([users[0].id], records[0])
      .withSet([users[0].id, match.any], undefined);

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      `已移除選擇的編組。你的編組資料：
\`\`\`
使用中的編組: *1
 *1: 跑者 綜合力: 250000 倍率: 3.54
\`\`\``,
    ]);

    const updatedRecord: UserProfileRecord = genUserProfileRecord({
      0: {
        type: UserProfileType.Runner,
        power: 250000,
        cards: [110, 80, 80, 60, 60],
      },
    });
    expect(stubProfileStore.fakeSet.callCount).to.equal(1);
    expect(stubProfileStore.fakeSet.args[0]).to.deep.equal([
      users[0].id,
      updatedRecord,
    ]);
  });

  it("should reply different mesage when profiles are all empty", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[2])
      .withGetNumber(["index"], 1);

    const stubProfileStore = new StubUserProfileStore()
      .withGet([users[2].id], records[2])
      .withSet([users[2].id, match.any], undefined);

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      `已移除選擇的編組。你的編組資料是空的。`,
    ]);
  });

  it("should not change active profile when removing", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[0])
      .withGetNumber(["index"], 1);

    const stubProfileStore = new StubUserProfileStore()
      .withGet([users[0].id], records[0])
      .withSet([users[0].id, match.any], undefined);

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;

    const updatedRecord: UserProfileRecord = genUserProfileRecord(
      {
        1: {
          type: UserProfileType.Helper,
          power: 200000,
          cards: [130, 110, 110, 110, 110],
        },
      },
      0
    );
    expect(stubProfileStore.fakeSet.callCount).to.equal(1);
    expect(stubProfileStore.fakeSet.args[0]).to.deep.equal([
      users[0].id,
      updatedRecord,
    ]);
  });

  it("should throw empty index error", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[0])
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore().withGet(
      [users[0].id],
      records[0]
    );

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "沒有輸入編號 (index)。",
      },
    ]);
  });

  it("should throw index not a number error (NaN)", async function () {
    const stubInteraction = new StubInteraction().withGetNumber(["index"], NaN);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的編號 (index) 錯誤。",
      },
    ]);
  });

  it("should throw index not a number error (string)", async function () {
    const stubInteraction = new StubInteraction().withGetNumber(
      ["index"],
      "NotANumber" as unknown as number
    );

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的編號 (index) 錯誤。",
      },
    ]);
  });

  it("should throw index out of range error (< 1)", async function () {
    const stubInteraction = new StubInteraction().withGetNumber(["index"], 0);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的編號 (index) 錯誤。僅能輸入 1~10。",
      },
    ]);
  });

  it("should throw index out of range error (> 10)", async function () {
    const stubInteraction = new StubInteraction().withGetNumber(["index"], 11);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的編號 (index) 錯誤。僅能輸入 1~10。",
      },
    ]);
  });

  it("should throw index out of range error (floating point)", async function () {
    const stubInteraction = new StubInteraction().withGetNumber(
      ["index"],
      1.25
    );

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的編號 (index) 錯誤。僅能輸入 1~10。",
      },
    ]);
  });

  it("should throw no profile record error", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[1])
      .withGetNumber(["index"], 2);

    const stubProfileStore = new StubUserProfileStore().withGet(
      [users[1].id],
      records[1]
    );

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "沒有編組資料。請先使用 /profile update 指令新增編組。",
      },
    ]);
  });

  it("should throw empty profile error", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[0])
      .withGetNumber(["index"], 10);

    const stubProfileStore = new StubUserProfileStore().withGet(
      [users[0].id],
      records[0]
    );

    const cmd = new RemoveProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "選擇的編組是空白的。",
      },
    ]);
  });
});
