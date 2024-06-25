import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import {
  formatUserProfileRecord,
  UserProfile,
  convertToUserProfileType,
  UserProfileType,
  UnknownTypeError,
} from "src/models/user-profile";
import { UserProfileStore } from "src/store/user-profiles";
import { defaultVersion } from "src/models/profile-ratio";
import { config } from "src/config";
import { logger } from "src/logger";
import { InteractiveCommand, NullOptionError } from "../../interactive-command";
import { CatchExecuteError } from "../../catch-execute-error";
import {
  IndexNotANumberError,
  IndexOutOfRangeError,
  InvalidOptionCardsError,
  InvalidOptionPowerError,
  InvalidOptionTypeError,
  OptionPowerOutOfRangeError,
} from "./update-errors";

const minProfilePower = parseInt(config.minProfilePower, 10);
const maxProfilePower = parseInt(config.maxProfilePower, 10);

if (isNaN(minProfilePower)) {
  const msg = "invalid min profile power";
  logger.fatal({ value: config.minProfilePower }, msg);
  throw new Error(msg);
}

if (isNaN(maxProfilePower)) {
  const msg = "invalid max profile power";
  logger.fatal({ value: config.maxProfilePower }, msg);
  throw new Error(msg);
}

if (minProfilePower > maxProfilePower) {
  const msg = "min profile power is greater than max profile power";
  logger.fatal({ minProfilePower, maxProfilePower }, msg);
  throw new Error(msg);
}

interface UpdateProfileOptions {
  type: UserProfileType;
  power: number;
  cards: [number, number, number, number, number];
  index: number;
}

export class UpdateProfile extends InteractiveCommand {
  private readonly separator = /,| /g;

  constructor(
    private l: Logger,
    interaction: CommandInteraction,
    private profileStore: UserProfileStore,
  ) {
    super(interaction);
  }

  private parseOptionType(): UserProfileType {
    try {
      const typeString = this.getStringOption("type");
      const type = convertToUserProfileType(typeString);
      return type;
    } catch (err) {
      if (err instanceof UnknownTypeError) {
        this.l.error(err);
      }
      throw new InvalidOptionTypeError();
    }
  }

  private parseOptionCards(): [number, number, number, number, number] {
    let cardsString: string;
    try {
      cardsString = this.getStringOption("cards");
    } catch (err) {
      throw new InvalidOptionCardsError();
    }

    const cardRatioStrings = cardsString.split(this.separator);
    if (cardRatioStrings.length !== 5) {
      throw new InvalidOptionCardsError();
    }
    const cards = cardRatioStrings.map((s) => parseInt(s, 10));
    if (cards.some((n) => typeof n !== "number" || isNaN(n))) {
      throw new InvalidOptionCardsError();
    }
    return cards as [number, number, number, number, number];
  }

  private parseOptionPower(): number {
    let power: number;
    try {
      power = this.getNumberOption("power");
    } catch (err) {
      throw new InvalidOptionPowerError();
    }
    if (isNaN(power)) {
      throw new InvalidOptionPowerError();
    }
    if (power < minProfilePower || power >= maxProfilePower) {
      throw new OptionPowerOutOfRangeError();
    }
    return power;
  }

  private parseOptionIndex(): number {
    let index: number;
    try {
      index = this.getNumberOption("index");
    } catch (err) {
      if (err instanceof NullOptionError) {
        return 1; // default value
      }
      throw new IndexNotANumberError();
    }
    if (isNaN(index)) {
      throw new IndexNotANumberError();
    }
    if (index < 1 || index > 10 || !Number.isInteger(index)) {
      throw new IndexOutOfRangeError();
    }

    return index;
  }

  private async parseOptions(): Promise<UpdateProfileOptions> {
    const type = this.parseOptionType();
    const cards = this.parseOptionCards();
    const power = this.parseOptionPower();
    const index = this.parseOptionIndex();

    return {
      type,
      power,
      cards,
      index,
    };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("update profile");

    const options = await this.parseOptions();
    const { type, power, cards, index } = options;
    const { user, guild } = this.interaction;
    this.l.debug(
      { options: { type, power, cards, index } },
      "update profile options",
    );

    const newProfile: UserProfile = { type, power, cards };

    let record = await this.profileStore.get(guild.id, user.id);
    if (!record) {
      record = {
        profiles: Array(10).fill(null),
        active: 0,
      };
    }
    const newProfiles = [...record.profiles];
    const i = index - 1;
    newProfiles[i] = newProfile;
    record = { ...record, profiles: newProfiles };
    await this.profileStore.set(guild.id, user.id, record);

    this.l.info("profile updated");
    await this.interaction.reply(
      [
        "已更新。你的編組資料：",
        "```",
        formatUserProfileRecord(record, defaultVersion),
        "```",
      ].join("\n"),
    );
  }
}
