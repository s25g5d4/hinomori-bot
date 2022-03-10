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
import { InteractiveCommand } from "../interactive-command";
import { CatchExecuteError } from "../catch-execute-error";
import {
  EmptyActiveProfilesError,
  EmptyProfilesError,
  PlayerNotEnoughError,
} from "./arrange-errors";

interface ArrangePlayersOptions {
  players: User[];
}

export class ArrangePlayers extends InteractiveCommand {
  constructor(
    interaction: CommandInteraction,
    private profileStore: UserProfileStore,
    private mention: boolean
  ) {
    super(interaction);
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
      throw new EmptyProfilesError(emptyRecordPlayers, this.mention);
    }

    const playerProfiles = playerRecords.map((p) => p.profiles[p.active]);
    const emptyProfilePlayers = this.checkEmptyProfiles(playerProfiles)?.map(
      (n) => players[n]
    );
    if (emptyProfilePlayers != null) {
      throw new EmptyActiveProfilesError(emptyProfilePlayers, this.mention);
    }

    return playerProfiles;
  }

  private checkPlayerCount(players: User[]) {
    if (players.length < 4) {
      throw new PlayerNotEnoughError(players.length);
    }
  }

  private async parseOptions(): Promise<ArrangePlayersOptions> {
    const players = Array(5)
      .fill(undefined)
      .map((_, i) => this.interaction.options.getUser(`player${i + 1}`))
      .filter((u) => u != null);
    return { players };
  }

  @CatchExecuteError()
  async executeCommand(): Promise<void> {
    logger.debug("arrange players");
    const options = await this.parseOptions();

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

    this.checkPlayerCount(players);

    const profiles = await this.getActiveUserProfiles(players);
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
