import { DEV_ARGV } from "#configuration/constants/server.constants";
import { devServers } from "#core/factories/server.factory";
import { freePort } from "#core/adapters/server.adapter";
import process from "node:process";
import { resolveArgv } from "@govlab/argv";
import { superviseServers } from "#core/coordinators/server.coordinator";

resolveArgv(DEV_ARGV);

const servers = devServers();
await Promise.all(servers.map(async (server) => freePort(server.port)));
const supervisor = superviseServers(servers);

process.on("SIGINT", () => {
    supervisor.stop(0);
});
process.on("SIGTERM", () => {
    supervisor.stop(0);
});
