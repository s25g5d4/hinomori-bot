import { errorReplies as arrangeErrorReplies } from "./arrange";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = Object.assign(
  {},
  arrangeErrorReplies
);

export const generalErrorMessage: ReplyFunc = () => {
  return {
    content: "指令錯誤",
  };
};
