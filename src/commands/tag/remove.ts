import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import { InteractiveCommand } from "src/commands/interactive-command";
import { CatchExecuteError } from "src/commands/catch-execute-error";
import { TagNotFoundError, TagStore, UserNotMatchError } from "src/store/tags";
import { EmptyNameError, ForbiddenError } from "./remove-errors";

interface RemoveTagOptions {
  name: string;
}

export class RemoveTag extends InteractiveCommand {
  constructor(
    private l: Logger,
    interaction: CommandInteraction,
    private tagStore: TagStore
  ) {
    super(interaction);
  }

  private async parseOptions(): Promise<RemoveTagOptions> {
    const name = this.interaction.options.getString("name");
    if (!name) {
      throw new EmptyNameError();
    }
    return { name };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("remove tag");

    const options = await this.parseOptions();
    const { name } = options;
    const { user, guild } = this.interaction;
    this.l.debug({ options: { name } }, "remove tag options");

    try {
      await this.tagStore.remove(guild.id, user.id, name);
    } catch (err) {
      if (err instanceof UserNotMatchError || err instanceof TagNotFoundError) {
        throw new ForbiddenError();
      }
      throw err;
    }

    this.l.info("tag removed");
    await this.interaction.reply({
      content: `已成功刪除 tag ${name}。`,
      allowedMentions: { users: [] },
    });
  }
}
