import { UserProfile } from "../../src/models/user-profile";

type ProfileKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type ProfileCollection = { [k in ProfileKey]?: UserProfile };

export function genUserProfileRecord(
  profileCollection: ProfileCollection,
  active = 0
) {
  const profiles = Array(10)
    .fill(null)
    .map((e, i) => {
      const iStr = i.toString() as ProfileKey;
      if (Object.prototype.hasOwnProperty.call(profileCollection, iStr)) {
        return profileCollection[iStr];
      }
      return e;
    });
  return {
    profiles,
    active,
  };
}
