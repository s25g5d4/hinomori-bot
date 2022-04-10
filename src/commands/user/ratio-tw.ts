import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import { parseCards } from "src/models/parse-cards";
import { profileRatio } from "src/models/profile-ratio";
import { logUser } from "src/utils/log-user";
import { CatchExecuteError } from "../catch-execute-error";
import { InteractiveCommand } from "../interactive-command";
import { InvalidOptionCardsError } from "./ratio-tw-errors";

interface RatioTWOptions {
  ratio: number;
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

    return { ratio: profileRatio(cardRatios) };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("ratio-tw");

    const options = await this.parseOptions();
    const { ratio } = options;
    const { user } = this.interaction;
    this.l.debug(
      { options: { ratio }, user: logUser(user) },
      "ratio-tw options"
    );

    this.l.info({ user: logUser(user) }, "ratio-tw calculated");
    await this.interaction.reply(`此組卡片倍率為 ${ratio.toFixed(2)}。`);
  }
}
