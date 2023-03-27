import { CommandInteraction } from "discord.js";

import { UserProfileStore } from "src/store/user-profiles";
import { UpdateProfile } from "src/commands/user/profile/update";
import { ActivateProfile } from "src/commands/user/profile/activate";
import { ListProfile } from "src/commands/user/profile/list";
import { RemoveProfile } from "src/commands/user/profile/remove";
import { ArrangePlayers } from "src/commands/user/arrange";
import { RatioTW } from "src/commands/user/ratio/tw";
import { logger } from "src/logger";
import { logInteraction } from "src/utils/log-interaction";
import { NiGoMikuProfile } from "src/commands/user/profile/25-miku";
import { RatioJP } from "src/commands/user/ratio/jp";
import { RatioV1 } from "src/commands/user/ratio/v1";
import { RatioV2 } from "src/commands/user/ratio/v2";
import { RatioServerVersion } from "src/commands/user/ratio/server-version";
import { GetTag } from "src/commands/tag/get";
import { TagStore } from "src/store/tags";
import { CreateTag } from "src/commands/tag/create";
import { UpdateTag } from "src/commands/tag/update";
import { RemoveTag } from "src/commands/tag/remove";

export class CommandFactory {
  constructor(
    private profileStore: UserProfileStore,
    private tagStore: TagStore
  ) {}

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

  new25MikuProfile(interaction: CommandInteraction): NiGoMikuProfile {
    const l = this.createLogger(interaction);
    return new NiGoMikuProfile(l, interaction, this.profileStore);
  }

  newArrangePlayers(
    interaction: CommandInteraction,
    mention = true
  ): ArrangePlayers {
    const l = this.createLogger(interaction);
    return new ArrangePlayers(l, interaction, this.profileStore, mention);
  }

  newRatioTW(interaction: CommandInteraction): RatioTW {
    const l = this.createLogger(interaction);
    return new RatioTW(l, interaction);
  }

  newRatioJP(interaction: CommandInteraction): RatioJP {
    const l = this.createLogger(interaction);
    return new RatioJP(l, interaction);
  }

  newRatioV1(interaction: CommandInteraction): RatioV1 {
    const l = this.createLogger(interaction);
    return new RatioV1(l, interaction);
  }

  newRatioV2(interaction: CommandInteraction): RatioV2 {
    const l = this.createLogger(interaction);
    return new RatioV2(l, interaction);
  }

  newRatioServerVersion(interaction: CommandInteraction): RatioServerVersion {
    const l = this.createLogger(interaction);
    return new RatioServerVersion(l, interaction);
  }

  newTagCreate(interaction: CommandInteraction): CreateTag {
    const l = this.createLogger(interaction);
    return new CreateTag(l, interaction, this.tagStore);
  }

  newTagGet(interaction: CommandInteraction): GetTag {
    const l = this.createLogger(interaction);
    return new GetTag(l, interaction, this.tagStore);
  }

  newTagUpdate(interaction: CommandInteraction): UpdateTag {
    const l = this.createLogger(interaction);
    return new UpdateTag(l, interaction, this.tagStore);
  }

  newTagRemove(interaction: CommandInteraction): RemoveTag {
    const l = this.createLogger(interaction);
    return new RemoveTag(l, interaction, this.tagStore);
  }

  private createLogger(interaction: CommandInteraction) {
    return logger.child({ interaction: logInteraction(interaction) });
  }
}
