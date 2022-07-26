import { CommandError } from "src/commands/command-error";

const ratioV2Failed = "ratio v2 failed";

const invalidOptionCards = "ratioV2-invalidOptionCards";

export interface invalidOptionCardsErrorData {
  reason: string;
}

export class InvalidOptionCardsError extends CommandError<invalidOptionCardsErrorData> {
  constructor() {
    const data: invalidOptionCardsErrorData = {
      reason: "option cards is invalid",
    };
    super(ratioV2Failed, data, InvalidOptionCardsError.id);
  }

  static readonly id = invalidOptionCards;
}

export const errorIds = {
  invalidOptionCards,
};
