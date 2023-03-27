import { arrangeCommands } from "./arrange";
import { profileCommands } from "./profile";
import { ratioCommands } from "./ratio";
import { tagCommands } from "./tag";

export const commands = [
  ...profileCommands,
  ...arrangeCommands,
  ...ratioCommands,
  ...tagCommands,
];
