import { isNil } from "lodash";
import {
  defaultProfileRatio,
  ProfileRatioFn,
  profileRatioFunctions,
  ProfileRatioVersion,
} from "../profile-ratio";
import { formatUserProfileType, UserProfileType } from "./type";

export interface UserProfile {
  type: UserProfileType;
  cards: [number, number, number, number, number];
  power: number;
  ratioVersion?: ProfileRatioVersion;
}

function getRatioFn(ratioVer?: ProfileRatioVersion): ProfileRatioFn {
  if (isNil(ratioVer)) {
    return defaultProfileRatio;
  }
  return profileRatioFunctions[ratioVer];
}

export function userProfileRatio(profile: UserProfile): number {
  return getRatioFn(profile.ratioVersion)(profile.cards);
}

export function formatUserProfile(profile: UserProfile): string {
  const type = formatUserProfileType(profile.type);
  const power = profile.power.toString().padStart(6, " ");
  const ratio = Math.round(userProfileRatio(profile) * 100) / 100;
  const ratioVersion = isNil(profile.ratioVersion)
    ? ""
    : ` (${ProfileRatioVersion[profile.ratioVersion]})`;
  return `${type} 綜合力: ${power} 倍率: ${ratio.toFixed(2)}` + ratioVersion;
}
