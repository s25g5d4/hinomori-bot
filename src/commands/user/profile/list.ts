import { CommandInteraction, User } from "discord.js";
import { isNil } from "lodash";
import { Logger } from "pino";
import { formatUserProfileRecord } from "src/models/user-profile";
import { UserProfileStore } from "src/store/user-profiles";
import { logUser } from "src/utils/log-user";
import { InteractiveCommand } from "../../interactive-command";
import { CatchExecuteError } from "../../catch-execute-error";
import { NoProfileRecordError, NoValidProfileError } from "./list-errors";

interface ListProfileOptions {
  user: User;
}

export class ListProfile extends InteractiveCommand {
  constructor(
    private l: Logger,
    interaction: CommandInteraction,
    private profileStore: UserProfileStore
  ) {
    super(interaction);
  }

  private async getUserProfileRecord(guild: string, user: User) {
    const record = await this.profileStore.get(guild, user.id);
    if (!record) {
      throw new NoProfileRecordError();
    }
    if (record.profiles.every((p) => isNil(p))) {
      throw new NoValidProfileError();
    }
    return record;
  }

  private async parseOptions(): Promise<ListProfileOptions> {
    let user = this.interaction.options.getUser("user");
    if (user == null) {
      user = this.interaction.user;
    }

    return { user };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("list profile");
    const options = await this.parseOptions();

    const { user: targetUser } = options;
    const { guild } = this.interaction;
    this.l.debug(
      { options: { user: logUser(targetUser) } },
      "list profile options"
    );

    const record = await this.getUserProfileRecord(guild.id, targetUser);

    this.l.info("profile listed");
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
