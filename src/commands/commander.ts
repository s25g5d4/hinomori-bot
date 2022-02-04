import { Interaction, CommandInteraction } from "discord.js";
import { CommandFactory } from "./factory";
import { UserProfileStore } from "./../store/user-profiles";
import { Command } from "./command";

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

    const cmd = this.dispatch(interaction);
    if (cmd == null) {
      await interaction.reply("command unimplemented");
      return;
    }

    await cmd.executeCommand(interaction);
  }
}
