import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config } from "./config";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("profile")
    .setDescription("卡片編組指令")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("更新編組")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("跑者 (runner) 或幫手 (helper)")
            .setRequired(true)
            .setChoices([
              ["跑者", "r"],
              ["幫手", "h"],
            ])
        )
        .addNumberOption((option) =>
          option
            .setName("power")
            .setDescription("綜合力")
            .setRequired(true)
            .setMinValue(0)
        )
        .addStringOption((option) =>
          option
            .setName("cards")
            .setDescription("卡片倍率(以 , 分開，範例：130,110,110,100,100)")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("index")
            .setDescription("設定檔編號 (1~10，預設為 1)")
            .setMinValue(1)
            .setMaxValue(10)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("顯示所有編組")
        .addUserOption((option) =>
          option.setName("user").setDescription("要顯示的使用者 (預設為自己)")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("activate")
        .setDescription("設定使用中編組")
        .addNumberOption((option) =>
          option
            .setName("index")
            .setDescription("設定檔編號 (1~10)")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("刪除編組")
        .addNumberOption((option) =>
          option
            .setName("index")
            .setDescription("設定檔編號 (1~10)")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)
        )
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(config.token);

rest
  .put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
