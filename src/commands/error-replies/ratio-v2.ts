import { InteractionReplyOptions } from "discord.js";
import { errorIds } from "../user/ratio/v2-errors";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = {
  [errorIds.invalidOptionCards]: (): InteractionReplyOptions => {
    return {
      content: "輸入的卡片倍率 (cards) 格式錯誤。",
    };
  },
};
