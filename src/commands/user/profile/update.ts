import {
  formatUserProfileRecord,
  UserProfile,
} from "./../../../models/user-profile";
import { CommandInteraction } from "discord.js";
import {
  convertToUserProfileType,
  UserProfileType,
} from "../../../models/user-profile";
import { UserProfileStore } from "../../../store/user-profiles";
import { logger } from "../../../logger";
import { logUser } from "../../../utils/log-user";
import { profileRatio } from "../../../models/profile-ratio";
import { InteractiveCommand } from "../../interactive-command";
import { CatchExecuteError } from "../../catch-execute-error";
import {
  IndexNotANumberError,
  IndexOutOfRangeError,
  invalidOptionCardsError,
  InvalidOptionPowerError,
  InvalidOptionTypeError,
  OptionPowerOutOfRangeError,
} from "./update-errors";
import { isNil } from "lodash";

interface UpdateProfileOptions {
  type: UserProfileType;
  power: number;
  ratio: number;
  index: number;
}

export class UpdateProfile extends InteractiveCommand {
  constructor(
    interaction: CommandInteraction,
    private profileStore: UserProfileStore
  ) {
    super(interaction);
  }

  private parseOptionType(): UserProfileType {
    const typeString = this.interaction.options.getString("type");
    if (typeof typeString !== "string") {
      throw new InvalidOptionTypeError();
    }

    let type: UserProfileType;
    try {
      type = convertToUserProfileType(typeString);
    } catch (e) {
      logger.error(e);
      throw new InvalidOptionTypeError();
    }
    return type;
  }

  private parseOptionCards(): number {
    const cardsString = this.interaction.options.getString("cards");
    if (typeof cardsString !== "string") {
      throw new invalidOptionCardsError();
    }
    const cardRatioStrings = cardsString.split(",");
    if (cardRatioStrings.length !== 5) {
      throw new invalidOptionCardsError();
    }
    const cards = cardRatioStrings.map((s) => parseInt(s, 10));
    if (cards.some((n) => typeof n !== "number" || isNaN(n))) {
      throw new invalidOptionCardsError();
    }
    return profileRatio(cards);
  }

  private parseOptionPower(): number {
    const power = this.interaction.options.getNumber("power");
    if (typeof power !== "number" || isNaN(power)) {
      throw new InvalidOptionPowerError();
    }
    if (power < 10000 || power > 350000) {
      throw new OptionPowerOutOfRangeError();
    }
    return power;
  }

  private parseOptionIndex(): number {
    const index = this.interaction.options.getNumber("index");
    if (isNil(index)) {
      return 1;
    }

    if (isNaN(index)) {
      throw new IndexNotANumberError();
    }

    if (index < 1 || index > 10) {
      throw new IndexOutOfRangeError();
    }

    return index;
  }

  private async parseOptions(): Promise<UpdateProfileOptions> {
    const type = this.parseOptionType();
    const ratio = this.parseOptionCards();
    const power = this.parseOptionPower();
    const index = this.parseOptionIndex();

    return {
      type,
      power,
      ratio,
      index,
    };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    logger.debug("update profile");

    const options = await this.parseOptions();
    const { type, power, ratio, index } = options;
    const { user } = this.interaction;
    logger.debug(
      { options: { type, power, ratio, index }, user: logUser(user) },
      "update profile options"
    );

    const newProfile: UserProfile = { type, power, ratio };

    let record = await this.profileStore.get(user.id);
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
    await this.profileStore.set(user.id, record);

    logger.info({ user: logUser(user) }, "profile updated");
    await this.interaction.reply(
      [
        "已更新。你的編組資料：",
        "```",
        formatUserProfileRecord(record),
        "```",
      ].join("\n")
    );
  }
}
