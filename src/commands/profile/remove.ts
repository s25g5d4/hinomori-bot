import { Command } from "./../command";
import { formatUserProfileRecord } from "./../../models/user-profile";
import { CommandInteraction } from "discord.js";
import { UserProfileStore } from "./../../store/user-profiles";

const errParseOptions = new Error("failed to parse options");

interface RemoveProfileOptions {
  index: number;
}

export class RemoveProfile implements Command {
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

  private async parseOptions(): Promise<RemoveProfileOptions> {
    const index = this.interaction.options.getNumber("index");
    if (typeof index !== "number" || isNaN(index) || index < 1 || index > 10) {
      throw errParseOptions;
    }

    return { index };
  }

  async executeCommand(): Promise<void> {
    let options: RemoveProfileOptions;
    try {
      options = await this.parseOptions();
    } catch (e) {
      if (e === errParseOptions) {
        return await this.badRequest();
      }
      throw e;
    }
    const { index } = options;
    const { user } = this.interaction;

    const record = await this.profileStore.get(user.id);
    if (!record || record.profiles.every((p) => p == null)) {
      return await this.noProfile();
    }

    const profile = record.profiles[index - 1];
    if (profile == null) {
      return await this.emptyProfileSelected();
    }

    const newProfiles = [...record.profiles];
    newProfiles[index - 1] = null;

    const newRecord: typeof record = { ...record, profiles: newProfiles };
    await this.profileStore.set(user.id, newRecord);

    await this.interaction.reply(
      [
        `已移除選擇的編組。你的編組資料：`,
        "```",
        formatUserProfileRecord(newRecord),
        "```",
      ].join("\n")
    );
  }
}
