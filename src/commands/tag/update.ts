import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import { InteractiveCommand } from "src/commands/interactive-command";
import { CatchExecuteError } from "src/commands/catch-execute-error";
import { TagStore, UserNotMatchError } from "src/store/tags";
import { Tag } from "src/models/tag";
import {
  EmptyNameError,
  EmptyValueError,
  ForbiddenError,
} from "./update-errors";
import { splitValue } from "./value-parse";

interface UpdateTagOptions {
  name: string;
  values: string[];
}

export class UpdateTag extends InteractiveCommand {
  constructor(
    private l: Logger,
    interaction: CommandInteraction,
    private tagStore: TagStore,
  ) {
    super(interaction);
  }

  private async parseOptions(): Promise<UpdateTagOptions> {
    const options: UpdateTagOptions = {
      name: null,
      values: null,
    };
    try {
      options.name = this.getStringOption("name");
    } catch (err) {
      throw new EmptyNameError();
    }

    try {
      const value = this.getStringOption("value");
      options.values = splitValue(value);
    } catch (err) {
      throw new EmptyValueError();
    }

    return options;
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("update tag");

    const options = await this.parseOptions();
    const { name, values } = options;
    const { user, guild } = this.interaction;
    this.l.debug({ options: { name, values } }, "update tag options");

    const newTag: Tag = { name, values, user: user.id };

    try {
      await this.tagStore.update(guild.id, newTag);
    } catch (err) {
      if (err instanceof UserNotMatchError) {
        throw new ForbiddenError();
      }
    }

    this.l.info("tag updated");
    await this.interaction.reply({
      content: `已成功更新 tag ${name}。`,
      allowedMentions: { users: [] },
    });
  }
}
