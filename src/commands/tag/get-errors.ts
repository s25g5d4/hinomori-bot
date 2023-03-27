import { CommandError } from "src/commands/command-error";

const getFailed = "get tag failed";

export interface NoTagErrorData {
  reason: string;
}

export class NoTagError extends CommandError<NoTagErrorData> {
  constructor() {
    const data: NoTagErrorData = {
      reason: "tag not found",
    };
    super(getFailed, data, NoTagError.id);
  }

  static readonly id = "tagGet-noTag";
}

export const errorIds = {
  noTag: NoTagError.id,
};
