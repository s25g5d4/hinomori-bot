import { CommandInteraction, User } from "discord.js";
import { isNil } from "lodash";
import { Logger } from "pino";
import { formatUserProfile } from "src/models/user-profile";
import { UserProfileStore } from "src/store/user-profiles";
import { defaultVersion } from "src/models/profile-ratio";
import { InteractiveCommand, NullOptionError } from "../../interactive-command";
import { CatchExecuteError } from "../../catch-execute-error";
import {
  EmptyIndexError,
  EmptyProfileError,
  IndexNotANumberError,
  IndexOutOfRangeError,
  NoProfileRecordError,
} from "./activate-errors";

interface ActivateProfileOptions {
  index: number;
}

export class ActivateProfile extends InteractiveCommand {
  constructor(
    private l: Logger,
    interaction: CommandInteraction,
    private profileStore: UserProfileStore,
  ) {
    super(interaction);
  }

  private async getUserProfileRecord(guild: string, user: User) {
    const record = await this.profileStore.get(guild, user.id);
    if (!record) {
      throw new NoProfileRecordError();
    }
    return record;
  }

  private async parseOptions(): Promise<ActivateProfileOptions> {
    const options: ActivateProfileOptions = {
      index: null,
    };
    try {
      options.index = this.getNumberOption("index");
    } catch (err) {
      if (err instanceof NullOptionError) {
        throw new EmptyIndexError();
      }
      throw new IndexNotANumberError();
    }
    if (isNaN(options.index)) {
      throw new IndexNotANumberError();
    }
    if (
      options.index < 1 ||
      options.index > 10 ||
      !Number.isInteger(options.index)
    ) {
      throw new IndexOutOfRangeError();
    }

    return options;
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("activate profile");
    const options = await this.parseOptions();

    const { index } = options;
    const { user, guild } = this.interaction;
    this.l.debug({ options: { index } }, "activate profile options");

    const record = await this.getUserProfileRecord(guild.id, user);
    const i = index - 1;
    const profile = record.profiles[i];
    if (isNil(profile)) {
      throw new EmptyProfileError();
    }

    const newRecord: typeof record = { ...record, active: i };
    await this.profileStore.set(guild.id, user.id, newRecord);

    this.l.info("profile activated");
    await this.interaction.reply(
      [
        `已更新使用中編組編號。使用中編組：`,
        "```",
        `${index}: ${formatUserProfile(profile, defaultVersion)}`,
        "```",
      ].join("\n"),
    );
  }
}
