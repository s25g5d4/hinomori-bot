import { CommandError } from "src/commands/command-error";

const createFailed = "create tag failed";

export interface EmptyNameErrorData {
  reason: string;
}

export class EmptyNameError extends CommandError<EmptyNameErrorData> {
  constructor() {
    const data: EmptyNameErrorData = {
      reason: "name is empty",
    };
    super(createFailed, data, EmptyNameError.id);
  }

  static readonly id = "tagCreate-emptyName";
}

export interface EmptyValueErrorData {
  reason: string;
}

export class EmptyValueError extends CommandError<EmptyValueErrorData> {
  constructor() {
    const data: EmptyValueErrorData = {
      reason: "value is empty",
    };
    super(createFailed, data, EmptyValueError.id);
  }

  static readonly id = "tagCreate-emptyValue";
}

export interface ForbiddenErrorData {
  reason: string;
}

export class ForbiddenError extends CommandError<ForbiddenErrorData> {
  constructor() {
    const data: ForbiddenErrorData = {
      reason: "forbidden",
    };
    super(createFailed, data, ForbiddenError.id);
  }

  static readonly id = "tagCreate-forbidden";
}

export const errorIds = {
  emptyName: EmptyNameError.id,
  emptyValue: EmptyValueError.id,
  forbidden: ForbiddenError.id,
};
