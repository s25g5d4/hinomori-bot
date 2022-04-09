import { DMChannel, TextBasedChannel, TextChannel } from "discord.js";
import { isNil } from "lodash";
import { logUser, LogUserObject } from "./log-user";

interface LogChannelObject {
  id: string;
  type: string;
  name?: string;
  recipient?: LogUserObject;
  parent?: LogChannelObject;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function isTextChannel(channel: any): channel is TextChannel {
  return !channel.isThread() && typeof channel.name === "string";
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function isDMChannel(channel: any): channel is DMChannel {
  return Object.prototype.hasOwnProperty.call(channel, "recipient");
}

function logBaseChannel(channel: TextBasedChannel): LogChannelObject {
  const { id, type } = channel;
  return { id, type };
}

export function logChannel(channel: TextBasedChannel): LogChannelObject {
  if (isNil(channel)) {
    return undefined;
  }

  if (isDMChannel(channel)) {
    const { recipient } = channel;
    return { ...logBaseChannel(channel), recipient: logUser(recipient) };
  }

  if (channel.isThread()) {
    const { name, parent } = channel;
    return { ...logBaseChannel(channel), name, parent: logChannel(parent) };
  }

  if (isTextChannel(channel)) {
    const { name } = channel;
    return { ...logBaseChannel(channel), name };
  }

  return logBaseChannel(channel);
}
