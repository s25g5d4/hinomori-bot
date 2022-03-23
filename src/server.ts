import { Client, Intents } from "discord.js";
import { logger } from "./logger";
import { Commander } from "./commander/commander";
import { config } from "./config";

export class Server {
  constructor(private commander: Commander) {}

  init(): Promise<void> {
    return new Promise((ok) => {
      const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      });

      client.once("ready", () => {
        logger.info("connected to discord");
        ok();
      });

      client.on("interactionCreate", (interaction) => {
        const { type, channelId, guildId, user } = interaction;
        logger.info(
          { interaction: { type, channelId, guildId, user: user.id } },
          "interaction received"
        );
        this.commander.execute(interaction);
      });

      logger.debug("connecting to discord");
      client.login(config.token);
    });
  }
}
