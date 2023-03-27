import { InteractionReplyOptions } from "discord.js";
import { errorIds } from "../tag/remove-errors";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = {
  [errorIds.emptyName]: (): InteractionReplyOptions => {
    return {
      content: "tag 名稱不能是空的。",
    };
  },
  [errorIds.forbidden]: (): InteractionReplyOptions => {
    return {
      content: "無法移除 tag，因為 tag 不存在或你不是這個 tag 的擁有者。",
    };
  },
};
