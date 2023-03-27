import { CommandError } from "src/commands/command-error";

const updateFailed = "update tag failed";

export interface EmptyNameErrorData {
  reason: string;
}

export class EmptyNameError extends CommandError<EmptyNameErrorData> {
  constructor() {
    const data: EmptyNameErrorData = {
      reason: "name is empty",
    };
    super(updateFailed, data, EmptyNameError.id);
  }

  static readonly id = "tagUpdate-emptyName";
}

export interface EmptyValueErrorData {
  reason: string;
}

export class EmptyValueError extends CommandError<EmptyValueErrorData> {
  constructor() {
    const data: EmptyValueErrorData = {
      reason: "value is empty",
    };
    super(updateFailed, data, EmptyValueError.id);
  }

  static readonly id = "tagUpdate-emptyValue";
}

export interface ForbiddenErrorData {
  reason: string;
}

export class ForbiddenError extends CommandError<ForbiddenErrorData> {
  constructor() {
    const data: ForbiddenErrorData = {
      reason: "forbidden",
    };
    super(updateFailed, data, ForbiddenError.id);
  }

  static readonly id = "tagUpdate-forbidden";
}

export const errorIds = {
  emptyName: EmptyNameError.id,
  emptyValue: EmptyValueError.id,
  forbidden: ForbiddenError.id,
};
