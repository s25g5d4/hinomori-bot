import { expect } from "chai";
import { User } from "discord.js";
import { match } from "sinon";
import { NiGoMikuProfile } from "../../../../src/commands/user/profile/25-miku";
import {
  UserProfileRecord,
  UserProfileType,
} from "../../../../src/models/user-profile";
import { StubInteraction } from "../../../mocks/interaction";
import { StubUserProfileStore } from "../../../mocks/profile-store";
import { genUserProfileRecord } from "../../../mocks/record";
import { genUser } from "../../../mocks/user";
import { logger } from "../../../../src/logger";

describe("Generate 25 Miku Profile Command", function () {
  let users: User[] = [];
  let records: UserProfileRecord[] = [];
  beforeEach(function () {
    users = [
      genUser("user1_id", "user1", "1234"),
      genUser("user2_id", "no-profile", "2345"),
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
    ];
  });

  it("should create", function () {
    const cmd = new NiGoMikuProfile(logger, null, null);
    expect(cmd).to.be.instanceOf(NiGoMikuProfile);
  });

  it("should generate 25 miku profile and reply", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[0])
      .withGetString(["nickname"], "shiho")
      .withGetNumber(["index"], 2);

    const stubProfileStore = new StubUserProfileStore()
      .withGet([match.string, users[0].id], records[0])
      .withSet([match.string, users[0].id, match.any], undefined);

    const cmd = new NiGoMikuProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      "白蔥指令：\n`&b rtw shiho h 20.00 130 110 110 110 110`",
    ]);
  });

  it("should throw empty nickname error (undefined)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["nickname"], undefined)
      .withGetNumber(["index"], 2);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new NiGoMikuProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "沒有輸入暱稱 (nickname)。",
      },
    ]);
  });

  it("should throw empty nickname error (empty string)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["nickname"], "")
      .withGetNumber(["index"], 2);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new NiGoMikuProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "沒有輸入暱稱 (nickname)。",
      },
    ]);
  });

  it("should throw invalid nickname error", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["nickname"], 1 as unknown as string)
      .withGetNumber(["index"], 2);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new NiGoMikuProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的暱稱 (nickname) 錯誤。",
      },
    ]);
  });

  it("should throw empty index error", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["nickname"], "shiho")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new NiGoMikuProfile(
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
    const stubInteraction = new StubInteraction()
      .withGetString(["nickname"], "shiho")
      .withGetNumber(["index"], NaN);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new NiGoMikuProfile(
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
    const stubInteraction = new StubInteraction()
      .withGetString(["nickname"], "shiho")
      .withGetNumber(["index"], "NotANumber" as unknown as number);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new NiGoMikuProfile(
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
    const stubInteraction = new StubInteraction()
      .withGetString(["nickname"], "shiho")
      .withGetNumber(["index"], 0);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new NiGoMikuProfile(
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
    const stubInteraction = new StubInteraction()
      .withGetString(["nickname"], "shiho")
      .withGetNumber(["index"], 11);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new NiGoMikuProfile(
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
    const stubInteraction = new StubInteraction()
      .withGetString(["nickname"], "shiho")
      .withGetNumber(["index"], 1.25);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new NiGoMikuProfile(
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
      .withGetString(["nickname"], "shiho")
      .withGetNumber(["index"], 2);

    const stubProfileStore = new StubUserProfileStore().withGet(
      [match.string, users[1].id],
      records[1]
    );

    const cmd = new NiGoMikuProfile(
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
      .withGetString(["nickname"], "shiho")
      .withGetNumber(["index"], 10);

    const stubProfileStore = new StubUserProfileStore().withGet(
      [match.string, users[0].id],
      records[0]
    );

    const cmd = new NiGoMikuProfile(
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
