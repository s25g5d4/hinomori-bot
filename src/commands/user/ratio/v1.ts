import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import { parseCards } from "src/models/parse-cards";
import {
  profileRatioFunctions,
  ProfileRatioVersion,
  ProfileRatioVersionName,
} from "src/models/profile-ratio";
import { CatchExecuteError } from "src/commands/catch-execute-error";
import { InteractiveCommand } from "src/commands/interactive-command";
import { InvalidOptionCardsError } from "./v1-errors";

interface RatioV1Options {
  cardRatios: number[];
}

export class RatioV1 extends InteractiveCommand {
  private readonly ratioVer = ProfileRatioVersion.V1;

  constructor(private l: Logger, interaction: CommandInteraction) {
    super(interaction);
  }

  private async parseOptions(): Promise<RatioV1Options> {
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
    this.l.debug("ratio v1");

    const options = await this.parseOptions();
    const { cardRatios } = options;
    this.l.debug({ options: { cardRatios } }, "ratio v1 options");

    const ratio = profileRatioFunctions[this.ratioVer](cardRatios);

    this.l.info("ratio v1 calculated");
    const ver = ProfileRatioVersionName[this.ratioVer];
    await this.interaction.reply(
      `此組卡片倍率為 ${ratio.toFixed(2)} (${ver})。`
    );
  }
}
