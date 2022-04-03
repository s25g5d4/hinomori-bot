import { InteractionReplyOptions } from "discord.js";
import { errorIds } from "../user/profile/update-errors";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = {
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
  [errorIds.invalidOptionType]: (): InteractionReplyOptions => {
    return {
      content: "輸入的編組類型 (type) 錯誤。僅能選擇跑者或幫手其中一種。",
    };
  },
  [errorIds.invalidOptionPower]: (): InteractionReplyOptions => {
    return {
      content: "輸入的綜合力 (power) 格式錯誤。",
    };
  },
  [errorIds.optionPowerOutOfRange]: (): InteractionReplyOptions => {
    return {
      content:
        "輸入的綜合力 (power) 過低或過高。請輸入完整數字，而不是以萬為單位的簡寫。",
    };
  },
  [errorIds.invalidOptionCards]: (): InteractionReplyOptions => {
    return {
      content: "輸入的卡片倍率 (cards) 格式錯誤。",
    };
  },
};
