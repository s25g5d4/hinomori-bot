import { FirebaseDB } from './db';
import { UserProfileRecord } from "../models/user-profile";

export class UserProfileStore {
  private readonly collectionName = 'user-profiles';
  private collection: ReturnType<typeof this.db.db.collection>;

  constructor(private db: FirebaseDB) {}

  async init(): Promise<void> {
    this.collection = this.db.db.collection(this.collectionName);
    return;
  }

  async get(user: string): Promise<UserProfileRecord | null> {
    const doc = await this.collection.doc(user).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as UserProfileRecord;
  }

  async has(user: string): Promise<boolean> {
    const doc = await this.collection.doc(user).get();
    return doc.exists;
  }

  async set(user: string, record: UserProfileRecord): Promise<void> {
    await this.collection.doc(user).set(record);
  }
}
