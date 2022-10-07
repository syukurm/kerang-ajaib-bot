import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import { DIService, typeDiDependencyRegistryEngine } from "discordx";
import { Container, Service } from "typedi";

import Bot from "./bot";
import ConfigService from "./providers/config.service";
import LoggerService from "./providers/logger.service";

const logger = Container.get(LoggerService).make("bot", "start");

process.on("unhandledRejection", (reason) => {
  logger.error(reason);
});

async function run(): Promise<void> {
  DIService.engine = typeDiDependencyRegistryEngine.setService(Service).setInjector(Container);

  const config = Container.get(ConfigService);

  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  logger.start("Starting the bot");
  const bot = new Bot(config.OWNER_GUILD_ID);
  await bot.login(config.BOT_TOKEN);
  logger.ready("Bot started");
}

await run().catch((error: unknown) => {
  logger.fatal(error);
  throw error;
});
