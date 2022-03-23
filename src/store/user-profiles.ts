import { UserProfileRecord } from "../models/user-profile";
import { logger } from "../logger";
import { FirebaseDB } from "./db";

export class UserProfileStore {
  private readonly collectionName = "user-profiles";
  private collection: ReturnType<typeof this.db.db.collection>;

  constructor(private db: FirebaseDB) {}

  async init(): Promise<void> {
    logger.debug("initializing UserProfileStore");
    this.collection = this.db.db.collection(this.collectionName);
    logger.info("UserProfileStore initialized");
  }

  async get(user: string): Promise<UserProfileRecord | null> {
    logger.debug({ user }, "get user-profiles record");
    const doc = await this.collection.doc(user).get();
    if (!doc.exists) {
      logger.info({ user }, "user-profiles record not found");
      return null;
    }
    logger.info({ user }, "user-profiles record retrieved");
    return doc.data() as UserProfileRecord;
  }

  async set(user: string, record: UserProfileRecord): Promise<void> {
    logger.debug({ user }, "update user-profiles record");
    await this.collection.doc(user).set(record);
    logger.info({ user }, "user-profiles record updated");
  }
}
