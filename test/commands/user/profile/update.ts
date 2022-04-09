import { expect } from "chai";
import { User } from "discord.js";
import { merge, range } from "lodash";
import { match, stub } from "sinon";
import { UpdateProfile } from "../../../../src/commands/user/profile/update";
import { logger } from "../../../../src/logger";
import {
  UserProfileRecord,
  UserProfileType,
} from "../../../../src/models/user-profile";
import { StubInteraction } from "../../../mocks/interaction";
import { StubUserProfileStore } from "../../../mocks/profile-store";
import { genUserProfileRecord } from "../../../mocks/record";
import { genUser } from "../../../mocks/user";

describe("Profile Update Command", function () {
  let users: User[] = [];
  let records: UserProfileRecord[] = [];
  beforeEach(function () {
    users = [
      genUser("user1_id", "user1", "1234"),
      genUser("user2_id", "no-profile", "2345"),
    ];
    records = [
      genUserProfileRecord({
        0: { type: UserProfileType.Runner, power: 250000, ratio: 3 },
      }),
      null,
    ];
  });

  it("should create", function () {
    const cmd = new UpdateProfile(logger, null, null);
    expect(cmd).to.be.instanceOf(UpdateProfile);
  });

  it("should update profile and reply (no record, default index)", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[1])
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore()
      .withGet([users[1].id], records[1])
      .withSet([users[1].id, match.any], null);

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.be.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      `已更新。你的編組資料：
\`\`\`
使用中的編組: *1
 *1: 跑者 綜合力: 250000 倍率: 4.16
\`\`\``,
    ]);

    // FIXME: Chai doesn't support tolerance of number comparison in deep
    // equality assertion, yet?
    const updatedRecord = genUserProfileRecord({
      0: {
        type: UserProfileType.Runner,
        power: 250000,
        ratio: 4.1595187199999994,
      },
    });
    expect(stubProfileStore.fakeSet.callCount).to.equal(1);
    expect(stubProfileStore.fakeSet.args[0]).to.deep.equal([
      users[1].id,
      updatedRecord,
    ]);
  });

  it("should update profile and reply (has record, default index)", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[0])
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore()
      .withGet([users[0].id], records[0])
      .withSet([users[0].id, match.any], null);

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.be.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      `已更新。你的編組資料：
\`\`\`
使用中的編組: *1
 *1: 跑者 綜合力: 250000 倍率: 4.16
\`\`\``,
    ]);

    // FIXME: Chai doesn't support tolerance of number comparison in deep
    // equality assertion, yet?
    const updatedRecord = genUserProfileRecord({
      0: {
        type: UserProfileType.Runner,
        power: 250000,
        ratio: 4.1595187199999994,
      },
    });
    expect(stubProfileStore.fakeSet.callCount).to.equal(1);
    expect(stubProfileStore.fakeSet.args[0]).to.deep.equal([
      users[0].id,
      updatedRecord,
    ]);
  });

  it("should update profile and reply (no record, given index)", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[1])
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], 2);

    const stubProfileStore = new StubUserProfileStore()
      .withGet([users[1].id], records[1])
      .withSet([users[1].id, match.any], null);

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.be.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      `已更新。你的編組資料：
\`\`\`
使用中的編組: *1
  2: 跑者 綜合力: 250000 倍率: 4.16
\`\`\``,
    ]);

    // FIXME: Chai doesn't support tolerance of number comparison in deep
    // equality assertion, yet?
    const updatedRecord = genUserProfileRecord({
      1: {
        type: UserProfileType.Runner,
        power: 250000,
        ratio: 4.1595187199999994,
      },
    });
    expect(stubProfileStore.fakeSet.callCount).to.equal(1);
    expect(stubProfileStore.fakeSet.args[0]).to.deep.equal([
      users[1].id,
      updatedRecord,
    ]);
  });

  it("should update profile and reply (has record, given index)", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[0])
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], 2);

    const stubProfileStore = new StubUserProfileStore()
      .withGet([users[0].id], records[0])
      .withSet([users[0].id, match.any], null);

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.be.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      `已更新。你的編組資料：
\`\`\`
使用中的編組: *1
 *1: 跑者 綜合力: 250000 倍率: 3.00
  2: 跑者 綜合力: 250000 倍率: 4.16
\`\`\``,
    ]);

    // FIXME: Chai doesn't support tolerance of number comparison in deep
    // equality assertion, yet?
    const updatedRecord = records[0];
    updatedRecord.profiles[1] = {
      type: UserProfileType.Runner,
      power: 250000,
      ratio: 4.1595187199999994,
    };
    expect(stubProfileStore.fakeSet.callCount).to.equal(1);
    expect(stubProfileStore.fakeSet.args[0]).to.deep.equal([
      users[0].id,
      updatedRecord,
    ]);
  });

  it("should be able to update up to 10 profiles", async function () {
    for (const i of range(1, 11)) {
      const stubInteraction = new StubInteraction()
        .withUser(users[0])
        .withGetString(["type"], "r")
        .withGetNumber(["power"], 250000)
        .withGetString(["cards"], "130,100,80,80,60")
        .withGetNumber(["index"], i);

      const stubProfileStore = new StubUserProfileStore()
        .withGet([users[0].id], records[0])
        .withSet([users[0].id, match.any], null);

      const cmd = new UpdateProfile(
        logger,
        stubInteraction.build(),
        stubProfileStore.build()
      );
      expect(await cmd.executeCommand()).to.not.exist;

      // FIXME: Chai doesn't support tolerance of number comparison in deep
      // equality assertion, yet?
      const updatedRecord = { ...records[0] };
      updatedRecord.profiles = merge(updatedRecord.profiles, {
        [i - 1]: {
          type: UserProfileType.Runner,
          power: 250000,
          ratio: 4.1595187199999994,
        },
      });
      expect(stubProfileStore.fakeSet.callCount).to.equal(1);
      expect(stubProfileStore.fakeSet.args[0]).to.deep.equal([
        users[0].id,
        updatedRecord,
      ]);
    }
  });

  it("should allow using space as separator in option cards", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[1])
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130 100 80 80 60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore()
      .withGet([users[1].id], records[1])
      .withSet([users[1].id, match.any], null);

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.be.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      `已更新。你的編組資料：
\`\`\`
使用中的編組: *1
 *1: 跑者 綜合力: 250000 倍率: 4.16
\`\`\``,
    ]);
  });

  it("should throw index not a number error (NaN)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], NaN);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.be.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的編號 (index) 錯誤。",
      },
    ]);
  });

  it("should throw index not a number error (string)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], "NotANumber" as unknown as number);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.be.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的編號 (index) 錯誤。",
      },
    ]);
  });

  it("should throw index out of range error (< 1)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], 0);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
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
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], 11);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
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
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], 1.25);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
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

  it("should throw invalid option type error (not string)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], 1 as unknown as string)
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的編組類型 (type) 錯誤。僅能選擇跑者或幫手其中一種。",
      },
    ]);
  });

  it("should throw invalid option type error (unknown type)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "unknown")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );

    // silence the unknown type error log message
    const stubLogger = stub(logger, "error");
    expect(await cmd.executeCommand()).to.not.exist;
    stubLogger.restore();
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的編組類型 (type) 錯誤。僅能選擇跑者或幫手其中一種。",
      },
    ]);
  });

  it("should throw invalid option power error (string)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], "NotANumber" as unknown as number)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的綜合力 (power) 格式錯誤。",
      },
    ]);
  });

  it("should throw invalid option power error (NaN)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], NaN)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的綜合力 (power) 格式錯誤。",
      },
    ]);
  });

  it("should throw option power out of range error (< 10000)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 9999)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content:
          "輸入的綜合力 (power) 過低或過高。請輸入完整數字，而不是以萬為單位的簡寫。",
      },
    ]);
  });

  it("should throw option power out of range error (> 350000)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 350001)
      .withGetString(["cards"], "130,100,80,80,60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content:
          "輸入的綜合力 (power) 過低或過高。請輸入完整數字，而不是以萬為單位的簡寫。",
      },
    ]);
  });

  it("should throw invalid option cards error (not a string)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], 130 as unknown as string)
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content:
          "輸入的卡片倍率 (cards) 格式錯誤。請以逗號 , 分隔，不要使用空白分隔。",
      },
    ]);
  });
  it("should throw invalid option cards error (less than 4 cards)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content:
          "輸入的卡片倍率 (cards) 格式錯誤。請以逗號 , 分隔，不要使用空白分隔。",
      },
    ]);
  });

  it("should throw invalid option cards error (more than 5 cards)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80,60,40")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content:
          "輸入的卡片倍率 (cards) 格式錯誤。請以逗號 , 分隔，不要使用空白分隔。",
      },
    ]);
  });

  it("should throw invalid option cards error (bad separator)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130|100|80|80|60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content:
          "輸入的卡片倍率 (cards) 格式錯誤。請以逗號 , 分隔，不要使用空白分隔。",
      },
    ]);
  });

  it("should throw invalid option cards error (not a number)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,aaa,80,80,60")
      .withGetNumber(["index"], undefined);

    const stubProfileStore = new StubUserProfileStore();

    const cmd = new UpdateProfile(
      logger,
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content:
          "輸入的卡片倍率 (cards) 格式錯誤。請以逗號 , 分隔，不要使用空白分隔。",
      },
    ]);
  });
});
