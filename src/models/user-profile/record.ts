import { formatUserProfileWithIndex, UserProfile } from "./profile";

export interface UserProfileRecord {
  profiles: UserProfile[];
  active: number;
}

export function formatUserProfileRecord(record: UserProfileRecord) {
  const profileLines = record.profiles
    .map((p, i) => p && formatUserProfileWithIndex(p, i))
    .filter((p) => !!p);

  return [`使用中的編組: ${record.active + 1}`, ...profileLines].join("\n");
}
