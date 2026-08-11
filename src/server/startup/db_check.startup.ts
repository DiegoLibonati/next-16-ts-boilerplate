import { createConnection } from "node:net";

import { getEnvs } from "@/server/configs/env.config";
import { logger } from "@/server/configs/logger.config";

import { DB_PROBE_TIMEOUT_MS } from "@/server/constants/vars.constant";

function isPortReachable(host: string, port: number): Promise<boolean> {
  return new Promise<boolean>((resolve): void => {
    const socket = createConnection({ host, port, timeout: DB_PROBE_TIMEOUT_MS });

    const finish = (reachable: boolean): void => {
      socket.destroy();
      resolve(reachable);
    };

    socket.once("connect", (): void => {
      finish(true);
    });
    socket.once("timeout", (): void => {
      finish(false);
    });
    socket.once("error", (): void => {
      finish(false);
    });
  });
}

export async function warnIfDbUnreachable(): Promise<void> {
  try {
    const { hostname, port } = new URL(getEnvs().DATABASE_URL);
    const reachable = await isPortReachable(hostname, Number(port));

    if (reachable) return;

    logger.warn(
      `MongoDB is not reachable at ${hostname}:${port}. The app will start, but requests that hit the database will fail. ` +
        `Start it with "docker compose -f dev.docker-compose.yml up -d boilerplate-db" or point the MONGO_* env vars at a running instance.`
    );
  } catch {
    return;
  }
}
