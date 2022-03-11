import { formatUserProfileRecord } from "../../../models/user-profile";
import { CommandInteraction, User } from "discord.js";
import { UserProfileStore } from "../../../store/user-profiles";
import { logger } from "../../../logger";
import { logUser } from "../../../utils/log-user";
import { InteractiveCommand } from "../../interactive-command";
import { CatchExecuteError } from "../../catch-execute-error";
import { NoProfileRecordError, NoValidProfileError } from "./list-errors";
import { isNil } from "lodash";

interface ListProfileOptions {
  user: User;
}

export class ListProfile extends InteractiveCommand {
  constructor(
    interaction: CommandInteraction,
    private profileStore: UserProfileStore
  ) {
    super(interaction);
  }

  private async getUserProfileRecord(user: User) {
    const record = await this.profileStore.get(user.id);
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
    logger.debug("list profile");
    const options = await this.parseOptions();

    const { user: targetUser } = options;
    const { user } = this.interaction;
    logger.debug(
      { options: { user: logUser(targetUser) }, user: logUser(user) },
      "list profile options"
    );

    const record = await this.getUserProfileRecord(targetUser);

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
