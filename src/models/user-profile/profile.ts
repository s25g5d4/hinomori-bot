import { profileRatioFunctions, ProfileRatioVersion } from "../profile-ratio";
import { formatUserProfileType, UserProfileType } from "./type";

export interface UserProfile {
  type: UserProfileType;
  cards: [number, number, number, number, number];
  power: number;
}

export function userProfileRatio(
  profile: UserProfile,
  ratioVer: ProfileRatioVersion,
): number {
  const ratioFn = profileRatioFunctions[ratioVer];
  return ratioFn(profile.cards);
}

export function formatUserProfile(
  profile: UserProfile,
  ratioVer: ProfileRatioVersion,
): string {
  const type = formatUserProfileType(profile.type);
  const power = profile.power.toString().padStart(6, " ");
  const ratio = Math.round(userProfileRatio(profile, ratioVer) * 100) / 100;
  return `${type} 綜合力: ${power} 倍率: ${ratio.toFixed(2)}`;
}
