import { errorReplies as arrangeErrorReplies } from "./arrange";
import { errorReplies as profileActivateErrorReplies } from "./profile-activate";
import { errorReplies as profileListErrorReplies } from "./profile-list";
import { errorReplies as profileRemoveErrorReplies } from "./profile-remove";
import { errorReplies as profileUpdateErrorReplies } from "./profile-update";
import { errorReplies as profile25mikuErrorReplies } from "./profile-25-miku";
import { errorReplies as ratioTWErrorReplies } from "./ratio-tw";
import { errorReplies as ratioJPErrorReplies } from "./ratio-jp";
import { errorReplies as ratioV1ErrorReplies } from "./ratio-v1";
import { errorReplies as ratioV2ErrorReplies } from "./ratio-v2";
import { errorReplies as tagGetErrorReplies } from "./tag-get";
import { errorReplies as tagCreateErrorReplies } from "./tag-create";
import { errorReplies as tagUpdateErrorReplies } from "./tag-update";
import { errorReplies as tagRemoveErrorReplies } from "./tag-remove";
import { ReplyFunc } from "./reply-func";

export const errorReplies: Record<string, ReplyFunc> = Object.assign(
  {},
  arrangeErrorReplies,
  profileActivateErrorReplies,
  profileListErrorReplies,
  profileRemoveErrorReplies,
  profileUpdateErrorReplies,
  profile25mikuErrorReplies,
  ratioTWErrorReplies,
  ratioJPErrorReplies,
  ratioV1ErrorReplies,
  ratioV2ErrorReplies,
  tagGetErrorReplies,
  tagCreateErrorReplies,
  tagUpdateErrorReplies,
  tagRemoveErrorReplies
);

export const generalErrorMessage: ReplyFunc = () => {
  return {
    content: "指令錯誤",
  };
};
