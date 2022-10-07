import type { OriginType } from "@prisma/client";

export interface CreateQuestionAndAnswerParams {
  readonly question: string;
  readonly answer: string;
  readonly originType: OriginType;
  readonly originId: string;
  readonly userId: string;
}
