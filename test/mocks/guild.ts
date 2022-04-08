import { Guild } from "discord.js";

export function genGuild(id: string, name: string): Guild {
  return (<Partial<Guild>>{
    id,
    name,
  }) as Guild;
}
