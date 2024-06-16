import { CommandInteraction, User } from "discord.js";
import { isNil } from "lodash";
import { Logger } from "pino";
import { UserProfileType } from "src/models/user-profile";
import { UserProfileStore } from "src/store/user-profiles";
import { InteractiveCommand, NullOptionError } from "../../interactive-command";
import { CatchExecuteError } from "../../catch-execute-error";
import {
  EmptyIndexError,
  EmptyNickNameError,
  EmptyProfileError,
  IndexNotANumberError,
  IndexOutOfRangeError,
  InvalidNickNameError,
  NoProfileRecordError,
} from "./25-miku-errors";

function convertTo25MikuProfileType(type: UserProfileType): string {
  switch (type) {
    case UserProfileType.Runner:
      return "r";
    case UserProfileType.Helper:
      return "h";
    default:
      throw new Error("unknown type");
  }
}

interface NiGoMikuProfileOptions {
  nickname: string;
  index: number;
}

export class NiGoMikuProfile extends InteractiveCommand {
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

  private async parseOptions(): Promise<NiGoMikuProfileOptions> {
    const options: NiGoMikuProfileOptions = { nickname: null, index: null };
    try {
      options.nickname = this.getStringOption("nickname");
    } catch (err) {
      if (err instanceof NullOptionError) {
        throw new EmptyNickNameError();
      }
      throw new InvalidNickNameError();
    }
    if (options.nickname === "") {
      throw new EmptyNickNameError();
    }

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
    this.l.debug("Generate 25 miku profile");
    const options = await this.parseOptions();

    const { nickname, index } = options;
    const { user, guild } = this.interaction;
    this.l.debug({ options: { index } }, "Generate 25 miku profile options");

    const record = await this.getUserProfileRecord(guild.id, user);
    const i = index - 1;
    const profile = record.profiles[i];
    if (isNil(profile)) {
      throw new EmptyProfileError();
    }

    const t = convertTo25MikuProfileType(profile.type);
    const p = (profile.power / 10000).toFixed(2);
    const s = profile.cards.join(" ");
    const niGoMikuProfile = `&b rtw ${nickname} ${t} ${p} ${s}`;
    this.l.info("25 miku profile generated");
    await this.interaction.reply(niGoMikuProfile);
  }
}
