import { InteractionReplyOptions } from "discord.js";
import { errorIds } from "../user/profile/list-errors";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = {
  [errorIds.noProfileRecord]: (): InteractionReplyOptions => {
    return {
      content: "沒有編組資料。請先使用 /profile update 指令新增編組。",
    };
  },
  [errorIds.noValidProfile]: (): InteractionReplyOptions => {
    return {
      content: "沒有編組資料。請先使用 /profile update 指令新增編組。",
    };
  },
};
