import { errorReplies as arrangeErrorReplies } from "./arrange";
import { errorReplies as profileActivateErrorReplies } from "./profile-activate";
import { errorReplies as profileListErrorReplies } from "./profile-list";
import { errorReplies as profileRemoveErrorReplies } from "./profile-remove";
import { errorReplies as profileUpdateErrorReplies } from "./profile-update";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = Object.assign(
  {},
  arrangeErrorReplies,
  profileActivateErrorReplies,
  profileListErrorReplies,
  profileRemoveErrorReplies,
  profileUpdateErrorReplies
);

export const generalErrorMessage: ReplyFunc = () => {
  return {
    content: "指令錯誤",
  };
};
