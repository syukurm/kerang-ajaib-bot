import { OriginType } from "@prisma/client";
import { NotFoundError } from "@prisma/client/runtime";
import type { Consola } from "consola";
import { ChannelType, Message } from "discord.js";
import { Service } from "typedi";

import QuestionsAndAnswersRepository from "../models/questions-and-answers/questions-and-answers.repository";
import LoggerService from "../providers/logger.service";

@Service()
export default class MagicConchCommand {
  public readonly logger: Consola;

  public constructor(
    private readonly loggerService: LoggerService,
    private readonly qnaRepository: QuestionsAndAnswersRepository
  ) {
    this.logger = this.loggerService.make("magic-conch-command");
  }

  public async run(message: Message): Promise<void> {
    const logger = this.logger.withTag("run");

    try {
      const question = message.content.toLowerCase();

      const [qna, error] = await this.qnaRepository.findOne(question);

      if (error instanceof Error && !(error instanceof NotFoundError)) throw error;

      let answer: string;

      if (qna === null) {
        answer = Math.random() < 0.5 ? "Iya" : "Tidak";
        const originType = message.channel.type === ChannelType.DM ? OriginType.DM : OriginType.GUILD;
        const originId = originType === OriginType.DM ? message.author.id : message.guildId ?? "UNKNOWN";

        await this.qnaRepository.create({
          question,
          answer,
          originType,
          originId,
          userId: message.author.id,
        });
      } else {
        await this.qnaRepository.bumpCount(question);

        answer = qna.answer;
      }
      await message.reply(answer);
    } catch (error: unknown) {
      logger.error(error);
    }
  }
}
