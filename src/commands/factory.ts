import { UpdateProfile } from "./profile/update";
import { UserProfileStore } from "../store/user-profiles";
import { CommandInteraction } from "discord.js";
import { ActivateProfile } from "./profile/activate";
import { ListProfile } from "./profile/list";
import { RemoveProfile } from "./profile/remove";
import { ArrangePlayers } from "./arrange";

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

  newArrangePlayers(interaction: CommandInteraction): ArrangePlayers {
    return new ArrangePlayers(this.profileStore, interaction);
  }
}
