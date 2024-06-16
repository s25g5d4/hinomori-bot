export enum UserProfileType {
  Runner,
  Helper,
}

export class UnknownTypeError extends Error {
  constructor(type: unknown) {
    super("unknown type:" + type);
  }
}

export function convertToUserProfileType(type: string): UserProfileType {
  switch (type[0].toLowerCase()) {
    case "r":
      return UserProfileType.Runner;
    case "h":
      return UserProfileType.Helper;
    default:
      throw new UnknownTypeError(type);
  }
}

export function formatUserProfileType(type: UserProfileType): string {
  switch (type) {
    case UserProfileType.Runner:
      return "跑者";
    case UserProfileType.Helper:
      return "幫手";
    default:
      throw new UnknownTypeError(type);
  }
}
