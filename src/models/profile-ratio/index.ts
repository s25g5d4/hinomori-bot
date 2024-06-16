import { isNil } from "lodash";
import { config } from "src/config";
import { ProfileRatioFn } from "./profile-ratio-fn";
import { profileRatio as profileRatioV1 } from "./v1";
import { profileRatio as profileRatioV2 } from "./v2";

export enum ProfileRatioVersion {
  V1,
  V2,
}

export const ProfileRatioVersionName: Record<ProfileRatioVersion, string> = {
  [ProfileRatioVersion.V1]: "v1",
  [ProfileRatioVersion.V2]: "v2",
};

export const ProfileRatioVersionNameValue: Record<string, ProfileRatioVersion> =
  {
    v1: ProfileRatioVersion.V1,
    v2: ProfileRatioVersion.V2,
  };

export const profileRatioFunctions: Record<
  ProfileRatioVersion,
  ProfileRatioFn
> = {
  [ProfileRatioVersion.V1]: profileRatioV1,
  [ProfileRatioVersion.V2]: profileRatioV2,
};

const isKeyOfProfileRatioVersion = (
  ver: unknown,
): ver is keyof typeof ProfileRatioVersion => {
  return !isNil(ProfileRatioVersion[ver as keyof typeof ProfileRatioVersion]);
};

const fallback = (
  ver: string,
  defaultVer: ProfileRatioVersion,
): ProfileRatioVersion => {
  if (isKeyOfProfileRatioVersion(ver)) {
    return ProfileRatioVersion[ver];
  }
  return defaultVer;
};

export const defaultVersion: ProfileRatioVersion = fallback(
  config.defaultProfileRatioVersion,
  ProfileRatioVersion.V1,
);
export const defaultProfileRatio = profileRatioFunctions[defaultVersion];

export const twVersion: ProfileRatioVersion = fallback(
  config.twProfileRatioVersion,
  ProfileRatioVersion.V1,
);
export const jpVersion: ProfileRatioVersion = fallback(
  config.jpProfileRatioVersion,
  ProfileRatioVersion.V2,
);
export const twProfileRatio = profileRatioFunctions[twVersion];
export const jpProfileRatio = profileRatioFunctions[jpVersion];

export * from "./profile-ratio-fn";
