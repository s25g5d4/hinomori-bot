import { UserProfileRecord } from "../models/user-profile";
import { logger } from "../logger";
import { FirebaseDB } from "./db";

export class UserProfileStore {
  private readonly guildCollectionName = "guilds";
  private readonly profilesCollectionName = "user-profiles";

  constructor(private db: FirebaseDB) {}

  async init(): Promise<void> {
    // noop
  }

  private userProfileDoc(guild: string, user: string) {
    return this.db.db
      .collection(this.guildCollectionName)
      .doc(guild)
      .collection(this.profilesCollectionName)
      .doc(user);
  }

  async get(guild: string, user: string): Promise<UserProfileRecord | null> {
    logger.debug({ user }, "get user-profiles record");
    const doc = await this.userProfileDoc(guild, user).get();
    if (!doc.exists) {
      logger.info({ user }, "user-profiles record not found");
      return null;
    }
    logger.info({ user }, "user-profiles record retrieved");
    return doc.data() as UserProfileRecord;
  }

  async set(
    guild: string,
    user: string,
    record: UserProfileRecord,
  ): Promise<void> {
    logger.debug({ user }, "update user-profiles record");
    await this.userProfileDoc(guild, user).set(record);
    logger.info({ user }, "user-profiles record updated");
  }
}
