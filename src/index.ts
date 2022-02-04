// Require the necessary discord.js classes
import { Client, Intents } from "discord.js";
import { config } from "./config";

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

enum UserProfileType {
  Runner,
  Helper,
}

function convertToUserProfileType(type: string): UserProfileType {
  switch (type[0].toLowerCase()) {
    case "r":
      return UserProfileType.Runner;
    case "h":
      return UserProfileType.Helper;
    default:
      throw new Error("bad type");
  }
}

interface UserProfile {
  type: UserProfileType;
  ratio: number;
  power: number;
}

interface UserProfileRecord {
  profiles: UserProfile[];
  active: number;
}

const userProfileRecords = new Map<string, UserProfileRecord>([
  [
    "exampleUser",
    {
      profiles: [
        { type: "r", ratio: 4.67, power: 230541 },
        ...Array(9).fill(null),
      ],
      active: 0,
    },
  ],
]);

function formatUserProfileRecord(record: UserProfileRecord) {
  const profileString = (p: UserProfile, i: number) => {
    const index = i + 1;
    const type = UserProfileType[p.type];
    const power = Math.round(p.power / 1000) / 10;
    const ratio = Math.round(p.ratio * 100) / 100;
    return `${index}: ${type} 綜合力: ${power}w 倍率: ${ratio}`;
  };
  const profileLines = record.profiles
    .map((p, i) => p && profileString(p, i))
    .filter((p) => !!p);

  return [`使用中的設定: ${record.active + 1}`, ...profileLines].join("\n");
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const badRequest = async () => {
    await interaction.reply("bad request");
  };

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "update_profile") {
    const type = interaction.options.getString("type");
    if (typeof type !== "string") {
      return await badRequest();
    }
    let userProfileType: UserProfileType;
    try {
      userProfileType = convertToUserProfileType(type);
    } catch (e) {
      console.error("failed to convert user profile type", e);
      return await badRequest();
    }

    const cards = Array(5)
      .fill(undefined)
      .map((_, i) => interaction.options.getNumber(`card${i + 1}`));
    if (
      cards.some((n) => typeof n !== "number" || isNaN(n) || n < 0 || n > 130)
    ) {
      return await badRequest();
    }
    const ratio = [
      100 + cards[0],
      100 + cards[1] / 5,
      100 + cards[2] / 5,
      100 + cards[3] / 5,
      100 + cards[4] / 5,
    ]
      .map((p) => p / 100)
      .reduce((p, c) => p * c);

    const power = interaction.options.getNumber("power");
    if (typeof power !== "number" || isNaN(power)) {
      return await badRequest();
    }

    const index = interaction.options.getNumber("index") ?? 1;
    if (isNaN(index) || index < 1 || index > 10) {
      return await badRequest();
    }

    const newProfile: UserProfile = {
      type: userProfileType,
      ratio,
      power,
    };

    const user = interaction.user.id;
    let userProfileRecord = userProfileRecords.get(user);
    if (!userProfileRecord) {
      userProfileRecord = {
        profiles: Array(10).fill(null),
        active: 0,
      };
    }
    const newProfiles = [...userProfileRecord.profiles];
    newProfiles[index - 1] = newProfile;
    userProfileRecord = { ...userProfileRecord, profiles: newProfiles };
    userProfileRecords.set(user, userProfileRecord);

    await interaction.reply(
      [
        "已更新。你的編組資料：",
        "```",
        formatUserProfileRecord(userProfileRecord),
        "```",
      ].join("\n")
    );
  }
});

// Login to Discord with your client's token
client.login(config.token);

/**
/update_profile type:r power:232477 card1:130 card2:115 card3:110 card4:110 card5:110
/update_profile type:r power:261020 card1:130 card2:115 card3:110 card4:100 card5:100 index:2
*/
