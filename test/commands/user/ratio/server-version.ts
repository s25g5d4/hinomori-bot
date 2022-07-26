import { expect } from "chai";
import { RatioServerVersion } from "src/commands/user/ratio/server-version";
import { logger } from "src/logger";
import { StubInteraction } from "test/mocks/interaction";

describe("Ratio-ServerVersion Command", function () {
  it("should create", function () {
    const cmd = new RatioServerVersion(logger, null);
    expect(cmd).to.be.instanceOf(RatioServerVersion);
  });

  it("should reply", async function () {
    const stubInteraction = new StubInteraction();

    const cmd = new RatioServerVersion(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      "台服倍率計算公式版本：v1。\n日服倍率計算公式版本：v2。",
    ]);
  });
});
