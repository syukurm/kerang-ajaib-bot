import consola, { Consola } from "consola";
import { Service } from "typedi";

import ConfigService from "./config.service";

@Service()
export default class LoggerService {
  public readonly loggerInstance: Consola;

  public constructor(configService: ConfigService) {
    this.loggerInstance = consola.create({
      level: configService.LOG_LEVEL,
    });
  }

  public make(scope: string, tag?: string): Consola {
    if (tag) return this.loggerInstance.withScope(scope).withTag(tag);
    return this.loggerInstance.withScope(scope);
  }
}
