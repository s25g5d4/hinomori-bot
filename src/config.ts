import "dotenv/config";

export const config = {
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
  defaultProfileRatioVersion: process.env.DEFAULT_PROFILE_RATIO_VERSION ?? "V1",
  twProfileRatioVersion: process.env.TW_PROFILE_RATIO_VERSION ?? "V1",
  jpProfileRatioVersion: process.env.JP_PROFILE_RATIO_VERSION ?? "V2",
  app: process.env.APP_NAME ?? "Hinomori",
  logLevel: process.env.LOG_LEVEL ?? "debug",
  minProfilePower: process.env.MIN_PROFILE_POWER ?? "10000",
  maxProfilePower: process.env.MAX_PROFILE_POWER ?? "500000",
};
