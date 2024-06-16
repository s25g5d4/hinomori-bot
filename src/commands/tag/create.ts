import { CommandInteraction } from "discord.js";
import { Logger } from "pino";
import { InteractiveCommand } from "src/commands/interactive-command";
import { CatchExecuteError } from "src/commands/catch-execute-error";
import { TagAlreadyExistsError, TagStore } from "src/store/tags";
import { Tag } from "src/models/tag";
import {
  EmptyNameError,
  EmptyValueError,
  ForbiddenError,
} from "./create-errors";
import { splitValue } from "./value-parse";

interface CreateTagOptions {
  name: string;
  values: string[];
}

export class CreateTag extends InteractiveCommand {
  constructor(
    private l: Logger,
    interaction: CommandInteraction,
    private tagStore: TagStore,
  ) {
    super(interaction);
  }

  private async parseOptions(): Promise<CreateTagOptions> {
    const options: CreateTagOptions = {
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
    this.l.debug("create tag");

    const options = await this.parseOptions();
    const { name, values } = options;
    const { user, guild } = this.interaction;
    this.l.debug({ options: { name, values } }, "create tag options");

    const newTag: Tag = { name, values, user: user.id };

    try {
      await this.tagStore.create(guild.id, newTag);
    } catch (err) {
      if (err instanceof TagAlreadyExistsError) {
        throw new ForbiddenError();
      }
    }

    this.l.info("tag created");
    await this.interaction.reply({
      content: `已成功建立 tag ${name}。`,
      allowedMentions: { users: [] },
    });
  }
}
