import { NotBot } from "@discordx/utilities";
import { NotFoundError } from "@prisma/client/runtime";
import type { Consola } from "consola";
import { ActivityType, InteractionType } from "discord.js";
import { type ArgsOf, Client, Discord, Guard, On, Once } from "discordx";

import MagicConchCommand from "../commands/magic-conch.command";
import UsersRepository from "../models/users/users.repository";
import LoggerService from "../providers/logger.service";

@Discord()
export default class BotEvent {
  private readonly logger: Consola;

  public constructor(
    private readonly loggerService: LoggerService,
    private readonly usersRepository: UsersRepository,
    private readonly magicConchCommand: MagicConchCommand
  ) {
    this.logger = this.loggerService.make("bot-event");
  }

  @On({ event: "messageCreate" })
  @Guard(NotBot)
  public async handleMessageCreate([message]: ArgsOf<"messageCreate">): Promise<void> {
    const logger = this.logger.withTag("handle-message-create");

    const { id, tag } = message.author;

    try {
      const msg = message.content.toLowerCase();

      if (msg.startsWith("apakah ")) {
        logger.trace(`${tag}@${id} asked "${message.content}"`);

        const [user, error] = await this.usersRepository.findOne(id);

        if (error instanceof Error && !(error instanceof NotFoundError)) throw error;

        if (user === null) {
          const [, newUserError] = await this.usersRepository.create(id, tag);

          if (newUserError !== null) throw newUserError;
        } else {
          await this.usersRepository.bumpCount(user.id);
        }

        await this.magicConchCommand.run(message);
      }
    } catch (error: unknown) {
      logger.error(error);
    }
  }

  @On({ event: "interactionCreate" })
  @Guard(NotBot)
  public async handleInteractionCreate([interaction]: ArgsOf<"interactionCreate">, client: Client): Promise<void> {
    const logger = this.logger.withTag("handle-interaction-create");

    const { id, tag } = interaction.user;

    const interactionType = this.getInteractionType(interaction.type);

    logger.trace(`${tag}@${id} made an interaction with type of ${interactionType}`);

    client.executeInteraction(interaction);
  }

  @Once({ event: "ready" })
  public async handleReady(_: ArgsOf<"ready">, client: Client): Promise<void> {
    const logger = this.logger.withTag("handle-ready");
    try {
      // Make sure all guilds are cached
      const guilds = await client.guilds.fetch();

      // Synchronize applications commands with Discord
      await client.initApplicationCommands();

      // To clear all guild commands, uncomment this line,
      // This is useful when moving from guild commands to global commands
      // It must only be executed once
      //
      //  await bot.clearApplicationCommands(
      //    ...bot.guilds.cache.map((g) => g.id)
      //  );

      if (client.user === null) {
        logger.warn("Bot's tag is null");
      }

      const FIVE_MINUTES_IN_MILLISECONDS = 300_000;

      client.user?.setActivity(`${guilds.size} servers`, { type: ActivityType.Watching });

      setInterval(() => {
        client.user?.setActivity(`${guilds.size} servers`, { type: ActivityType.Watching });
      }, FIVE_MINUTES_IN_MILLISECONDS);

      logger.success(`Logged in as ${client.user?.tag ?? "?"}!`);
    } catch (error: unknown) {
      logger.fatal("Something went wrong while trying to initialize the bot", error);
    }
  }

  @On({ event: "warn" })
  public handleDebug([message]: ArgsOf<"warn">): void {
    this.logger.withTag("debug").warn(message);
  }

  @On({ event: "error" })
  public handleError([error]: ArgsOf<"error">): void {
    this.logger.withTag("error").error(error.name, error);
  }

  private getInteractionType(interaction: InteractionType): keyof typeof InteractionType | "UnknownInteractionType" {
    return (
      (Object.keys(InteractionType)[Object.values(InteractionType).indexOf(interaction)] as
        | keyof typeof InteractionType
        | undefined) ?? "UnknownInteractionType"
    );
  }
}
