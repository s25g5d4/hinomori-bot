import { Command } from "./../command";
import { formatUserProfileRecord } from "./../../models/user-profile";
import { CommandInteraction, User } from "discord.js";
import { UserProfileStore } from "./../../store/user-profiles";
import { logger } from "../../logger";
import { logUser } from "../../utils/log-user";

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
    logger.info({ reason: "bad request" }, "list failed");
    await this.interaction.reply("格式不正確。");
  }

  private async noProfile() {
    logger.info({ reason: "no valid profile" }, "list failed");
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
    logger.debug("list profile");
    let options: ListProfileOptions;
    try {
      options = await this.parseOptions();
    } catch (e) {
      if (e === errParseOptions) {
        logger.warn({ command: this.interaction.toString() }, e.message);
        return await this.badRequest();
      }
      throw e;
    }
    const { user: targetUser } = options;
    const { user } = this.interaction;
    logger.debug(
      { options: { user: logUser(targetUser) }, user: logUser(user) },
      "remove profile options"
    );

    const record = await this.profileStore.get(targetUser.id);
    if (!record || record.profiles.every((p) => p == null)) {
      return await this.noProfile();
    }

    logger.info(
      { user: logUser(user), targetUser: logUser(targetUser) },
      "profile listed"
    );
    const userString = `${targetUser.username} (${targetUser})`;
    await this.interaction.reply({
      content: [
        `${userString} 的編組資料：`,
        "```",
        formatUserProfileRecord(record),
        "```",
      ].join("\n"),
      allowedMentions: { users: [] },
    });
  }
}
