import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "../config";
import { commands } from "./commands";

const rest = new REST({ version: "9" }).setToken(config.token);

rest
  .put(Routes.applicationCommands(config.clientId), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
