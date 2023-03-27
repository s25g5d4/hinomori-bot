import { InteractionReplyOptions } from "discord.js";
import { errorIds } from "../tag/get-errors";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = {
  [errorIds.noTag]: (): InteractionReplyOptions => {
    return {
      content: "這個 tag 不存在。",
    };
  },
};
