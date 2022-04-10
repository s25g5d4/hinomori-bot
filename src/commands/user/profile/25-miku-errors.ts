import { CommandError } from "../../command-error";

const generate25MikuFailed = "generate 25 miku profile failed";

const emptyNickName = "generate25Miku-emptyNickName";

export interface EmptyNickNameErrorData {
  reason: string;
}

export class EmptyNickNameError extends CommandError<EmptyNickNameErrorData> {
  constructor() {
    const data: EmptyNickNameErrorData = {
      reason: "nickname is empty",
    };
    super(generate25MikuFailed, data, EmptyNickNameError.id);
  }

  static readonly id = emptyNickName;
}

const invalidNickName = "generate25Miku-invalidNickName";

export interface InvalidNickNameErrorData {
  reason: string;
}

export class InvalidNickNameError extends CommandError<InvalidNickNameErrorData> {
  constructor() {
    const data: InvalidNickNameErrorData = {
      reason: "invalid nickname",
    };
    super(generate25MikuFailed, data, InvalidNickNameError.id);
  }

  static readonly id = invalidNickName;
}

const emptyIndex = "generate25Miku-emptyIndex";

export interface EmptyIndexErrorData {
  reason: string;
}

export class EmptyIndexError extends CommandError<EmptyIndexErrorData> {
  constructor() {
    const data: EmptyIndexErrorData = {
      reason: "index is empty",
    };
    super(generate25MikuFailed, data, EmptyIndexError.id);
  }

  static readonly id = emptyIndex;
}

const indexNotANumber = "generate25Miku-indexNotANumber";

export interface IndexNotANumberErrorData {
  reason: string;
}

export class IndexNotANumberError extends CommandError<IndexNotANumberErrorData> {
  constructor() {
    const data: IndexNotANumberErrorData = {
      reason: "index is not a number",
    };
    super(generate25MikuFailed, data, IndexNotANumberError.id);
  }

  static readonly id = indexNotANumber;
}

const indexOutOfRange = "generate25Miku-indexOutOfRange";

export interface IndexOutOfRangeErrorData {
  reason: string;
}

export class IndexOutOfRangeError extends CommandError<IndexOutOfRangeErrorData> {
  constructor() {
    const data: IndexOutOfRangeErrorData = {
      reason: "index out of range",
    };
    super(generate25MikuFailed, data, IndexOutOfRangeError.id);
  }

  static readonly id = indexOutOfRange;
}

const noProfileRecord = "generate25Miku-noProfileRecord";

export interface NoProfileRecordErrorData {
  reason: string;
}

export class NoProfileRecordError extends CommandError<NoProfileRecordErrorData> {
  constructor() {
    const data: NoProfileRecordErrorData = {
      reason: "user does not have profile record",
    };
    super(generate25MikuFailed, data, NoProfileRecordError.id);
  }

  static readonly id = noProfileRecord;
}

const emptyProfile = "generate25Miku-emptyProfile";

export interface EmptyProfileErrorData {
  reason: string;
}

export class EmptyProfileError extends CommandError<EmptyProfileErrorData> {
  constructor() {
    const data: EmptyProfileErrorData = {
      reason: "empty profile selected",
    };
    super(generate25MikuFailed, data, EmptyProfileError.id);
  }

  static readonly id = emptyProfile;
}

export const errorIds = {
  emptyNickName,
  invalidNickName,
  emptyIndex,
  indexNotANumber,
  indexOutOfRange,
  noProfileRecord,
  emptyProfile,
};
