import { InteractionReplyOptions } from "discord.js";
import { errorIds } from "../tag/update-errors";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = {
  [errorIds.emptyName]: (): InteractionReplyOptions => {
    return {
      content: "tag 名稱不能是空的。",
    };
  },
  [errorIds.emptyValue]: (): InteractionReplyOptions => {
    return {
      content: "tag 內容不能是空的。",
    };
  },
  [errorIds.forbidden]: (): InteractionReplyOptions => {
    return {
      content: "無法編輯 tag，因為你不是這個 tag 的擁有者。",
    };
  },
};
