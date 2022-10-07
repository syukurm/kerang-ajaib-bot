import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export default class PingCommand {
  @Slash({ name: "ping", description: "Ping the bot" })
  public async handleSlash(interaction: CommandInteraction): Promise<void> {
    const sent = await interaction.deferReply({ fetchReply: true });
    await interaction.editReply(`🏓 Pong: Latency is ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  }
}
