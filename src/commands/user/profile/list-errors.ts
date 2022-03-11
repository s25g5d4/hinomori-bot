import { CommandError } from "../../command-error";

const listFailed = "list profile failed";

const noProfileRecord = "profileList-noProfileRecord";

export interface NoProfileRecordErrorData {
  reason: string;
}

export class NoProfileRecordError extends CommandError<NoProfileRecordErrorData> {
  constructor() {
    const data: NoProfileRecordErrorData = {
      reason: "user does not have profile record",
    };
    super(listFailed, data, NoProfileRecordError.id);
  }

  static readonly id = noProfileRecord;
}

const noValidProfile = "profileList-noValidProfile";

export interface NoValidProfileErrorData {
  reason: string;
}

export class NoValidProfileError extends CommandError<NoValidProfileErrorData> {
  constructor() {
    const data: NoValidProfileErrorData = {
      reason: "user does not have any valid profile",
    };
    super(listFailed, data, NoValidProfileError.id);
  }

  static readonly id = noValidProfile;
}

export const errorIds = {
  noProfileRecord,
  noValidProfile,
};
