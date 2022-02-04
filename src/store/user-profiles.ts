import { UserProfileRecord } from "../models/user-profile";

/** example record
export const userProfileRecords = new Map<string, UserProfileRecord>([
    [
        "exampleUser",
        {
        profiles: [
            { type: "r", ratio: 4.67, power: 230541 },
            ...Array(9).fill(null),
        ],
        active: 0,
        },
    ],
]);
*/

export class UserProfileStore {
  private records = new Map<string, UserProfileRecord>();

  async get(user: string): Promise<UserProfileRecord | null> {
    return this.records.get(user);
  }

  async has(user: string): Promise<boolean> {
    return this.records.has(user);
  }

  async set(user: string, record: UserProfileRecord): Promise<void> {
    this.records.set(user, record);
  }

  async size(): Promise<number> {
    return this.records.size;
  }
}
