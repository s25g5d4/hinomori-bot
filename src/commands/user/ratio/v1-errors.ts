import { CommandError } from "src/commands/command-error";

const ratioV1Failed = "ratio v1 failed";

const invalidOptionCards = "ratioV1-invalidOptionCards";

export interface invalidOptionCardsErrorData {
  reason: string;
}

export class InvalidOptionCardsError extends CommandError<invalidOptionCardsErrorData> {
  constructor() {
    const data: invalidOptionCardsErrorData = {
      reason: "option cards is invalid",
    };
    super(ratioV1Failed, data, InvalidOptionCardsError.id);
  }

  static readonly id = invalidOptionCards;
}

export const errorIds = {
  invalidOptionCards,
};
