import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import { parseCards } from "src/models/parse-cards";
import {
  twProfileRatio,
  twVersion,
  ProfileRatioVersionName,
} from "src/models/profile-ratio";
import { CatchExecuteError } from "src/commands/catch-execute-error";
import { InteractiveCommand } from "src/commands/interactive-command";
import { InvalidOptionCardsError } from "./tw-errors";

interface RatioTWOptions {
  cardRatios: number[];
}

export class RatioTW extends InteractiveCommand {
  constructor(
    private l: Logger,
    interaction: CommandInteraction,
  ) {
    super(interaction);
  }

  private async parseOptions(): Promise<RatioTWOptions> {
    const options: RatioTWOptions = { cardRatios: null };
    try {
      const cardsString = this.getStringOption("cards");
      options.cardRatios = parseCards(cardsString);
    } catch (err) {
      throw new InvalidOptionCardsError();
    }

    return options;
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("ratio tw");

    const options = await this.parseOptions();
    const { cardRatios } = options;
    this.l.debug({ options: { cardRatios } }, "ratio tw options");

    const ratio = twProfileRatio(cardRatios);

    this.l.info("ratio tw calculated");
    const ver = ProfileRatioVersionName[twVersion];
    await this.interaction.reply(
      `此組卡片倍率為 ${ratio.toFixed(2)} (${ver})。`,
    );
  }
}
