import { CommandInteraction } from "discord.js";
import { Command } from "./command";

export abstract class InteractiveCommand implements Command {
  constructor(protected interaction: CommandInteraction) {}
  abstract executeCommand(): Promise<void>;
}
