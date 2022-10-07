import type { Consola } from "consola";
import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";

import LoggerService from "../providers/logger.service";

@Discord()
export default class GuildEvent {
  private readonly logger: Consola;

  public constructor(private readonly loggerService: LoggerService) {
    this.logger = this.loggerService.make(GuildEvent.name);
  }

  @On({ event: "guildCreate" })
  public handleGuildCreate([guild]: ArgsOf<"guildCreate">, client: Client): void {
    this.logger.withTag("guildCreate").log(`${client.user?.username ?? "Bot"} joined ${guild.name}`);
  }
}
