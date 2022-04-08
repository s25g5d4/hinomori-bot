import { Interaction, CommandInteraction } from "discord.js";
import { logger } from "../logger";
import { UserProfileStore } from "../store/user-profiles";
import { Command } from "../commands/command";
import { CommandFactory } from "./command-factory";

export class Commander {
  private factory: CommandFactory;

  constructor(profileStore: UserProfileStore) {
    this.factory = new CommandFactory(profileStore);
  }

  private dispatch(interaction: CommandInteraction): Command {
    const { commandName } = interaction;

    switch (commandName) {
      case "profile":
        return this.dispatchProfileCommand(interaction);
      case "arrange":
        return this.factory.newArrangePlayers(interaction);
      case "arrange_ahead":
        return this.factory.newArrangePlayers(interaction, false);
    }

    return null;
  }

  private dispatchProfileCommand(interaction: CommandInteraction): Command {
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
    }

    return null;
  }

  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) {
      return;
    }

    logger.debug({ command: interaction.toString() }, "dispatching command");
    const cmd = this.dispatch(interaction);
    if (cmd == null) {
      logger.warn({ command: interaction.toString() }, "unrecognized command");
      await interaction.reply("未知的指令");
      return;
    }

    logger.debug("executing command");
    try {
      await cmd.executeCommand();
    } catch (error) {
      logger.error({ err: error }, "failed to execute command");
    }
    logger.debug("executed command");
  }
}
