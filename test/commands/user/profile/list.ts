import { expect } from "chai";
import { User } from "discord.js";
import { ListProfile } from "../../../../src/commands/user/profile/list";
import {
  UserProfileRecord,
  UserProfileType,
} from "../../../../src/models/user-profile";
import { StubInteraction } from "../../../mocks/interaction";
import { StubUserProfileStore } from "../../../mocks/profile-store";
import { genUserProfileRecord } from "../../../mocks/record";
import { genUser } from "../../../mocks/user";

describe("Profile List Command", function () {
  let users: User[] = [];
  let records: UserProfileRecord[] = [];
  beforeEach(function () {
    users = [
      genUser("user1_id", "user1", "1234"),
      genUser("user2_id", "user2", "2345"),
      genUser("user3_id", "no-profile-record", "3456"),
      genUser("user4_id", "no-valid-profile", "4567"),
    ];
    records = [
      genUserProfileRecord({
        0: { type: UserProfileType.Runner, power: 250000, ratio: 3 },
        1: { type: UserProfileType.Helper, power: 200000, ratio: 5 },
      }),
      genUserProfileRecord(
        {
          0: { type: UserProfileType.Helper, power: 250000, ratio: 5.5 },
          1: { type: UserProfileType.Helper, power: 260000, ratio: 5.3 },
        },
        1
      ),
      null,
      genUserProfileRecord({}),
    ];
  });

  it("should create", function () {
    const cmd = new ListProfile(null, null);
    expect(cmd).to.be.instanceOf(ListProfile);
  });

  it("should list profiles and reply (same user)", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[0])
      .withGetUser(["user"], undefined);

    const stubProfileStore = new StubUserProfileStore().withGet(
      [users[0].id],
      records[0]
    );

    const cmd = new ListProfile(
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: `user1 (<@user1_id>) 的編組資料：
\`\`\`
使用中的編組: *1
 *1: 跑者 綜合力: 250000 倍率: 3.00
  2: 幫手 綜合力: 200000 倍率: 5.00
\`\`\``,
        allowedMentions: {
          users: [],
        },
      },
    ]);
  });

  it("should list profiles and reply (other user)", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[0])
      .withGetUser(["user"], users[1]);

    const stubProfileStore = new StubUserProfileStore().withGet(
      [users[1].id],
      records[1]
    );

    const cmd = new ListProfile(
      stubInteraction.build(),
      stubProfileStore.build()
    );
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: `user2 (<@user2_id>) 的編組資料：
\`\`\`
使用中的編組: *2
  1: 幫手 綜合力: 250000 倍率: 5.50
 *2: 幫手 綜合力: 260000 倍率: 5.30
\`\`\``,
        allowedMentions: {
          users: [],
        },
      },
    ]);
  });

  it("should throw no profile record error", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[2])
      .withGetUser(["user"], undefined);

    const stubProfileStore = new StubUserProfileStore().withGet(
      [users[2].id],
      records[2]
    );

    const cmd = new ListProfile(
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

  it("should throw no valid profile error", async function () {
    const stubInteraction = new StubInteraction()
      .withUser(users[3])
      .withGetUser(["user"], undefined);

    const stubProfileStore = new StubUserProfileStore().withGet(
      [users[3].id],
      records[3]
    );

    const cmd = new ListProfile(
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
});
