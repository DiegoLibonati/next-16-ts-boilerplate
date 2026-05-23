import pino from "pino";

import { getEnvs } from "@/server/configs/env.config";

const envs = getEnvs();
const isDev = envs.ENV === "development";

export const logger = pino({
  level: envs.LOG_LEVEL,
  ...(isDev
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard", ignore: "pid,hostname" },
        },
      }
    : {}),
});
