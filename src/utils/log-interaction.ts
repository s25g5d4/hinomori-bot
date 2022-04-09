import { Interaction } from "discord.js";
import { isNil } from "lodash";
import { logChannel } from "./log-channel";
import { logGuild } from "./log-guild";
import { logUser } from "./log-user";

function logBaseInteraction(interaction: Interaction) {
  const { id } = interaction;
  return { id };
}

function logDetailInteraction(interaction: Interaction) {
  const { type, guild, channel, user } = interaction;
  return {
    ...logBaseInteraction(interaction),
    type,
    guild: logGuild(guild),
    channel: logChannel(channel),
    user: logUser(user),
  };
}

export function logInteraction(interaction: Interaction, detail = false) {
  if (isNil(interaction)) {
    return undefined;
  }

  if (detail) {
    return logDetailInteraction(interaction);
  }

  return logBaseInteraction(interaction);
}
