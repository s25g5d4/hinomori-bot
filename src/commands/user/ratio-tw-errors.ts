import { CommandError } from "../command-error";

const ratioTWFailed = "ratio-tw failed";

const invalidOptionCards = "ratioTW-invalidOptionCards";

export interface invalidOptionCardsErrorData {
  reason: string;
}

export class InvalidOptionCardsError extends CommandError<invalidOptionCardsErrorData> {
  constructor() {
    const data: invalidOptionCardsErrorData = {
      reason: "option cards is invalid",
    };
    super(ratioTWFailed, data, InvalidOptionCardsError.id);
  }

  static readonly id = invalidOptionCards;
}

export const errorIds = {
  invalidOptionCards,
};
