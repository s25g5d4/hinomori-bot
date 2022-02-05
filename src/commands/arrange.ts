import { Command } from "./command";
import { CommandInteraction, User } from "discord.js";
import { UserProfileStore } from "./../store/user-profiles";
import { logger } from "../logger";
import {
  formatUserProfileWithIndex,
  UserProfile,
  UserProfileRecord,
} from "../models/user-profile";

const errParseOptions = new Error("failed to parse options");

interface ArrangePlayersOptions {
  players: User[];
}

interface PlayerProfilesAndRatioOrder {
  ratioOrder: number[];
  profiles: UserProfile[];
}

export class ArrangePlayers implements Command {
  private static optimizedOrder5 = [4, 3, 0, 1, 2] as const;
  private static optimizedOrder4 = [3, 0, 1, 2] as const;

  constructor(
    private profileStore: UserProfileStore,
    private interaction: CommandInteraction
  ) {}

  private async badRequest() {
    await this.interaction.reply("格式不正確");
  }

  private async playerNotEnough() {
    await this.interaction.reply("玩家人數不足四人，不建議開協力 LIVE。");
  }

  private async playersDoNotHaveActiveProfile(players: User[]) {
    await this.interaction.reply({
      content: `${players.join(" ")} 沒有設定編組。`,
      allowedMentions: {
        users: [],
      },
    });
  }

  private checkEmptyRecords(records: UserProfileRecord[]): number[] | null {
    const emptyRecordIndices = records
      .map((p, i) => (p == null ? i : null))
      .filter((n) => n != null);
    if (emptyRecordIndices.length === 0) {
      return null;
    }
    return emptyRecordIndices;
  }

  private checkEmptyProfiles(records: UserProfile[]): number[] | null {
    const emptyProfileIndices = records
      .map((p, i) => (p == null ? i : null))
      .filter((n) => n != null);
    if (emptyProfileIndices.length === 0) {
      return null;
    }
    return emptyProfileIndices;
  }

  private async getAndSortProfiles(
    players: User[]
  ): Promise<PlayerProfilesAndRatioOrder | null> {
    const playerRecords = await Promise.all(
      players.map((p) => this.profileStore.get(p.id))
    );
    const emptyRecordPlayers = this.checkEmptyRecords(playerRecords)?.map(
      (n) => players[n]
    );
    if (emptyRecordPlayers != null) {
      await this.playersDoNotHaveActiveProfile(emptyRecordPlayers);
      return null;
    }

    const playerProfiles = playerRecords.map((p) => p.profiles[p.active]);
    const emptyProfilePlayers = this.checkEmptyProfiles(playerProfiles)?.map(
      (n) => players[n]
    );
    if (emptyProfilePlayers != null) {
      await this.playersDoNotHaveActiveProfile(emptyProfilePlayers);
      return null;
    }

    const indirectSortByRatio = Array(players.length)
      .fill(undefined)
      .map((_, i) => i)
      .sort((a, b) => playerProfiles[a].ratio - playerProfiles[b].ratio);

    return { ratioOrder: indirectSortByRatio, profiles: playerProfiles };
  }

  private getPlayerPosition(ratioOrder: number[]): number[] {
    switch (ratioOrder.length) {
      case ArrangePlayers.optimizedOrder4.length:
        return ArrangePlayers.optimizedOrder4.map((i) => ratioOrder[i]);
      case ArrangePlayers.optimizedOrder5.length:
        return ArrangePlayers.optimizedOrder5.map((i) => ratioOrder[i]);
      default:
        throw new Error("incorrect player number");
    }
  }

  private async parseOptions(): Promise<ArrangePlayersOptions> {
    const players = Array(5)
      .fill(undefined)
      .map((_, i) => this.interaction.options.getUser(`player${i + 1}`))
      .filter((u) => u != null);
    return { players };
  }

  async executeCommand(): Promise<void> {
    logger.debug("arrange players");
    let options: ArrangePlayersOptions;
    try {
      options = await this.parseOptions();
    } catch (e) {
      if (e === errParseOptions) {
        logger.warn({ command: this.interaction.toString() }, e.message);
        return await this.badRequest();
      }
      throw e;
    }
    const { players } = options;
    const { user } = this.interaction;
    logger.debug(
      { options: { players: players.map((p) => p.id) }, user: user.id },
      "arrange players options"
    );

    if (players.length < 4) {
      return await this.playerNotEnough();
    }

    const sortResult = await this.getAndSortProfiles(players);
    if (sortResult == null) {
      return;
    }
    const { ratioOrder, profiles } = sortResult;
    const position = this.getPlayerPosition(ratioOrder);
    const profileLines = position.map((n, i) => {
      const profileString = formatUserProfileWithIndex(profiles[n], i, 1);
      return `\`${profileString}\` ${players[n]}`;
    });

    logger.info("players arranged");
    await this.interaction.reply({
      content: ["推薦站位：", ...profileLines].join("\n"),
      allowedMentions: {
        users: [],
      },
    });
  }
}
