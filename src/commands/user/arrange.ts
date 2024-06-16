import { CommandInteraction, MessageMentionOptions, User } from "discord.js";
import { Logger } from "pino";
import { isNil } from "lodash";
import { UserProfileStore } from "src/store/user-profiles";
import {
  formatUserProfile,
  UserProfile,
  userProfileRatio,
  UserProfileRecord,
} from "src/models/user-profile";
import { polePosition } from "src/models/pole-position";
import { logUser } from "src/utils/log-user";
import { defaultVersion } from "src/models/profile-ratio";
import { InteractiveCommand, NullOptionError } from "../interactive-command";
import { CatchExecuteError } from "../catch-execute-error";
import {
  EmptyActiveProfilesError,
  EmptyProfilesError,
  PlayerNotEnoughError,
} from "./arrange-errors";

interface DedupedPlayers {
  players: User[];
  hasDuplicatedPlayers: boolean;
}

interface ArrangePlayersOptions {
  players: User[];
}

export class ArrangePlayers extends InteractiveCommand {
  constructor(
    private l: Logger,
    interaction: CommandInteraction,
    private profileStore: UserProfileStore,
    private mention: boolean,
  ) {
    super(interaction);
  }

  private checkEmptyRecords(records: UserProfileRecord[]): number[] | null {
    const emptyRecordIndices = records
      .map((p, i) => (isNil(p) ? i : null))
      .filter((n) => n != null);
    if (emptyRecordIndices.length === 0) {
      return null;
    }
    return emptyRecordIndices;
  }

  private checkEmptyProfiles(records: UserProfile[]): number[] | null {
    const emptyProfileIndices = records
      .map((p, i) => (isNil(p) ? i : null))
      .filter((n) => n != null);
    if (emptyProfileIndices.length === 0) {
      return null;
    }
    return emptyProfileIndices;
  }

  private async getActiveUserProfiles(
    guild: string,
    players: User[],
  ): Promise<UserProfile[]> {
    const playerRecords = await Promise.all(
      players.map((p) => this.profileStore.get(guild, p.id)),
    );
    const emptyRecordPlayers = this.checkEmptyRecords(playerRecords)?.map(
      (n) => players[n],
    );
    if (emptyRecordPlayers != null) {
      throw new EmptyProfilesError(emptyRecordPlayers, this.mention);
    }

    const playerProfiles = playerRecords.map((p) => p.profiles[p.active]);
    const emptyProfilePlayers = this.checkEmptyProfiles(playerProfiles)?.map(
      (n) => players[n],
    );
    if (emptyProfilePlayers != null) {
      throw new EmptyActiveProfilesError(emptyProfilePlayers, this.mention);
    }

    return playerProfiles;
  }

  private checkDuplicatedPlayers(players: User[]): DedupedPlayers {
    const map = new Map(players.map((p) => [p.id, p]));
    const hasDuplicatedPlayers = map.size !== players.length;
    players = Array.from(map.values());
    if (hasDuplicatedPlayers) {
      this.l.info("has duplicated players");
    }
    return {
      players,
      hasDuplicatedPlayers,
    };
  }

  private checkPlayerCount(players: User[], hasDuplicatedPlayers: boolean) {
    if (players.length < 4) {
      throw new PlayerNotEnoughError(players.length, hasDuplicatedPlayers);
    }
  }

  private getPlayer(index: number): User {
    try {
      const user = this.getUserOption(`player${index + 1}`);
      return user;
    } catch (err) {
      if (err instanceof NullOptionError) {
        return null;
      }
      throw err;
    }
  }

  private async parseOptions(): Promise<ArrangePlayersOptions> {
    const players = Array(5)
      .fill(undefined)
      .map((_, i) => this.getPlayer(i))
      .filter((u) => !isNil(u));
    return { players };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    this.l.debug("arrange players");
    const options = await this.parseOptions();

    let { players } = options;
    const { guild } = this.interaction;
    this.l.debug(
      {
        options: { players: logUser(players) },
        mention: this.mention,
      },
      "arrange players options",
    );

    const deduped = this.checkDuplicatedPlayers(players);
    players = deduped.players;
    const { hasDuplicatedPlayers } = deduped;
    this.checkPlayerCount(players, hasDuplicatedPlayers);

    const profiles = await this.getActiveUserProfiles(guild.id, players);
    const ratios = profiles.map((p) => userProfileRatio(p, defaultVersion));
    const position = polePosition(ratios);
    const skill6Player = profiles.reduce(
      (p, c, i, arr) => (arr[p].power > c.power ? p : i),
      0,
    );
    const profileLines = position.map((n, i) => {
      const profileString = formatUserProfile(profiles[n], defaultVersion);
      const isSkill6 = n === skill6Player ? "*" : "";
      const prefix = `${isSkill6}${i + 1}: `.padStart(4);
      return `\`${prefix}${profileString}\` ${players[n].username}`;
    });
    const replyLines: string[] = [];
    if (hasDuplicatedPlayers) {
      replyLines.push("已過濾重複的玩家。");
    }
    replyLines.push(
      `推薦站位：${position.map((n) => players[n])}`,
      ...profileLines,
    );

    const allowedMentions: MessageMentionOptions = this.mention
      ? undefined
      : { users: [] };
    this.l.info("players arranged");
    await this.interaction.reply({
      content: replyLines.join("\n"),
      allowedMentions,
    });
  }
}
