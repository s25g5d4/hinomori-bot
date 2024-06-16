import {
  ApplicationCommandOptionType,
  CommandInteraction,
  User,
} from "discord.js";
import { isNil } from "lodash";
import { Command } from "./command";

export class InvalidTypeError extends Error {
  constructor() {
    super("invalid command option type");
  }
}

export class NullOptionError extends Error {
  constructor() {
    super("option is null");
  }
}

export abstract class InteractiveCommand implements Command {
  constructor(protected interaction: CommandInteraction) {}
  abstract executeCommand(): Promise<void>;
  getStringOption(name: string): string {
    const opt = this.interaction.options.get(name);
    if (isNil(opt)) {
      throw new NullOptionError();
    }
    if (
      opt.type !== ApplicationCommandOptionType.String ||
      typeof opt.value !== "string"
    ) {
      throw new InvalidTypeError();
    }

    return opt.value;
  }

  getNumberOption(name: string): number {
    const opt = this.interaction.options.get(name);
    if (isNil(opt)) {
      throw new NullOptionError();
    }
    if (
      opt.type !== ApplicationCommandOptionType.Number ||
      typeof opt.value !== "number"
    ) {
      throw new InvalidTypeError();
    }

    return opt.value;
  }

  getUserOption(name: string): User {
    const opt = this.interaction.options.get(name);
    if (isNil(opt)) {
      throw new NullOptionError();
    }

    if (opt.type !== ApplicationCommandOptionType.User) {
      throw new InvalidTypeError();
    }

    return opt.user;
  }
}
