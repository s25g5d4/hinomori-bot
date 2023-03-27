import { CommandInteraction } from "discord.js";
import { sample } from "lodash";
import { Logger } from "pino";
import { InteractiveCommand } from "src/commands/interactive-command";
import { CatchExecuteError } from "src/commands/catch-execute-error";
import { TagStore } from "src/store/tags";
import { Tag } from "src/models/tag";
import { NoTagError } from "./get-errors";

interface GetTagOptions {
  name: string;
}

export class GetTag extends InteractiveCommand {
  constructor(
    private l: Logger,
    interaction: CommandInteraction,
    private tagStore: TagStore
  ) {
    super(interaction);
  }

  private async getTag(guild: string, name: string): Promise<Tag> {
    const tag = await this.tagStore.get(guild, name);
    if (!tag) {
      throw new NoTagError();
    }
    return tag;
  }

  private async parseOptions(): Promise<GetTagOptions> {
    const name = this.interaction.options.getString("name");
    return { name };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("get tag");
    const options = await this.parseOptions();

    const { name } = options;
    const { guild } = this.interaction;
    this.l.debug({ options: { name } }, "get tag options");

    const tag = await this.getTag(guild.id, name);
    this.l.info("tag retrieved");
    await this.interaction.reply({
      content: [
        sample(tag.values),
        "",
        `\`由 ${this.interaction.user.tag} 呼叫\``,
      ].join("\n"),
      allowedMentions: { users: [] },
    });
  }
}
