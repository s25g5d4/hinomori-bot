export enum UserProfileType {
  Runner,
  Helper,
}

export const errBadType = new Error("bad type");

export function convertToUserProfileType(type: string): UserProfileType {
  switch (type[0].toLowerCase()) {
    case "r":
      return UserProfileType.Runner;
    case "h":
      return UserProfileType.Helper;
    default:
      throw errBadType;
  }
}

export function formatUserProfileType(type: UserProfileType): string {
  switch (type) {
    case UserProfileType.Runner:
      return "跑者";
    case UserProfileType.Helper:
      return "幫手";
    default:
      throw errBadType;
  }
}
