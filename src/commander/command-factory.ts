import { ChatInputCommandInteraction } from "discord.js";

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
    private tagStore: TagStore,
  ) {}

  newUpdateProfile(interaction: ChatInputCommandInteraction): UpdateProfile {
    const l = this.createLogger(interaction);
    return new UpdateProfile(l, interaction, this.profileStore);
  }

  newListProfile(interaction: ChatInputCommandInteraction): ListProfile {
    const l = this.createLogger(interaction);
    return new ListProfile(l, interaction, this.profileStore);
  }

  newActivateProfile(
    interaction: ChatInputCommandInteraction,
  ): ActivateProfile {
    const l = this.createLogger(interaction);
    return new ActivateProfile(l, interaction, this.profileStore);
  }

  newRemoveProfile(interaction: ChatInputCommandInteraction): RemoveProfile {
    const l = this.createLogger(interaction);
    return new RemoveProfile(l, interaction, this.profileStore);
  }

  new25MikuProfile(interaction: ChatInputCommandInteraction): NiGoMikuProfile {
    const l = this.createLogger(interaction);
    return new NiGoMikuProfile(l, interaction, this.profileStore);
  }

  newArrangePlayers(
    interaction: ChatInputCommandInteraction,
    mention = true,
  ): ArrangePlayers {
    const l = this.createLogger(interaction);
    return new ArrangePlayers(l, interaction, this.profileStore, mention);
  }

  newRatioTW(interaction: ChatInputCommandInteraction): RatioTW {
    const l = this.createLogger(interaction);
    return new RatioTW(l, interaction);
  }

  newRatioJP(interaction: ChatInputCommandInteraction): RatioJP {
    const l = this.createLogger(interaction);
    return new RatioJP(l, interaction);
  }

  newRatioV1(interaction: ChatInputCommandInteraction): RatioV1 {
    const l = this.createLogger(interaction);
    return new RatioV1(l, interaction);
  }

  newRatioV2(interaction: ChatInputCommandInteraction): RatioV2 {
    const l = this.createLogger(interaction);
    return new RatioV2(l, interaction);
  }

  newRatioServerVersion(
    interaction: ChatInputCommandInteraction,
  ): RatioServerVersion {
    const l = this.createLogger(interaction);
    return new RatioServerVersion(l, interaction);
  }

  newTagCreate(interaction: ChatInputCommandInteraction): CreateTag {
    const l = this.createLogger(interaction);
    return new CreateTag(l, interaction, this.tagStore);
  }

  newTagGet(interaction: ChatInputCommandInteraction): GetTag {
    const l = this.createLogger(interaction);
    return new GetTag(l, interaction, this.tagStore);
  }

  newTagUpdate(interaction: ChatInputCommandInteraction): UpdateTag {
    const l = this.createLogger(interaction);
    return new UpdateTag(l, interaction, this.tagStore);
  }

  newTagRemove(interaction: ChatInputCommandInteraction): RemoveTag {
    const l = this.createLogger(interaction);
    return new RemoveTag(l, interaction, this.tagStore);
  }

  private createLogger(interaction: ChatInputCommandInteraction) {
    return logger.child({ interaction: logInteraction(interaction) });
  }
}
