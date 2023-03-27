import { SlashCommandBuilder } from "@discordjs/builders";

export const tagCommands = [
  new SlashCommandBuilder()
    .setName("tag")
    .setDescription("取得 tag")
    .addStringOption((option) =>
      option.setName("name").setDescription("tag 名稱").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("tag-create")
    .setDescription("建立 tag")
    .addStringOption((option) =>
      option.setName("name").setDescription("tag 名稱").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("value").setDescription("tag 內容").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("tag-update")
    .setDescription("更新 tag")
    .addStringOption((option) =>
      option.setName("name").setDescription("tag 名稱").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("value").setDescription("tag 內容").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("tag-remove")
    .setDescription("刪除 tag")
    .addStringOption((option) =>
      option.setName("name").setDescription("tag 名稱").setRequired(true)
    ),
].map((command) => command.toJSON());
