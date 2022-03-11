import { CommandError } from "../../command-error";

const updateFailed = "update profile failed";

const indexNotANumber = "profileUpdate-indexNotANumber";

export interface IndexNotANumberErrorData {
  reason: string;
}

export class IndexNotANumberError extends CommandError<IndexNotANumberErrorData> {
  constructor() {
    const data: IndexNotANumberErrorData = {
      reason: "index is not a number",
    };
    super(updateFailed, data, IndexNotANumberError.id);
  }

  static readonly id = indexNotANumber;
}

const indexOutOfRange = "profileUpdate-indexOutOfRange";

export interface IndexOutOfRangeErrorData {
  reason: string;
}

export class IndexOutOfRangeError extends CommandError<IndexOutOfRangeErrorData> {
  constructor() {
    const data: IndexOutOfRangeErrorData = {
      reason: "index is not a number",
    };
    super(updateFailed, data, IndexOutOfRangeError.id);
  }

  static readonly id = indexOutOfRange;
}

const invalidOptionType = "profileUpdate-invalidOptionType";

export interface InvalidOptionTypeErrorData {
  reason: string;
}

export class InvalidOptionTypeError extends CommandError<InvalidOptionTypeErrorData> {
  constructor() {
    const data: InvalidOptionTypeErrorData = {
      reason: "option type is invalid",
    };
    super(updateFailed, data, InvalidOptionTypeError.id);
  }

  static readonly id = invalidOptionType;
}

const invalidOptionPower = "profileUpdate-invalidOptionPower";

export interface InvalidOptionPowerErrorData {
  reason: string;
}

export class InvalidOptionPowerError extends CommandError<InvalidOptionPowerErrorData> {
  constructor() {
    const data: InvalidOptionPowerErrorData = {
      reason: "option power is invalid",
    };
    super(updateFailed, data, InvalidOptionPowerError.id);
  }

  static readonly id = invalidOptionPower;
}

const optionPowerOutOfRange = "profileUpdate-optionPowerOutOfRange";

export interface OptionPowerOutOfRangeErrorData {
  reason: string;
}

export class OptionPowerOutOfRangeError extends CommandError<OptionPowerOutOfRangeErrorData> {
  constructor() {
    const data: OptionPowerOutOfRangeErrorData = {
      reason: "option power out of range",
    };
    super(updateFailed, data, OptionPowerOutOfRangeError.id);
  }

  static readonly id = optionPowerOutOfRange;
}

const invalidOptionCards = "profileUpdate-invalidOptionCards";

export interface invalidOptionCardsErrorData {
  reason: string;
}

export class invalidOptionCardsError extends CommandError<invalidOptionCardsErrorData> {
  constructor() {
    const data: invalidOptionCardsErrorData = {
      reason: "option cards is invalid",
    };
    super(updateFailed, data, invalidOptionCardsError.id);
  }

  static readonly id = invalidOptionCards;
}

export const errorIds = {
  indexNotANumber,
  indexOutOfRange,
  invalidOptionType,
  invalidOptionPower,
  optionPowerOutOfRange,
  invalidOptionCards,
};
