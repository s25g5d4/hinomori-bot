export enum UserProfileType {
  Runner,
  Helper,
}

export function convertToUserProfileType(type: string): UserProfileType {
  switch (type[0].toLowerCase()) {
    case "r":
      return UserProfileType.Runner;
    case "h":
      return UserProfileType.Helper;
    default:
      throw new Error("bad type");
  }
}

export interface UserProfile {
  type: UserProfileType;
  ratio: number;
  power: number;
}

export interface UserProfileRecord {
  profiles: UserProfile[];
  active: number;
}

export function formatUserProfileRecord(record: UserProfileRecord) {
  const profileString = (p: UserProfile, i: number) => {
    const index = i + 1;
    const type = UserProfileType[p.type];
    const power = Math.round(p.power / 1000) / 10;
    const ratio = Math.round(p.ratio * 100) / 100;
    return `${index}: ${type} 綜合力: ${power}w 倍率: ${ratio}`;
  };
  const profileLines = record.profiles
    .map((p, i) => p && profileString(p, i))
    .filter((p) => !!p);

  return [`使用中的編組: ${record.active + 1}`, ...profileLines].join("\n");
}
