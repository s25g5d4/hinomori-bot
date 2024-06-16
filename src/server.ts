import { Client, GatewayIntentBits } from "discord.js";
import { logger } from "./logger";
import { Commander } from "./commander/commander";
import { config } from "./config";
import { logInteraction } from "./utils/log-interaction";

export class Server {
  constructor(private commander: Commander) {}

  init(): Promise<void> {
    return new Promise((ok) => {
      const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
      });

      client.once("ready", () => {
        logger.info("connected to discord");
        ok();
      });

      client.on("interactionCreate", (interaction) => {
        logger.info(
          { interaction: logInteraction(interaction, true) },
          "interaction received",
        );
        this.commander.execute(interaction);
      });

      logger.debug("connecting to discord");
      client.login(config.token);
    });
  }
}
