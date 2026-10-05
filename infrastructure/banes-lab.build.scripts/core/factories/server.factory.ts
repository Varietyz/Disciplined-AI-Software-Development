import { SITE_SERVER_LABEL, SOCIAL_SERVER_LABEL } from "#configuration/strings/server.strings";
import { type ViteDevServer, createServer } from "vite";
import type { DevServer } from "#types/server.types";
import { absolutePath } from "@ssot/paths";
import { portOf } from "@ssot/secrets";

const VITE_CONFIG = "vite.config.ts";

export const devServers = function devServers(): readonly DevServer[] {
    return [
        {
            args: ["--host"],
            config: absolutePath("app.member", VITE_CONFIG),
            label: SITE_SERVER_LABEL,
            port: portOf("SITE_DEV_PORT"),
        },
        {
            args: [],
            config: absolutePath("app.social", VITE_CONFIG),
            label: SOCIAL_SERVER_LABEL,
            port: portOf("SOCIAL_DEV_PORT"),
        },
    ];
};

export const moduleServer = async function moduleServer(root: string): Promise<ViteDevServer> {
    return createServer({
        appType: "custom",
        cacheDir: absolutePath("viteCache.modules"),
        configFile: false,
        logLevel: "error",
        root,
        server: { hmr: false, middlewareMode: true, ws: false },
    });
};
