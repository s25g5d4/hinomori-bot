import { formatUserProfileRecord } from "../../../models/user-profile";
import { CommandInteraction, User } from "discord.js";
import { UserProfileStore } from "../../../store/user-profiles";
import { logger } from "../../../logger";
import { logUser } from "../../../utils/log-user";
import { InteractiveCommand } from "../../interactive-command";
import { isNil } from "lodash";
import {
  EmptyIndexError,
  EmptyProfileError,
  IndexNotANumberError,
  IndexOutOfRangeError,
  NoProfileRecordError,
} from "./remove-errors";
import { CatchExecuteError } from "../../catch-execute-error";

interface RemoveProfileOptions {
  index: number;
}

export class RemoveProfile extends InteractiveCommand {
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

  private async parseOptions(): Promise<RemoveProfileOptions> {
    const index = this.interaction.options.getNumber("index");
    if (isNil(index)) {
      throw new EmptyIndexError();
    }
    if (typeof index !== "number" || isNaN(index)) {
      throw new IndexNotANumberError();
    }
    if (index < 1 || index > 10) {
      throw new IndexOutOfRangeError();
    }

    return { index };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    logger.debug("remove profile");
    const options = await this.parseOptions();

    const { index } = options;
    const { user } = this.interaction;
    logger.debug(
      { options: { index }, user: logUser(user) },
      "remove profile options"
    );

    const record = await this.getUserProfileRecord(user);
    const i = index - 1;
    const profile = record.profiles[i];
    if (isNil(profile)) {
      throw new EmptyProfileError();
    }

    const newProfiles = [...record.profiles];
    newProfiles[i] = null;
    const newRecord: typeof record = { ...record, profiles: newProfiles };
    await this.profileStore.set(user.id, newRecord);

    logger.info({ user: logUser(user) }, "profile removed");
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
