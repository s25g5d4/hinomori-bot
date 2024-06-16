import { expect } from "chai";
import { RatioV2 } from "src/commands/user/ratio/v2";
import { logger } from "src/logger";
import { StubInteraction } from "test/mocks/interaction";

describe("Ratio-V2 Command", function () {
  it("should create", function () {
    const cmd = new RatioV2(logger, null);
    expect(cmd).to.be.instanceOf(RatioV2);
  });

  it("should reply", async function () {
    const stubInteraction = new StubInteraction().withOptionsGet(
      "cards",
      "150,150,140,140,130",
    );

    const cmd = new RatioV2(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      "此組卡片倍率為 3.62 (v2)。",
    ]);
  });

  it("should allow using space as separator in option cards", async function () {
    const stubInteraction = new StubInteraction().withOptionsGet(
      "cards",
      "120 110 100 80 30",
    );

    const cmd = new RatioV2(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      "此組卡片倍率為 2.84 (v2)。",
    ]);
  });

  it("should throw invalid option cards error (less than 4 cards)", async function () {
    const stubInteraction = new StubInteraction()
      .withOptionsGet("type", "r")
      .withOptionsGet("power", 250000)
      .withOptionsGet("cards", "130,100,80,80")
      .withOptionsGet("index", undefined);

    const cmd = new RatioV2(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的卡片倍率 (cards) 格式錯誤。",
      },
    ]);
  });
});
