import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import { parseCards } from "src/models/parse-cards";
import { jpProfileRatio } from "src/models/profile-ratio";
import { CatchExecuteError } from "../catch-execute-error";
import { InteractiveCommand } from "../interactive-command";
import { InvalidOptionCardsError } from "./ratio-jp-errors";

interface RatioJPOptions {
  cardRatios: number[];
}

export class RatioJP extends InteractiveCommand {
  constructor(private l: Logger, interaction: CommandInteraction) {
    super(interaction);
  }

  private async parseOptions(): Promise<RatioJPOptions> {
    const cardsString = this.interaction.options.getString("cards");
    if (typeof cardsString !== "string") {
      throw new InvalidOptionCardsError();
    }

    let cardRatios: number[];
    try {
      cardRatios = parseCards(cardsString);
    } catch (e) {
      throw new InvalidOptionCardsError();
    }

    return { cardRatios };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("ratio-jp");

    const options = await this.parseOptions();
    const { cardRatios } = options;
    this.l.debug({ options: { cardRatios } }, "ratio-jp options");

    const ratio = jpProfileRatio(cardRatios);

    this.l.info("ratio-jp calculated");
    await this.interaction.reply(`此組卡片倍率為 ${ratio.toFixed(2)} (jp)。`);
  }
}
