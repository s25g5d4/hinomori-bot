import { Client, Intents } from "discord.js";
import { Commander } from "./commands/commander";
import { config } from "./config";

export class Server {
  constructor(private commander: Commander) {}

  init(): Promise<void> {
    return new Promise((ok) => {
      const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      });

      client.once("ready", () => {
        console.log("Ready!");
        ok();
      });

      client.on("interactionCreate", (interaction) =>
        this.commander.execute(interaction)
      );

      client.login(config.token);
    });
  }
}
