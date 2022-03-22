import { User } from "discord.js";

export function genUser(
  id: string,
  username: string,
  discriminator: string
): User {
  return (<Partial<User>>{
    id,
    username,
    discriminator,
    get tag(): string {
      return `${this.username}#${this.discriminator}`;
    },
    toString(): string {
      return `<@${this.id}>`;
    },
  }) as User;
}
