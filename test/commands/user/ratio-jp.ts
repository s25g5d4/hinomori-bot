import { expect } from "chai";
import { RatioJP } from "../../../src/commands/user/ratio-jp";
import { logger } from "../../../src/logger";
import { StubInteraction } from "../../mocks/interaction";

describe("Ratio-JP Command", function () {
  it("should create", function () {
    const cmd = new RatioJP(logger, null as any);
    expect(cmd).to.be.instanceOf(RatioJP);
  });

  it("should reply", async function () {
    const stubInteraction = new StubInteraction().withGetString(
      ["cards"],
      "150,150,140,140,130"
    );

    const cmd = new RatioJP(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      "此組卡片倍率為 3.62 (jp)。",
    ]);
  });

  it("should allow using space as separator in option cardsr", async function () {
    const stubInteraction = new StubInteraction().withGetString(
      ["cards"],
      "120 110 100 80 30"
    );

    const cmd = new RatioJP(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      "此組卡片倍率為 2.84 (jp)。",
    ]);
  });

  it("should throw invalid option cards error (less than 4 cards)", async function () {
    const stubInteraction = new StubInteraction()
      .withGetString(["type"], "r")
      .withGetNumber(["power"], 250000)
      .withGetString(["cards"], "130,100,80,80")
      .withGetNumber(["index"], undefined!);

    const cmd = new RatioJP(logger, stubInteraction.build());
    expect(await cmd.executeCommand()).to.not.exist;
    expect(stubInteraction.fakeReply.callCount).to.equal(1);
    expect(stubInteraction.fakeReply.args[0]).to.deep.equal([
      {
        content: "輸入的卡片倍率 (cards) 格式錯誤。",
      },
    ]);
  });
});
