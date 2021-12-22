# DiscordAttendanceBot
> This bot is used on the ACM@UIC discord

> This bot does require a mongodb database backend

> Docker image here -> https://hub.docker.com/r/christianbingman/discord-bot

View the [Docs](https://htmlpreview.github.io/?https://raw.githubusercontent.com/acm-uic/DiscordAttendanceBot/main/docs/index.html)

## Features
✔ **API Documentation with JSDocs**

✔ **Logging of Authenticated Requests**

✔ **Multi-arch Docker Image christianbingman/discord-bot**

✔ **Simple Builds with Included NPM Commands**

✔ **Included dev environment in /dev-environment**

✔ **Included Docker Compose to Build the Entire API Stack Quickly**

## Environment Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `ADDRESS` | `mongodb://127.0.0.1:27017` | The Address which the API will connect to the database |
| `DB` | `website` | The database name |
| `DBUSER` | `root` | The database username |
| `DBPASS` | `example` | The database password |
| `PORT` | `8000` | The port the API will be available on |
| `TOKEN` |  | Discord Bot API Token |
| `CLIENTID` |  | Discord OAUTH2 Client ID |
| `GUILDID` |  | Discord Guild ID |
| `ADMINROLEID` |  | Discord Admin Role ID |
| `MODROLEID` |  | Discord Moderator Role ID |
| `ENVIRONMENT` | `development` | development/production determines whether to use GuildID |
| `LEVEL1ROLEID` |  | Role ID for level one attendance |
| `LEVEL2ROLEID` |  | Role ID for level two attendance |
| `LEVEL3ROLEID` |  | Role ID for level three attendance |
| `LEVEL4ROLEID` |  | Role ID for level four attendance |

## Images

![BotCommands](images/BotCommands.png?raw=true "Bot Commands")

## Running the Bot
> You will need to set up an application through the discord developer portal, and add it to your discord bot permissions.

> This bot requires the permissions Bot, applications.commands, Manage Roles, Send Messages, Manage Messages, and Read Messages/View Channels

### Running the full stack application
> This will run a mongodb server with the bot

You will need to create a `.env` file in the root directory with the necessary environment variables included.

```bash
npm install
npm run build
docker-compose up
```

### Seting up the dev environment
> This will set up a mongodb server with mongo-express to easily view the database.

> The development environment requires Docker, and Docker-Compose

```bash
cd dev-environment
docker-compose up
```

### Running the API Server

```bash
npm install
npm start
```

### Building the API and Docs

```bash
npm install
npm run build
```

#### Cleaning the build

```bash
npm run clean
```

## Docker
> Please see [building](#building-the-api-and-docs) before running docker commands

### Building a docker image

```bash
npm run dockerbuild
```

### Building a docker multi-arch image
> You will need to change the name of the docker image in the `package.json`

```bash
docker buildx create --name multiarchbuilder --use
npm run dockerbuildmultiarch
```

## Extending the functionality

Included is the `Middleware` class of the `middleware.ts` file. This class has several functions that handles accepting users, and handling starting/resetting of events. This can be extended to check calendars or other sources! For more information please check the [docs](https://htmlpreview.github.io/?https://github.com/acm-uic/DiscordAttendanceBot/blob/main/docs/middleware.js.html)

## Troubleshooting
`Docker unable to find dist`
+ Make sure that **npm run build** is run before any docker commands

#### AUTHORS
- Christian Bingman

#### NOTICE
Copyright (c) ACM@UIC. All Rights Reserved