import { type PortKey, portOf } from "@ssot/secrets";
import type { Plugin } from "vite";
import { devCertificate } from "#core/factories/certificate.factory";

const PLUGIN_NAME = "banes-lab-dev-port";
const SERVE_COMMAND = "serve";

export const devPortPlugin = function devPortPlugin(key: PortKey): Plugin {
    return {
        config: async (_config, environment) =>
            environment.command === SERVE_COMMAND
                ? { server: { https: await devCertificate(), port: portOf(key), strictPort: true } }
                : null,
        name: PLUGIN_NAME,
    };
};
