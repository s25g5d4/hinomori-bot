import { CommandInteraction } from "discord.js";

import { UserProfileStore } from "src/store/user-profiles";
import { UpdateProfile } from "src/commands/user/profile/update";
import { ActivateProfile } from "src/commands/user/profile/activate";
import { ListProfile } from "src/commands/user/profile/list";
import { RemoveProfile } from "src/commands/user/profile/remove";
import { ArrangePlayers } from "src/commands/user/arrange";

export class CommandFactory {
  constructor(private profileStore: UserProfileStore) {}

  newUpdateProfile(interaction: CommandInteraction): UpdateProfile {
    return new UpdateProfile(interaction, this.profileStore);
  }

  newListProfile(interaction: CommandInteraction): ListProfile {
    return new ListProfile(interaction, this.profileStore);
  }

  newActivateProfile(interaction: CommandInteraction): ActivateProfile {
    return new ActivateProfile(interaction, this.profileStore);
  }

  newRemoveProfile(interaction: CommandInteraction): RemoveProfile {
    return new RemoveProfile(interaction, this.profileStore);
  }

  newArrangePlayers(
    interaction: CommandInteraction,
    mention = true
  ): ArrangePlayers {
    return new ArrangePlayers(interaction, this.profileStore, mention);
  }
}
