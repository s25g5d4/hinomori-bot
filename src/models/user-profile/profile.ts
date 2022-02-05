import { formatUserProfileType, UserProfileType } from "./type";

export interface UserProfile {
  type: UserProfileType;
  ratio: number;
  power: number;
}

export function formatUserProfile(profile: UserProfile): string {
  const type = formatUserProfileType(profile.type);
  const power = profile.power.toString().padStart(6, " ");
  const ratio = Math.round(profile.ratio * 100) / 100;
  return `${type} 綜合力: ${power} 倍率: ${ratio}`;
}

export function formatUserProfileWithIndex(
  profile: UserProfile,
  index: number
): string {
  const displayIndex = index + 1;
  const indexString = displayIndex.toString().padStart(2, " ");
  return `${indexString}: ${formatUserProfile(profile)}`;
}
