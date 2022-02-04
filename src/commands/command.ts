import { CommandInteraction } from "discord.js";

export interface Command {
  executeCommand(interaction: CommandInteraction): Promise<void>;
}
