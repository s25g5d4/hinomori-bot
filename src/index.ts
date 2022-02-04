import { UpdateProfile } from "./commands/profile/update";
import { UserProfileStore } from "./store/user-profiles";
// Require the necessary discord.js classes
import { Client, Intents, Interaction } from "discord.js";
import { config } from "./config";

class Server {
  constructor(private profileStore: UserProfileStore) {}

  init(): Promise<void> {
    return new Promise((ok) => {
      // Create a new client instance
      const client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      });

      // When the client is ready, run this code (only once)
      client.once("ready", () => {
        console.log("Ready!");
        ok();
      });

      client.on("interactionCreate", (interaction) =>
        this.executeCommand(interaction)
      );

      // Login to Discord with your client's token
      client.login(config.token);
    });
  }

  private async executeCommand(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const subcommand = interaction.options.getSubcommand();

    if (commandName === "ping") {
      await interaction.reply("Pong!");
    } else if (commandName === "profile") {
      if (subcommand === "update") {
        const cmd = new UpdateProfile(this.profileStore, interaction);
        return await cmd.executeCommand();
      }
      return await interaction.reply("unimplemented");
    }
  }
}

async function main() {
  const profileStore = new UserProfileStore();
  const server = new Server(profileStore);
  await server.init();
}

main();

/**
/update_profile type:r power:232477 card1:130 card2:115 card3:110 card4:110 card5:110
/update_profile type:r power:261020 card1:130 card2:115 card3:110 card4:100 card5:100 index:2
*/
