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
import { InvalidOptionCardsError } from "./v2-errors";

interface RatioV2Options {
  cardRatios: number[];
}

export class RatioV2 extends InteractiveCommand {
  private readonly ratioVer = ProfileRatioVersion.V2;

  constructor(
    private l: Logger,
    interaction: CommandInteraction,
  ) {
    super(interaction);
  }

  private async parseOptions(): Promise<RatioV2Options> {
    const options: RatioV2Options = { cardRatios: null };
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
    this.l.debug("ratio v2");

    const options = await this.parseOptions();
    const { cardRatios } = options;
    this.l.debug({ options: { cardRatios } }, "ratio v2 options");

    const ratio = profileRatioFunctions[this.ratioVer](cardRatios);

    this.l.info("ratio v2 calculated");
    const ver = ProfileRatioVersionName[this.ratioVer];
    await this.interaction.reply(
      `此組卡片倍率為 ${ratio.toFixed(2)} (${ver})。`,
    );
  }
}
