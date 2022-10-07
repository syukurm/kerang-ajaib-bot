import type { QuestionAndAnswer } from "@prisma/client";
import { Service } from "typedi";

import PrismaService from "../../providers/prisma.service";
import KerangAjaibError from "../../shared/errors/KerangAjaibError";
import type { PromiseResult } from "../../shared/types";
import type { CreateQuestionAndAnswerParams } from "./questions-and-answers.interfaces";

@Service()
export default class QuestionsAndAnswersRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findOne(question: string): PromiseResult<QuestionAndAnswer> {
    try {
      const qna = await this.prismaService.questionAndAnswer.findUniqueOrThrow({ where: { question } });

      return [qna, null];
    } catch (error: unknown) {
      if (error instanceof Error) return [null, error];
      return [null, new KerangAjaibError("Something went wrong while trying to find QuestionAndAnswer", error)];
    }
  }

  public async create(args: CreateQuestionAndAnswerParams): PromiseResult<QuestionAndAnswer> {
    try {
      const qna = await this.prismaService.questionAndAnswer.create({ data: { ...args } });
      return [qna, null];
    } catch (error: unknown) {
      if (error instanceof Error) return [null, error];
      return [null, new KerangAjaibError("Something went wrong while trying to create QuestionAndAnswer", error)];
    }
  }

  public async bumpCount(question: string): PromiseResult<QuestionAndAnswer> {
    try {
      const [qna, error] = await this.findOne(question);

      if (error !== null) throw error;

      const updatedQna = await this.prismaService.questionAndAnswer.update({
        where: { question },
        data: { counts: qna.counts + 1 },
      });

      return [updatedQna, null];
    } catch (error: unknown) {
      if (error instanceof Error) return [null, error];
      return [null, new KerangAjaibError("Something went wrong while trying to bumpCount in QuestionAndAnswer", error)];
    }
  }
}
