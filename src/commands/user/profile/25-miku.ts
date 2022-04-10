import { CommandInteraction, User } from "discord.js";
import { isNil } from "lodash";
import { Logger } from "pino";
import { UserProfileType } from "src/models/user-profile";
import { UserProfileStore } from "src/store/user-profiles";
import { InteractiveCommand } from "../../interactive-command";
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
    private profileStore: UserProfileStore
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
    const nickname = this.interaction.options.getString("nickname");
    if (isNil(nickname) || nickname === "") {
      throw new EmptyNickNameError();
    }
    if (typeof nickname !== "string") {
      throw new InvalidNickNameError();
    }

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

    return { nickname, index };
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
    await this.interaction.reply(
      ["白蔥指令：", "`" + niGoMikuProfile + "`"].join("\n")
    );
  }
}
