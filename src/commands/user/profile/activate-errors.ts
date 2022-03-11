import { CommandError } from "../../command-error";

const activateFailed = "activate profile failed";

const emptyIndex = "profileActivate-emptyIndex";

export interface EmptyIndexErrorData {
  reason: string;
}

export class EmptyIndexError extends CommandError<EmptyIndexErrorData> {
  constructor() {
    const data: EmptyIndexErrorData = {
      reason: "index is empty",
    };
    super(activateFailed, data, EmptyIndexError.id);
  }

  static readonly id = emptyIndex;
}

const indexNotANumber = "profileActivate-indexNotANumber";

export interface IndexNotANumberErrorData {
  reason: string;
}

export class IndexNotANumberError extends CommandError<IndexNotANumberErrorData> {
  constructor() {
    const data: IndexNotANumberErrorData = {
      reason: "index is not a number",
    };
    super(activateFailed, data, IndexNotANumberError.id);
  }

  static readonly id = indexNotANumber;
}

const indexOutOfRange = "profileActivate-indexOutOfRange";

export interface IndexOutOfRangeErrorData {
  reason: string;
}

export class IndexOutOfRangeError extends CommandError<IndexOutOfRangeErrorData> {
  constructor() {
    const data: IndexOutOfRangeErrorData = {
      reason: "index is not a number",
    };
    super(activateFailed, data, IndexOutOfRangeError.id);
  }

  static readonly id = indexOutOfRange;
}

const noProfileRecord = "profileActivate-noProfileRecord";

export interface NoProfileRecordErrorData {
  reason: string;
}

export class NoProfileRecordError extends CommandError<NoProfileRecordErrorData> {
  constructor() {
    const data: NoProfileRecordErrorData = {
      reason: "user does not have profile record",
    };
    super(activateFailed, data, NoProfileRecordError.id);
  }

  static readonly id = noProfileRecord;
}

const emptyProfile = "profileActivate-emptyProfile";

export interface EmptyProfileErrorData {
  reason: string;
}

export class EmptyProfileError extends CommandError<EmptyProfileErrorData> {
  constructor() {
    const data: EmptyProfileErrorData = {
      reason: "empty profile selected",
    };
    super(activateFailed, data, EmptyProfileError.id);
  }

  static readonly id = emptyProfile;
}

export const errorIds = {
  emptyIndex,
  indexNotANumber,
  indexOutOfRange,
  noProfileRecord,
  emptyProfile,
};
