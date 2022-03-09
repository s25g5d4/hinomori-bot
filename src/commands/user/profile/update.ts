import { Command } from "../../command";
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

const errParseOptions = new Error("failed to parse options");

interface UpdateProfileOptions {
  type: UserProfileType;
  power: number;
  ratio: number;
  index: number;
}

export class UpdateProfile implements Command {
  constructor(
    private profileStore: UserProfileStore,
    private interaction: CommandInteraction
  ) {}

  private async badRequest() {
    logger.info({ reason: "bad request" }, "update failed");
    await this.interaction.reply("格式不正確。");
  }

  private async parseOptions(): Promise<UpdateProfileOptions> {
    const typeString = this.interaction.options.getString("type");
    if (typeof typeString !== "string") {
      throw errParseOptions;
    }

    let type: UserProfileType;
    try {
      type = convertToUserProfileType(typeString);
    } catch (e) {
      logger.error(e);
      throw errParseOptions;
    }

    const cardsString = this.interaction.options.getString("cards");
    if (typeof cardsString !== "string") {
      throw errParseOptions;
    }
    const cardRatioStrings = cardsString.split(",");
    if (cardRatioStrings.length !== 5) {
      throw errParseOptions;
    }
    const cards = cardRatioStrings.map((s) => parseInt(s, 10));
    if (cards.some((n) => typeof n !== "number" || isNaN(n))) {
      throw errParseOptions;
    }

    const ratio = profileRatio(cards);

    const power = this.interaction.options.getNumber("power");
    if (typeof power !== "number" || isNaN(power)) {
      throw errParseOptions;
    }

    const index = this.interaction.options.getNumber("index") ?? 1;
    if (isNaN(index) || index < 1 || index > 10) {
      throw errParseOptions;
    }

    return {
      type,
      power,
      ratio,
      index,
    };
  }

  async executeCommand(): Promise<void> {
    logger.debug("update profile");

    let options: UpdateProfileOptions;
    try {
      options = await this.parseOptions();
    } catch (e) {
      if (e === errParseOptions) {
        logger.warn({ command: this.interaction.toString() }, e.message);
        return await this.badRequest();
      }
      throw e;
    }
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
