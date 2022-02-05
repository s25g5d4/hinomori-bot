import { config } from "./config";
import { logger } from "./logger";
import { Commander } from "./commands/commander";
import { Server } from "./server";
import { UserProfileStore } from "./store/user-profiles";

async function main() {
  logger.debug(`starting ${config.app}`);

  const profileStore = new UserProfileStore();
  const commander = new Commander(profileStore);
  const server = new Server(commander);

  await profileStore.init();
  await server.init();
  logger.info(`${config.app} started`);
}

main();

/**
/profile update type:跑者 power:232477 cards:130,115,110,110,110
/profile update type:幫手 power:261020 cards:130,115,110,100,100 index:2
*/
