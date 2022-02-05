import { Command } from "./../command";
import { formatUserProfileWithIndex } from "./../../models/user-profile";
import { CommandInteraction } from "discord.js";
import { UserProfileStore } from "./../../store/user-profiles";
import { logger } from "../../logger";

const errParseOptions = new Error("failed to parse options");

interface ActivateProfileOptions {
  index: number;
}

export class ActivateProfile implements Command {
  constructor(
    private profileStore: UserProfileStore,
    private interaction: CommandInteraction
  ) {}

  private async badRequest() {
    await this.interaction.reply("格式不正確");
  }

  private async noProfile() {
    await this.interaction.reply(
      "沒有編組資料。請先使用 /profile update 指令新增編組。"
    );
  }

  private async emptyProfileSelected() {
    await this.interaction.reply("選擇的編組是空白的。");
  }

  private async parseOptions(): Promise<ActivateProfileOptions> {
    const index = this.interaction.options.getNumber("index");
    if (typeof index !== "number" || isNaN(index) || index < 1 || index > 10) {
      throw errParseOptions;
    }

    return { index };
  }

  async executeCommand(): Promise<void> {
    logger.debug("activate profile");
    let options: ActivateProfileOptions;
    try {
      options = await this.parseOptions();
    } catch (e) {
      if (e === errParseOptions) {
        logger.warn({ command: this.interaction.toString() }, e.message);
        return await this.badRequest();
      }
      throw e;
    }
    const { index } = options;
    const { user } = this.interaction;
    logger.debug(
      { options: { index }, user: user.id },
      "activate profile options"
    );

    const record = await this.profileStore.get(user.id);
    if (!record || record.profiles.every((p) => p == null)) {
      return await this.noProfile();
    }

    const i = index - 1;
    const profile = record.profiles[i];
    if (profile == null) {
      return await this.emptyProfileSelected();
    }

    const newRecord: typeof record = { ...record, active: i };
    await this.profileStore.set(user.id, newRecord);

    logger.info({ user: user.id }, "profile activated");
    await this.interaction.reply(
      [
        `已更新使用中編組編號。使用中編組：`,
        "```",
        formatUserProfileWithIndex(profile, i),
        "```",
      ].join("\n")
    );
  }
}
