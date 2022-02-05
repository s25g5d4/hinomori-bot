# Hinomori Bot

Hinomori Bot is an Discord bot for storing PJSK player's card profiles and
arranging pole position for rushing the event rank.

## Usage

Install dependencies:

```
npm install
```

Build sources:

```
npm run build
```

Then start the app:

```
npm run start
```

## Deploy Slash Commands to Guild

Hinomori is still in its early stage. It does not have any global command now.
For faster development, we use guild command to quickly deploy commands to a
single guild.

To use Hinomori in your guild, make sure you setup the correct client id and
guild id in `.env`, and run `deploy-commands.js` to deploy commands.
