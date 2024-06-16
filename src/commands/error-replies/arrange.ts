import { InteractionReplyOptions, MessageMentionOptions } from "discord.js";
import {
  EmptyActiveProfilesErrorData,
  EmptyProfilesErrorData,
  errorIds,
  PlayerNotEnoughErrorData,
} from "../user/arrange-errors";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = {
  [errorIds.noEnoughPlayers]: (
    data: PlayerNotEnoughErrorData,
  ): InteractionReplyOptions => {
    const replyLines: string[] = [];
    if (data.hasDuplicatedPlayers) {
      replyLines.push("已過濾重複的玩家。");
    }
    replyLines.push("玩家人數不足四人，不建議開協力 LIVE。");
    return { content: replyLines.join("\n") };
  },
  [errorIds.emptyProfiles]: (
    data: EmptyProfilesErrorData,
  ): InteractionReplyOptions => {
    const userString = data.users.map((u) => `${u} (${u.username})`).join(" ");
    const allowedMentions: MessageMentionOptions = data.mention
      ? undefined
      : { users: [] };
    return { content: `${userString} 沒有設定編組。`, allowedMentions };
  },
  [errorIds.emptyActiveProfiles]: (
    data: EmptyActiveProfilesErrorData,
  ): InteractionReplyOptions => {
    const userString = data.users.map((u) => `${u} (${u.username})`).join(" ");
    const allowedMentions: MessageMentionOptions = data.mention
      ? undefined
      : { users: [] };
    return { content: `${userString} 沒有設定使用中編組。`, allowedMentions };
  },
};
