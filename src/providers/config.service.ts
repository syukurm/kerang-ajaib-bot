import dotenv from "dotenv";
import { envsafe, num, str } from "envsafe";
import { Service } from "typedi";

interface EnvironmentVariables {
  readonly NODE_ENV: string;
  readonly BOT_TOKEN: string;
  readonly LOG_LEVEL: number;
  readonly OWNER_ID: string;
  readonly OWNER_GUILD_ID: string;
}

type NodeEnvironment = "development" | "test" | "production";

@Service()
export default class ConfigService implements EnvironmentVariables {
  public readonly NODE_ENV: NodeEnvironment;

  public readonly BOT_TOKEN: string;

  public readonly OWNER_ID: string;

  public readonly LOG_LEVEL: number;

  public readonly OWNER_GUILD_ID: string;

  public constructor() {
    dotenv.config();

    const config = envsafe<EnvironmentVariables>({
      NODE_ENV: str({
        devDefault: "development",
        choices: ["development", "test", "production"],
      }),
      BOT_TOKEN: str(),
      OWNER_ID: str(),
      LOG_LEVEL: num({
        default: 3,
        devDefault: 5,
        choices: [0, 1, 2, 3, 4, 5],
        desc: "Log level to use",
      }),
      OWNER_GUILD_ID: str(),
    });

    this.NODE_ENV = config.NODE_ENV as NodeEnvironment;
    this.BOT_TOKEN = config.BOT_TOKEN;
    this.LOG_LEVEL = config.LOG_LEVEL;
    this.OWNER_ID = config.OWNER_ID;
    this.OWNER_GUILD_ID = config.OWNER_GUILD_ID;
  }
}
