import { formatUserProfileType, UserProfileType } from "./type";

export interface UserProfile {
  type: UserProfileType;
  ratio: number;
  power: number;
}

export function formatUserProfile(profile: UserProfile): string {
  const type = formatUserProfileType(profile.type);
  const power = Math.round(profile.power / 1000) / 10;
  const ratio = Math.round(profile.ratio * 100) / 100;
  return `${type} 綜合力: ${power}w 倍率: ${ratio}`;
}

export function formatUserProfileWithIndex(
  profile: UserProfile,
  index: number
): string {
  return `${index + 1}: ${formatUserProfile(profile)}`;
}
