import { IntentsBitField, Partials } from "discord.js";
import { Client } from "discordx";

export default class Bot {
  private readonly client: Client;

  public constructor(ownerGuildId: string) {
    this.client = new Client({
      partials: [Partials.Channel, Partials.Message],

      // Discord intents
      intents: [
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
      ],

      // Debug logs are disabled in silent mode
      silent: false,

      botGuilds: [ownerGuildId],
    });
  }

  public async login(token: string): Promise<void> {
    await this.client.login(token);
  }
}
