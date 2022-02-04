import { Command } from "./../command";
import { formatUserProfileRecord } from "./../../models/user-profile";
import { CommandInteraction, User } from "discord.js";
import { UserProfileStore } from "./../../store/user-profiles";

const errParseOptions = new Error("failed to parse options");

interface ListProfileOptions {
  user: User;
}

export class ListProfile implements Command {
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

  private async parseOptions(): Promise<ListProfileOptions> {
    let user = this.interaction.options.getUser("user");
    if (user == null) {
      user = this.interaction.user;
    }

    return { user };
  }

  async executeCommand(): Promise<void> {
    let options: ListProfileOptions;
    try {
      options = await this.parseOptions();
    } catch (e) {
      if (e === errParseOptions) {
        return await this.badRequest();
      }
      throw e;
    }
    const { user } = options;

    const record = await this.profileStore.get(user.id);
    if (!record || record.profiles.every((p) => p == null)) {
      return await this.noProfile();
    }

    await this.interaction.reply(
      [
        `${user} 的編組資料：`,
        "```",
        formatUserProfileRecord(record),
        "```",
      ].join("\n")
    );
  }
}
