import { InteractionReplyOptions } from "discord.js";
import { errorIds } from "../user/profile/activate-errors";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = {
  [errorIds.emptyIndex]: (): InteractionReplyOptions => {
    return {
      content: "沒有輸入編號 (index)。",
    };
  },
  [errorIds.indexNotANumber]: (): InteractionReplyOptions => {
    return {
      content: "輸入的編號 (index) 錯誤。",
    };
  },
  [errorIds.indexOutOfRange]: (): InteractionReplyOptions => {
    return {
      content: "輸入的編號 (index) 錯誤。僅能輸入 1~10。",
    };
  },
  [errorIds.noProfileRecord]: (): InteractionReplyOptions => {
    return {
      content: "沒有編組資料。請先使用 /profile update 指令新增編組。",
    };
  },
  [errorIds.emptyProfile]: (): InteractionReplyOptions => {
    return {
      content: "選擇的編組是空白的。",
    };
  },
};
