import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import {
  jpVersion,
  ProfileRatioVersion,
  ProfileRatioVersionName,
  twVersion,
} from "src/models/profile-ratio";
import { CatchExecuteError } from "src/commands/catch-execute-error";
import { InteractiveCommand } from "src/commands/interactive-command";

export class RatioServerVersion extends InteractiveCommand {
  private readonly ratioVer = ProfileRatioVersion.V1;

  constructor(private l: Logger, interaction: CommandInteraction) {
    super(interaction);
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("server version");
    await this.interaction.reply(
      `
台服倍率計算公式版本：${ProfileRatioVersionName[twVersion]}。
日服倍率計算公式版本：${ProfileRatioVersionName[jpVersion]}。
    `.trim()
    );
  }
}
