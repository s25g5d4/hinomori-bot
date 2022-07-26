import { arrangeCommands } from "./arrange";
import { profileCommands } from "./profile";
import { ratioCommands } from "./ratio";

export const commands = [
  ...profileCommands,
  ...arrangeCommands,
  ...ratioCommands,
];
