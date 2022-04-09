import { CommandInteraction } from "discord.js";

import { UserProfileStore } from "src/store/user-profiles";
import { UpdateProfile } from "src/commands/user/profile/update";
import { ActivateProfile } from "src/commands/user/profile/activate";
import { ListProfile } from "src/commands/user/profile/list";
import { RemoveProfile } from "src/commands/user/profile/remove";
import { ArrangePlayers } from "src/commands/user/arrange";
import { logger } from "src/logger";
import { logInteraction } from "src/utils/log-interaction";

export class CommandFactory {
  constructor(private profileStore: UserProfileStore) {}

  newUpdateProfile(interaction: CommandInteraction): UpdateProfile {
    const l = this.createLogger(interaction);
    return new UpdateProfile(l, interaction, this.profileStore);
  }

  newListProfile(interaction: CommandInteraction): ListProfile {
    const l = this.createLogger(interaction);
    return new ListProfile(l, interaction, this.profileStore);
  }

  newActivateProfile(interaction: CommandInteraction): ActivateProfile {
    const l = this.createLogger(interaction);
    return new ActivateProfile(l, interaction, this.profileStore);
  }

  newRemoveProfile(interaction: CommandInteraction): RemoveProfile {
    const l = this.createLogger(interaction);
    return new RemoveProfile(l, interaction, this.profileStore);
  }

  newArrangePlayers(
    interaction: CommandInteraction,
    mention = true
  ): ArrangePlayers {
    const l = this.createLogger(interaction);
    return new ArrangePlayers(l, interaction, this.profileStore, mention);
  }

  private createLogger(interaction: CommandInteraction) {
    return logger.child({ interaction: logInteraction(interaction) });
  }
}
