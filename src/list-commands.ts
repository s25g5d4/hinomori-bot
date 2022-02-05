import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "./config";

const rest = new REST({ version: "9" }).setToken(config.token);

rest
  .get(Routes.applicationGuildCommands(config.clientId, config.guildId))
  .then(console.log)
  .catch(console.error);
