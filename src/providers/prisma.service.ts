import { PrismaClient } from "@prisma/client";
import type { Consola } from "consola";
import { Service } from "typedi";

import LoggerService from "./logger.service";

@Service()
export default class PrismaService extends PrismaClient {
  private readonly logger: Consola;

  public constructor(private readonly loggerService: LoggerService) {
    super();
    this.logger = this.loggerService.make("prisma-service");

    this.$connect().catch((error: unknown) => this.logger.withTag("$connect").fatal(error));
  }
}
