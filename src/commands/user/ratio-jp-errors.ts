import { CommandError } from "../command-error";

const ratioJPFailed = "ratio-jp failed";

const invalidOptionCards = "ratioJP-invalidOptionCards";

export interface invalidOptionCardsErrorData {
  reason: string;
}

export class InvalidOptionCardsError extends CommandError<invalidOptionCardsErrorData> {
  constructor() {
    const data: invalidOptionCardsErrorData = {
      reason: "option cards is invalid",
    };
    super(ratioJPFailed, data, InvalidOptionCardsError.id);
  }

  static readonly id = invalidOptionCards;
}

export const errorIds = {
  invalidOptionCards,
};
