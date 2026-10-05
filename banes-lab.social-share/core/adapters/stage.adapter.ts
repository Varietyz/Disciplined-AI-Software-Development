import type { LoadedCards, StageServer } from "#types/stage.types";
import { type ViteDevServer, createServer, createServerModuleRunner } from "vite";
import { STAGE_MODE } from "#configuration/constants/card.constants";
import { devCertificate } from "@banes-lab/build-scripts/core/factories/certificate.factory.ts";
import { fileURLToPath } from "node:url";
import { holdCaptureLock } from "#core/persistence/export.persistence";
import { stageUnaddressed } from "#configuration/strings/card.strings";

interface LoaderModule {
    readonly loadCards: () => LoadedCards;
}

const LOOPBACK = "127.0.0.1";
const SECURE_SCHEME = "https://";
const PORT_MARK = ":";
const PATH_END = "/";
const SYSTEM_ASSIGNED = 0;

const locationOf = function locationOf(specifier: string): string {
    return fileURLToPath(import.meta.resolve(specifier));
};

const listenedPort = function listenedPort(server: ViteDevServer): number {
    const address = server.httpServer?.address();
    if (address === null || address === undefined || typeof address === "string") {
        throw new Error(stageUnaddressed(String(address)));
    }
    return address.port;
};

export const openStage = async function openStage(listen: boolean): Promise<StageServer> {
    const release = listen ? holdCaptureLock() : (): void => undefined;
    const server = await createServer({
        appType: listen ? "spa" : "custom",
        configFile: locationOf("@banes-lab/social-share/vite.config.ts"),
        logLevel: "error",
        mode: STAGE_MODE,
        server: listen
            ? {
                  hmr: false,
                  host: LOOPBACK,
                  https: await devCertificate(),
                  port: SYSTEM_ASSIGNED,
                  strictPort: true,
                  watch: null,
              }
            : { hmr: false, middlewareMode: true, ws: false },
    });
    if (listen) {
        await server.listen();
    }
    const runner = createServerModuleRunner(server.environments.ssr);
    const address = listen ? PORT_MARK + String(listenedPort(server)) : "";
    return {
        cards: async (): Promise<LoadedCards> =>
            (await runner.import<LoaderModule>(locationOf("#core/loaders/card.loader"))).loadCards(),
        close: async (): Promise<void> => {
            try {
                await runner.close();
                await server.close();
            } finally {
                release();
            }
        },
        url: SECURE_SCHEME + LOOPBACK + address + PATH_END,
    };
};
