import { isNil } from "lodash";
import { ProfileRatioVersion } from "../profile-ratio";
import { formatUserProfile, UserProfile } from "./profile";

export interface UserProfileRecord {
  profiles: UserProfile[];
  active: number;
}

function addProfilePrefix(profile: string, i: number, active: number): string {
  const displayIndex = (i + 1).toString();
  const activeSign = i === active ? "*" : "";
  const prefix = `${activeSign}${displayIndex}: `.padStart(5, " ");
  return prefix + profile;
}

export function formatUserProfileRecord(
  record: UserProfileRecord,
  ratioVer: ProfileRatioVersion
) {
  const profileLines = record.profiles
    .map((p) => p && formatUserProfile(p, ratioVer))
    .map((p, i) => p && addProfilePrefix(p, i, record.active))
    .filter((p) => !!p);

  return [`使用中的編組: *${record.active + 1}`, ...profileLines].join("\n");
}

export function isEmptyRecord(record: UserProfileRecord): boolean {
  return record.profiles.every((p) => isNil(p));
}
