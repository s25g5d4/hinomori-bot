import { formatUserProfile } from "../../../models/user-profile";
import { CommandInteraction, User } from "discord.js";
import { UserProfileStore } from "../../../store/user-profiles";
import { logger } from "../../../logger";
import { logUser } from "../../../utils/log-user";
import { InteractiveCommand } from "../../interactive-command";
import { CatchExecuteError } from "../../catch-execute-error";
import { isNil } from "lodash";
import {
  EmptyIndexError,
  EmptyProfileError,
  IndexNotANumberError,
  IndexOutOfRangeError,
  NoProfileRecordError,
} from "./activate-errors";

const errParseOptions = new Error("failed to parse options");

interface ActivateProfileOptions {
  index: number;
}

export class ActivateProfile extends InteractiveCommand {
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
    return record;
  }

  private async parseOptions(): Promise<ActivateProfileOptions> {
    const index = this.interaction.options.getNumber("index");
    if (isNil(index)) {
      throw new EmptyIndexError();
    }
    if (typeof index !== "number" || isNaN(index)) {
      throw new IndexNotANumberError();
    }
    if (index < 1 || index > 10 || !Number.isInteger(index)) {
      throw new IndexOutOfRangeError();
    }

    return { index };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    logger.debug("activate profile");
    const options = await this.parseOptions();

    const { index } = options;
    const { user } = this.interaction;
    logger.debug(
      { options: { index }, user: logUser(user) },
      "activate profile options"
    );

    const record = await this.getUserProfileRecord(user);
    const i = index - 1;
    const profile = record.profiles[i];
    if (isNil(profile)) {
      throw new EmptyProfileError();
    }

    const newRecord: typeof record = { ...record, active: i };
    await this.profileStore.set(user.id, newRecord);

    logger.info({ user: user.id }, "profile activated");
    await this.interaction.reply(
      [
        `已更新使用中編組編號。使用中編組：`,
        "```",
        `${index}: ${formatUserProfile(profile)}`,
        "```",
      ].join("\n")
    );
  }
}
