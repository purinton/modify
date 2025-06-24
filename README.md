# [![Purinton Dev](https://purinton.us/logos/brand.png)](https://discord.gg/QSBxQnX7PF)

## @purinton/modify [![npm version](https://img.shields.io/npm/v/@purinton/modify.svg)](https://www.npmjs.com/package/@purinton/modify)[![license](https://img.shields.io/github/license/purinton/modify.svg)](LICENSE)[![build status](https://github.com/purinton/modify/actions/workflows/nodejs.yml/badge.svg)](https://github.com/purinton/modify/actions)

A modern Discord moderation and utility bot built with Node.js, based on the [@purinton/discord](https://github.com/purinton/discord) foundation. It provides advanced moderation using OpenAI, multi-language support, and a modular command/event system for easy customization.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running as a Service (systemd)](#running-as-a-service-systemd)
- [Docker](#docker)
- [Customization](#customization)
  - [Commands](#commands)
  - [Events](#events)
  - [Locales](#locales)
- [Testing](#testing)
- [Support](#support)
- [License](#license)

## Features

- Discord.js-based app with ESM support (native ES modules)
- Modular command and event handler architecture for easy extension
- Multi-language/localized responses with JSON locale files
- AI-powered moderation using OpenAI's moderation API (text and image support)
- Environment variable support via dotenv for secure configuration
- Logging and signal handling via `@purinton/common`
- Ready for deployment with systemd or Docker
- Jest for unit and integration testing
- Database support for log channels and localization (MySQL)
- Easy to add or modify commands, events, and languages

## Getting Started

1. **Clone this project:**

   ```bash
   git clone https://github.com/purinton/modify.git
   cd modify
   npm install
   ```

2. **Set up your environment:**
   - Copy `.env.example` to `.env` and fill in your Discord app token, OpenAI key, and database credentials.

3. **Start the app locally:**

   ```bash
   npm start
   # or
   node modify.mjs
   ```

## Configuration

- All configuration is handled via environment variables in the `.env` file.
- Required variables include your Discord bot token, OpenAI API key, and MySQL database connection info.
- See `.env.example` for required and optional variables.
- **Before running the bot, you must create the required database table.**

### Database Setup

The bot requires a MySQL table named `log_channels` for logging moderation events and storing guild locales. This table is not created automatically.

To create the table, import the provided `schema.sql` file into your MySQL database:

```bash
mysql -u <username> -p <database> < schema.sql
```

Replace `<username>` and `<database>` with your MySQL username and database name. You will be prompted for your password.

The `schema.sql` file contains:

```sql
DROP TABLE IF EXISTS `log_channels`;
CREATE TABLE `log_channels` (
  `guild_id` varchar(32) NOT NULL,
  `channel_id` varchar(32) NOT NULL,
  `guild_locale` varchar(12) NOT NULL,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## Running as a Service (systemd)

1. Copy `modify.service` to `/usr/lib/systemd/system/modify.service`.
2. Edit the paths and user/group as needed.
3. Reload systemd and start the service:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable modify
   sudo systemctl start modify
   sudo systemctl status modify
   ```

## Docker

1. Build the Docker image:

   ```bash
   docker build -t modify .
   ```

2. Run the container:

   ```bash
   docker run --env-file .env modify
   ```

## Customization

### Commands

- Add new commands in the `commands/` directory.
- Each command has a `.json` definition (for Discord registration/localization) and a `.mjs` handler (for logic).
- Example: To add a new moderation command, create `commands/yourcommand.json` and `commands/yourcommand.mjs`.

### Events

- Add or modify event handlers in the `events/` directory.
- Each Discord event (e.g., `ready`, `messageCreate`, `interactionCreate`) has its own handler file.
- You can add support for new Discord Gateway events by adding a new handler file.

### Locales

- Add or update language files in the `locales/` directory.
- Localize command names, descriptions, and app responses.
- All locale files must match the keys in `en-US.json` for consistency.

## Testing

- Run tests with:

  ```bash
  npm test
  ```

- Add your tests in the `tests/` folder or alongside your code.
- Jest is configured for ESM and will automatically find `.test.mjs` files.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://purinton.us/logos/discord_96.png)](https://discord.gg/QSBxQnX7PF)[![Purinton Dev](https://purinton.us/logos/purinton_96.png)](https://discord.gg/QSBxQnX7PF)

**[Purinton Dev on Discord](https://discord.gg/QSBxQnX7PF)**

## License

[MIT © 2025 Russell Purinton](LICENSE)

## Links

- [GitHub Repo](https://github.com/purinton/modify)
- [GitHub Org](https://github.com/purinton)
- [GitHub Personal](https://github.com/rpurinton)
- [Discord](https://discord.gg/QSBxQnX7PF)
