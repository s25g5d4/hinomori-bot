import { Interaction, ChatInputCommandInteraction } from "discord.js";
import { isNil } from "lodash";
import { logInteraction } from "src/utils/log-interaction";
import { TagStore } from "src/store/tags";
import { logger } from "../logger";
import { UserProfileStore } from "../store/user-profiles";
import { Command } from "../commands/command";
import { CommandFactory } from "./command-factory";

export class Commander {
  private factory: CommandFactory;

  constructor(profileStore: UserProfileStore, tagStore: TagStore) {
    this.factory = new CommandFactory(profileStore, tagStore);
  }

  private dispatch(interaction: ChatInputCommandInteraction): Command {
    const { commandName } = interaction;

    switch (commandName) {
      case "profile":
        return this.dispatchProfileCommand(interaction);
      case "ratio":
        return this.dispatchRatioCommand(interaction);
      case "arrange":
        return this.factory.newArrangePlayers(interaction);
      case "arrange_ahead":
        return this.factory.newArrangePlayers(interaction, false);
      case "ratio-tw":
        return this.factory.newRatioTW(interaction);
      case "tag":
        return this.factory.newTagGet(interaction);
      case "tag-create":
        return this.factory.newTagCreate(interaction);
      case "tag-update":
        return this.factory.newTagUpdate(interaction);
      case "tag-remove":
        return this.factory.newTagRemove(interaction);
    }

    return null;
  }

  private dispatchProfileCommand(
    interaction: ChatInputCommandInteraction,
  ): Command {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "update":
        return this.factory.newUpdateProfile(interaction);
      case "list":
        return this.factory.newListProfile(interaction);
      case "activate":
        return this.factory.newActivateProfile(interaction);
      case "remove":
        return this.factory.newRemoveProfile(interaction);
      case "25-miku":
        return this.factory.new25MikuProfile(interaction);
    }

    return null;
  }

  private dispatchRatioCommand(
    interaction: ChatInputCommandInteraction,
  ): Command {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "tw":
        return this.factory.newRatioTW(interaction);
      case "jp":
        return this.factory.newRatioJP(interaction);
      case "v1":
        return this.factory.newRatioV1(interaction);
      case "v2":
        return this.factory.newRatioV2(interaction);
      case "server-version":
        return this.factory.newRatioServerVersion(interaction);
    }

    return null;
  }

  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const l = logger.child({ interaction: logInteraction(interaction) });

    l.debug({ command: interaction.toString() }, "dispatching command");
    const cmd = this.dispatch(interaction);
    if (isNil(cmd)) {
      l.warn({ command: interaction.toString() }, "unrecognized command");
      await interaction.reply("未知的指令");
      return;
    }

    l.debug("executing command");
    try {
      await cmd.executeCommand();
    } catch (error) {
      l.error({ err: error }, "failed to execute command");
    }
    l.debug("executed command");
  }
}
