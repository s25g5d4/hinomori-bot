import {
  ApplicationCommandOptionType,
  CommandInteraction,
  CommandInteractionOption,
  CommandInteractionOptionResolver,
  Guild,
  User,
} from "discord.js";
import { fake, SinonStub, stub } from "sinon";
import { has, isNil, isObject } from "lodash";
import { genGuild } from "./guild";
import { genUser } from "./user";

type Get = CommandInteraction["options"]["get"];
type Reply = typeof CommandInteraction.prototype.reply;

export class StubInteraction {
  id = "default-interaction-id";
  user: User = genUser("issueCommandUser", "command-user", "0000");
  guild: Guild = genGuild("default-guild", "default guild");
  fakeGet: SinonStub<Parameters<Get>, ReturnType<Get>>;
  fakeReply = fake.resolves<Parameters<Reply>, ReturnType<Reply>>(null);

  withUser(user: User): StubInteraction {
    this.user = user;
    return this;
  }

  withGuild(guild: Guild): StubInteraction {
    this.guild = guild;
    return this;
  }

  withOptionsGet(
    name: string,
    returns: Parameters<typeof Option>[2],
  ): StubInteraction {
    if (!this.fakeGet) {
      this.fakeGet = stub();
    }

    const isUser = (u: unknown): u is User => isObject(u) && has(u, "username");
    let opt: CommandInteractionOption;
    if (!isNil(returns)) {
      if (typeof returns === "string") {
        opt = Option(name, ApplicationCommandOptionType.String, returns);
      }
      if (typeof returns === "number") {
        opt = Option(name, ApplicationCommandOptionType.Number, returns);
      }
      if (isUser(returns)) {
        opt = Option(name, ApplicationCommandOptionType.User, returns);
      }
      if (isNil(opt)) {
        throw new Error("invalid return value");
      }
    } else {
      opt = returns;
    }
    this.fakeGet.withArgs(name).returns(opt);
    return this;
  }

  build(): CommandInteraction {
    const options: Partial<CommandInteractionOptionResolver> = {
      get: this.fakeGet,
    };

    return (<Omit<Partial<CommandInteraction>, "valueOf">>{
      id: this.id,
      guild: this.guild,
      user: this.user,
      options,
      reply: this.fakeReply as unknown,
    }) as CommandInteraction;
  }
}

export function Option(
  name: string,
  type: ApplicationCommandOptionType,
  val?: User | string | number,
): CommandInteractionOption {
  const opt: Partial<CommandInteractionOption> = { name, type };

  switch (type) {
    case ApplicationCommandOptionType.User:
      opt.user = val as User;
      break;

    case ApplicationCommandOptionType.String:
    case ApplicationCommandOptionType.Number:
      opt.value = val as string | number;
      break;
  }

  return opt as CommandInteractionOption;
}
