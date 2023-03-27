import { FirebaseDB } from "./store/db";
import { config } from "./config";
import { logger } from "./logger";
import { Commander } from "./commander/commander";
import { Server } from "./server";
import { UserProfileStore } from "./store/user-profiles";
import { TagStore } from "./store/tags";

async function main() {
  logger.debug(`starting ${config.app}`);

  const db = new FirebaseDB();
  const profileStore = new UserProfileStore(db);
  const tagStore = new TagStore(db);
  const commander = new Commander(profileStore, tagStore);
  const server = new Server(commander);

  await db.init();
  await profileStore.init();
  await server.init();
  logger.info(`${config.app} started`);
}

main();
