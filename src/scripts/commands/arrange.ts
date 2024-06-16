import { SlashCommandBuilder } from "@discordjs/builders";

export const arrangeCommands = [
  new SlashCommandBuilder()
    .setName("arrange")
    .setDescription("協力 LIVE 推車排位")
    .addUserOption((option) =>
      option.setName("player1").setDescription("玩家 1"),
    )
    .addUserOption((option) =>
      option.setName("player2").setDescription("玩家 2"),
    )
    .addUserOption((option) =>
      option.setName("player3").setDescription("玩家 3"),
    )
    .addUserOption((option) =>
      option.setName("player4").setDescription("玩家 4"),
    )
    .addUserOption((option) =>
      option.setName("player5").setDescription("玩家 5"),
    ),
  new SlashCommandBuilder()
    .setName("arrange_ahead")
    .setDescription("預先排位協力 LIVE 推車 (不會通知被 tag 到的人)")
    .addUserOption((option) =>
      option.setName("player1").setDescription("玩家 1"),
    )
    .addUserOption((option) =>
      option.setName("player2").setDescription("玩家 2"),
    )
    .addUserOption((option) =>
      option.setName("player3").setDescription("玩家 3"),
    )
    .addUserOption((option) =>
      option.setName("player4").setDescription("玩家 4"),
    )
    .addUserOption((option) =>
      option.setName("player5").setDescription("玩家 5"),
    ),
].map((command) => command.toJSON());
