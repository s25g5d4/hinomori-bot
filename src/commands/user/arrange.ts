import { Command } from "../command";
import { CommandInteraction, MessageMentionOptions, User } from "discord.js";
import { UserProfileStore } from "../../store/user-profiles";
import { logger } from "../../logger";
import {
  formatUserProfile,
  UserProfile,
  UserProfileRecord,
} from "../../models/user-profile";
import { logUser } from "../../utils/log-user";
import { polePosition } from "../../models/pole-position";

const errParseOptions = new Error("failed to parse options");

interface ArrangePlayersOptions {
  players: User[];
}

class EmptyProfilesError extends Error {
  private static message = "empty profiles";
  constructor(public users: User[]) {
    super(EmptyProfilesError.message);
  }
}

export class ArrangePlayers implements Command {
  constructor(
    private profileStore: UserProfileStore,
    private interaction: CommandInteraction,
    private mention: boolean
  ) {}

  private async badRequest() {
    logger.info({ reason: "bad request" }, "arrange failed");
    await this.interaction.reply("格式不正確。");
  }

  private async playerNotEnough() {
    logger.info({ reason: "no enough players" }, "arrange failed");
    await this.interaction.reply("玩家人數不足四人，不建議開協力 LIVE。");
  }

  private async playersDoNotHaveActiveProfile(players: User[]) {
    logger.info(
      {
        reason: "some players do not have valid active profile",
        who: logUser(players),
      },
      "arrange failed"
    );
    const userString = players.map((u) => `${u} (${u.username})`).join(" ");
    await this.interaction.reply({
      content: `${userString} 沒有設定編組。請檢查使用者是否已新增編組、使用中編組設定是否正確。`,
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

  private async getActiveUserProfiles(players: User[]): Promise<UserProfile[]> {
    const playerRecords = await Promise.all(
      players.map((p) => this.profileStore.get(p.id))
    );
    const emptyRecordPlayers = this.checkEmptyRecords(playerRecords)?.map(
      (n) => players[n]
    );
    if (emptyRecordPlayers != null) {
      throw new EmptyProfilesError(emptyRecordPlayers);
    }

    const playerProfiles = playerRecords.map((p) => p.profiles[p.active]);
    const emptyProfilePlayers = this.checkEmptyProfiles(playerProfiles)?.map(
      (n) => players[n]
    );
    if (emptyProfilePlayers != null) {
      throw new EmptyProfilesError(emptyProfilePlayers);
    }

    return playerProfiles;
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
      {
        options: { players: players.map((p) => p.id) },
        mention: this.mention,
        user: logUser(user),
      },
      "arrange players options"
    );

    if (players.length < 4) {
      return await this.playerNotEnough();
    }

    let profiles: UserProfile[];
    try {
      profiles = await this.getActiveUserProfiles(players);
    } catch (err) {
      if (err instanceof EmptyProfilesError) {
        return await this.playersDoNotHaveActiveProfile(err.users);
      }
      throw err;
    }

    const position = polePosition(profiles);
    const skill6Player = profiles.reduce(
      (p, c, i, arr) => (arr[p].power > c.power ? p : i),
      0
    );
    const profileLines = position.map((n, i) => {
      const profileString = formatUserProfile(profiles[n]);
      const isSkill6 = n === skill6Player ? "*" : "";
      const prefix = `${isSkill6}${i + 1}: `.padStart(4);
      return `\`${prefix}${profileString}\` ${players[n].username}`;
    });

    const allowedMentions: MessageMentionOptions = this.mention
      ? undefined
      : { users: [] };
    logger.info("players arranged");
    await this.interaction.reply({
      content: [
        `推薦站位：${position.map((n) => players[n])}`,
        ...profileLines,
      ].join("\n"),
      allowedMentions,
    });
  }
}
