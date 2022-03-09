import { FirebaseDB } from "./store/db";
import { config } from "./config";
import { logger } from "./logger";
import { Commander } from "./commander/commander";
import { Server } from "./server";
import { UserProfileStore } from "./store/user-profiles";

async function main() {
  logger.debug(`starting ${config.app}`);

  const db = new FirebaseDB();
  const profileStore = new UserProfileStore(db);
  const commander = new Commander(profileStore);
  const server = new Server(commander);

  await db.init();
  await profileStore.init();
  await server.init();
  logger.info(`${config.app} started`);
}

main();

/**
/profile update type:跑者 power:232477 cards:130,115,110,110,110
/profile update type:幫手 power:261020 cards:130,115,110,100,100 index:2
*/
