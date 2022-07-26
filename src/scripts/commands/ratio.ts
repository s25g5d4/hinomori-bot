import { SlashCommandBuilder } from "@discordjs/builders";

export const ratioCommands = [
  new SlashCommandBuilder()
    .setName("ratio-tw")
    .setDescription("計算台服卡片倍率")
    .addStringOption((option) =>
      option
        .setName("cards")
        .setDescription("卡片倍率 (以 , 或空格分開，範例：130,110,110,100,100)")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("ratio")
    .setDescription("倍率計算指令")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("tw")
        .setDescription("計算台服卡片倍率")
        .addStringOption((option) =>
          option
            .setName("cards")
            .setDescription(
              "卡片倍率 (以 , 或空格分開，範例：130,110,110,100,100)"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("jp")
        .setDescription("計算日服卡片倍率")
        .addStringOption((option) =>
          option
            .setName("cards")
            .setDescription(
              "卡片倍率 (以 , 或空格分開，範例：130,110,110,100,100)"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("v1")
        .setDescription("使用 v1 版計算卡片倍率")
        .addStringOption((option) =>
          option
            .setName("cards")
            .setDescription(
              "卡片倍率 (以 , 或空格分開，範例：130,110,110,100,100)"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("v2")
        .setDescription("使用 v2 版計算台服卡片倍率")
        .addStringOption((option) =>
          option
            .setName("cards")
            .setDescription(
              "卡片倍率 (以 , 或空格分開，範例：130,110,110,100,100)"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server-version")
        .setDescription("各服倍率計算公式版本")
    ),
].map((command) => command.toJSON());
