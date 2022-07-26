import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import { parseCards } from "src/models/parse-cards";
import { twProfileRatio } from "src/models/profile-ratio";
import { CatchExecuteError } from "../catch-execute-error";
import { InteractiveCommand } from "../interactive-command";
import { InvalidOptionCardsError } from "./ratio-tw-errors";

interface RatioTWOptions {
  cardRatios: number[];
}

export class RatioTW extends InteractiveCommand {
  constructor(private l: Logger, interaction: CommandInteraction) {
    super(interaction);
  }

  private async parseOptions(): Promise<RatioTWOptions> {
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
    this.l.debug("ratio-tw");

    const options = await this.parseOptions();
    const { cardRatios } = options;
    this.l.debug({ options: { cardRatios } }, "ratio-tw options");

    const ratio = twProfileRatio(cardRatios);

    this.l.info("ratio-tw calculated");
    await this.interaction.reply(`此組卡片倍率為 ${ratio.toFixed(2)} (tw)。`);
  }
}
