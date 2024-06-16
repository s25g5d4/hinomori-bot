import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "../config";
import { commands } from "./commands";

const rest = new REST({ version: "9" }).setToken(config.token);

rest
  .put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
    body: commands,
  })
  .then(() =>
    console.log("Successfully registered application guild commands."),
  )
  .catch(console.error);
