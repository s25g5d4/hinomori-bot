import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "./config";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("update_profile")
    .setDescription("update profile")
    .addStringOption((option) =>
      option.setName("type").setDescription("Runner or helper")
    )
    .addNumberOption((option) =>
      option.setName("card1").setDescription("Card 1 ratio")
    )
    .addNumberOption((option) =>
      option.setName("card2").setDescription("Card 2 ratio")
    )
    .addNumberOption((option) =>
      option.setName("card3").setDescription("Card 3 ratio")
    )
    .addNumberOption((option) =>
      option.setName("card4").setDescription("Card 4 ratio")
    )
    .addNumberOption((option) =>
      option.setName("card5").setDescription("Card 5 ratio")
    )
    .addNumberOption((option) =>
      option.setName("power").setDescription("overall power")
    )
    .addNumberOption((option) =>
      option.setName("index").setDescription("profile index (from 1 to 10)")
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(config.token);

rest
  .put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
