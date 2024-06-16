import { expect } from "chai";
import { RatioV1 } from "src/commands/user/ratio/v1";
import { logger } from "src/logger";
import { StubInteraction } from "test/mocks/interaction";

describe("Ratio-V1 Command", function () {
  it("should create", function () {
    const cmd = new RatioV1(logger, null);
    expect(cmd).to.be.instanceOf(RatioV1);
  });

  it("should reply", async function () {
    const stubInteraction = new StubInteraction().withOptionsGet(
      "cards",
      "130,130,130,130,130",
    );

    const cmd = new RatioV1(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      "此組卡片倍率為 5.80 (v1)。",
    ]);
  });

  it("should allow using space as separator in option cards", async function () {
    const stubInteraction = new StubInteraction().withOptionsGet(
      "cards",
      "130 130 120 115 110",
    );

    const cmd = new RatioV1(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      "此組卡片倍率為 5.39 (v1)。",
    ]);
  });

  it("should throw invalid option cards error (less than 4 cards)", async function () {
    const stubInteraction = new StubInteraction()
      .withOptionsGet("type", "r")
      .withOptionsGet("power", 250000)
      .withOptionsGet("cards", "130,100,80,80")
      .withOptionsGet("index", undefined);

    const cmd = new RatioV1(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的卡片倍率 (cards) 格式錯誤。",
      },
    ]);
  });
});
