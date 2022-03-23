import { User } from "discord.js";
import { CommandError } from "../command-error";

const arrangeFailed = "arrange failed";

const noEnoughPlayers = "arrange-noEnoughPlayers";

export interface PlayerNotEnoughErrorData {
  reason: string;
  count: number;
  hasDuplicatedPlayers: boolean;
}

export class PlayerNotEnoughError extends CommandError<PlayerNotEnoughErrorData> {
  constructor(count: number, hasDuplicatedPlayers: boolean) {
    const data: PlayerNotEnoughErrorData = {
      reason: "no enough players",
      count,
      hasDuplicatedPlayers,
    };
    super(arrangeFailed, data, PlayerNotEnoughError.id);
  }

  static readonly id = noEnoughPlayers;
}

const emptyProfiles = "arrange-emptyProfiles";

export interface EmptyProfilesErrorData {
  reason: string;
  users: User[];
  mention: boolean;
}

export class EmptyProfilesError extends CommandError<EmptyProfilesErrorData> {
  constructor(users: User[], mention: boolean) {
    const data: EmptyProfilesErrorData = {
      reason: "empty profile records",
      users,
      mention,
    };
    super(arrangeFailed, data, EmptyProfilesError.id);
  }

  static readonly id = emptyProfiles;
}

const emptyActiveProfiles = "arrange-emptyActiveProfiles";

export interface EmptyActiveProfilesErrorData {
  reason: string;
  users: User[];
  mention: boolean;
}

export class EmptyActiveProfilesError extends CommandError<EmptyActiveProfilesErrorData> {
  constructor(users: User[], mention: boolean) {
    const data: EmptyActiveProfilesErrorData = {
      reason: "empty active profiles",
      users,
      mention,
    };
    super(arrangeFailed, data, EmptyActiveProfilesError.id);
  }

  static readonly id = emptyActiveProfiles;
}

export const errorIds = {
  noEnoughPlayers,
  emptyProfiles,
  emptyActiveProfiles,
};
