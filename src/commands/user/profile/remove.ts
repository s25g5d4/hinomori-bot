import { CommandInteraction, User } from "discord.js";
import { isNil } from "lodash";
import { Logger } from "pino";
import {
  formatUserProfileRecord,
  isEmptyRecord,
} from "src/models/user-profile";
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
} from "./remove-errors";

interface RemoveProfileOptions {
  index: number;
}

export class RemoveProfile extends InteractiveCommand {
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

  private async parseOptions(): Promise<RemoveProfileOptions> {
    const options: RemoveProfileOptions = {
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
    this.l.debug("remove profile");
    const options = await this.parseOptions();

    const { index } = options;
    const { user, guild } = this.interaction;
    this.l.debug({ options: { index } }, "remove profile options");

    const record = await this.getUserProfileRecord(guild.id, user);
    const i = index - 1;
    const profile = record.profiles[i];
    if (isNil(profile)) {
      throw new EmptyProfileError();
    }

    const newProfiles = [...record.profiles];
    newProfiles[i] = null;
    const newRecord: typeof record = { ...record, profiles: newProfiles };
    await this.profileStore.set(guild.id, user.id, newRecord);

    const reply = isEmptyRecord(newRecord)
      ? `已移除選擇的編組。你的編組資料是空的。`
      : `
已移除選擇的編組。你的編組資料：
\`\`\`
${formatUserProfileRecord(newRecord, defaultVersion)}
\`\`\`
`.trim();

    this.l.info("profile removed");
    await this.interaction.reply(reply);
  }
}
