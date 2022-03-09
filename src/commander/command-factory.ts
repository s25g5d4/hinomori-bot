import { CommandInteraction } from "discord.js";

import { UserProfileStore } from "../store/user-profiles";
import { UpdateProfile } from "../commands/user/profile/update";
import { ActivateProfile } from "../commands/user/profile/activate";
import { ListProfile } from "../commands/user/profile/list";
import { RemoveProfile } from "../commands/user/profile/remove";
import { ArrangePlayers } from "../commands/user/arrange";

export class CommandFactory {
  constructor(private profileStore: UserProfileStore) {}

  newUpdateProfile(interaction: CommandInteraction): UpdateProfile {
    return new UpdateProfile(this.profileStore, interaction);
  }

  newListProfile(interaction: CommandInteraction): ListProfile {
    return new ListProfile(this.profileStore, interaction);
  }

  newActivateProfile(interaction: CommandInteraction): ActivateProfile {
    return new ActivateProfile(this.profileStore, interaction);
  }

  newRemoveProfile(interaction: CommandInteraction): RemoveProfile {
    return new RemoveProfile(this.profileStore, interaction);
  }

  newArrangePlayers(
    interaction: CommandInteraction,
    mention = true
  ): ArrangePlayers {
    return new ArrangePlayers(this.profileStore, interaction, mention);
  }
}
