import { InteractionReplyOptions, MessageMentionOptions } from "discord.js";
import {
  EmptyActiveProfilesErrorData,
  EmptyProfilesErrorData,
  errorIds,
} from "../user/arrange-errors";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = {
  [errorIds.noEnoughPlayers]: (): InteractionReplyOptions => {
    return { content: "玩家人數不足四人，不建議開協力 LIVE。" };
  },
  [errorIds.emptyProfiles]: (
    data: EmptyProfilesErrorData
  ): InteractionReplyOptions => {
    const userString = data.users.map((u) => `${u} (${u.username})`).join(" ");
    const allowedMentions: MessageMentionOptions = data.mention
      ? undefined
      : { users: [] };
    return { content: `${userString} 沒有設定編組。`, allowedMentions };
  },
  [errorIds.emptyActiveProfiles]: (
    data: EmptyActiveProfilesErrorData
  ): InteractionReplyOptions => {
    const userString = data.users.map((u) => `${u} (${u.username})`).join(" ");
    const allowedMentions: MessageMentionOptions = data.mention
      ? undefined
      : { users: [] };
    return { content: `${userString} 沒有設定使用中編組。`, allowedMentions };
  },
};
