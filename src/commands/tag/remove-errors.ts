import { CommandError } from "src/commands/command-error";

const removeFailed = "remove tag failed";

export interface EmptyNameErrorData {
  reason: string;
}

export class EmptyNameError extends CommandError<EmptyNameErrorData> {
  constructor() {
    const data: EmptyNameErrorData = {
      reason: "name is empty",
    };
    super(removeFailed, data, EmptyNameError.id);
  }

  static readonly id = "tagRemove-emptyName";
}

export interface ForbiddenErrorData {
  reason: string;
}

export class ForbiddenError extends CommandError<ForbiddenErrorData> {
  constructor() {
    const data: ForbiddenErrorData = {
      reason: "forbidden",
    };
    super(removeFailed, data, ForbiddenError.id);
  }

  static readonly id = "tagRemove-forbidden";
}

export const errorIds = {
  emptyName: EmptyNameError.id,
  forbidden: ForbiddenError.id,
};
