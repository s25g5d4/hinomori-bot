import { CommandInteraction } from "discord.js";
import { logger } from "../logger";
import { CommandError } from "./command-error";
import { errorReplies } from "./error-replies";
import { ReplyFunc } from "./error-replies/reply-func";
import { InteractiveCommand } from "./interactive-command";

type ExecuteCommandType = typeof InteractiveCommand.prototype.executeCommand;

const generalErrorMessage: ReplyFunc = () => {
  return {
    content: "指令錯誤",
  };
};

async function handleError(
  err: Error,
  interaction: CommandInteraction
): Promise<void> {
  if (!(err instanceof CommandError)) {
    throw err;
  }

  logger.info(err.data, err.message);
  const getReplyMessage: ReplyFunc =
    errorReplies[err.errorId] ?? generalErrorMessage;
  await interaction.reply(getReplyMessage(err.data));
}

export function CatchExecuteError() {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod: ExecuteCommandType = descriptor.value;
    const newMethod: ExecuteCommandType = async function (
      this: InteractiveCommand
    ) {
      try {
        return await originalMethod.apply(this);
      } catch (err) {
        await handleError(err, this.interaction);
      }
    };
    descriptor.value = newMethod;
  };
}
