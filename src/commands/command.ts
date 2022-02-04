import { Interaction } from "discord.js";

export interface Command {
  executeCommand(interaction: Interaction): Promise<void>;
}
