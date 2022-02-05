import "dotenv/config";

export const config = {
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
  app: process.env.APP_NAME ?? "Hinomori",
  logLevel: process.env.LOG_LEVEL ?? "debug",
};
