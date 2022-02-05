import { formatUserProfileWithIndex, UserProfile } from "./profile";

export interface UserProfileRecord {
  profiles: UserProfile[];
  active: number;
}

function activeProfilePrefix(p: string, i: number, active: number): string {
  if (i === active) {
    return "*" + p;
  }
  return " " + p;
}

export function formatUserProfileRecord(record: UserProfileRecord) {
  const profileLines = record.profiles
    .map((p, i) => p && formatUserProfileWithIndex(p, i))
    .map((p, i) => p && activeProfilePrefix(p, i, record.active))
    .filter((p) => !!p);

  return [`使用中的編組: *${record.active + 1}`, ...profileLines].join("\n");
}
