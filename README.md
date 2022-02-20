# Hinomori Bot

Hinomori Bot is an Discord bot for storing PJSK player's card profiles and
arranging pole position for rushing the event rank.

## Prerequisite

- Node.js 16
- A Discord application and bot
  - Scopes: `bot`, `applications.commands`
  - Bot permissions: `Send Messages`, `Send Messages in Threads`
- A Google Firebase Firestore project
  - Get Firebaes Admin SDK credentials JSON for database authentication

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Build sources:

   ```
   npm run build
   ```

3. Setup environment variables. See Environment Variables section below for
   more details.

4. Deploy command:

   - For production use, we recommand deploying global commands:
     ```
     node ./build/scripts/deploy-global-commands.js
     ```
   - For development use, you can deploy guild commands only. You have to setup
     `DISCORD_GUILD_ID` variable to deploy the commands.
     ```
     node ./build/scripts/deploy-commands.js
     ```

5. Start the app:
   ```
   npm run start
   ```

## Environment Variables

- `DISCORD_BOT_TOKEN`: The bot token. You can get it in the bot settings page.
- `DISCORD_CLIENT_ID`: Your Discord application id.
- `DISCORD_GUILD_ID`: Used only when deploying guild commands. Doesn't need in
  production use. See Discord's [Where can I find my User/Server/Message ID?](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
  for more information.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Firebase Admin SDK credentials file.

Hinomori Bot uses [dotenv](https://www.npmjs.com/package/dotenv) to load
env variables from `.env` file. You can edit the `.env.example` and rename it to
`.env` to enable env variables.
