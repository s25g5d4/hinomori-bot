import { CommandInteraction, User } from "discord.js";
import { fake, SinonStub, stub } from "sinon";
import { genUser } from "./user";

type Options = typeof CommandInteraction.prototype.options;
type GetUser = typeof CommandInteraction.prototype.options.getUser;
type GetString = typeof CommandInteraction.prototype.options.getString;
type GetNumber = typeof CommandInteraction.prototype.options.getNumber;
type Reply = typeof CommandInteraction.prototype.reply;

export class StubInteraction {
  user: User = genUser("issueCommandUser", "command-user", "0000");
  fakeGetUser: SinonStub<Parameters<GetUser>, ReturnType<GetUser>>;
  fakeGetString: SinonStub<Parameters<GetString>, ReturnType<GetString>>;
  fakeGetNumber: SinonStub<Parameters<GetNumber>, ReturnType<GetNumber>>;
  fakeReply = fake.resolves<Parameters<Reply>, ReturnType<Reply>>(null);

  withUser(user: User): StubInteraction {
    this.user = user;
    return this;
  }

  withGetUser(
    args: Parameters<typeof this.fakeGetUser.withArgs>,
    returns: Parameters<typeof this.fakeGetUser.returns>[0]
  ): StubInteraction {
    if (!this.fakeGetUser) {
      this.fakeGetUser = stub();
    }
    this.fakeGetUser.withArgs(...args).returns(returns);
    return this;
  }

  withGetNumber(
    args: Parameters<typeof this.fakeGetNumber.withArgs>,
    returns: Parameters<typeof this.fakeGetNumber.returns>[0]
  ): StubInteraction {
    if (!this.fakeGetNumber) {
      this.fakeGetNumber = stub();
    }
    this.fakeGetNumber.withArgs(...args).returns(returns);
    return this;
  }

  withGetString(
    args: Parameters<typeof this.fakeGetString.withArgs>,
    returns: Parameters<typeof this.fakeGetString.returns>[0]
  ): StubInteraction {
    if (!this.fakeGetString) {
      this.fakeGetString = stub();
    }
    this.fakeGetString.withArgs(...args).returns(returns);
    return this;
  }

  build(): CommandInteraction {
    const options: Partial<Options> = {
      getUser: this.fakeGetUser,
      getNumber: this.fakeGetNumber,
      getString: this.fakeGetString,
    };

    return (<Omit<Partial<CommandInteraction>, "valueOf">>{
      user: this.user,
      options,
      reply: this.fakeReply as unknown,
    }) as CommandInteraction;
  }
}
