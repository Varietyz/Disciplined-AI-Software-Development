import { STAGE_MODE } from "#configuration/constants/card.constants";
import { absolutePath } from "@ssot/paths";
import { defineConfig } from "vite";
import { devCertificate } from "@banes-lab/build-scripts/core/factories/certificate.factory.ts";
import { devPortPlugin } from "@banes-lab/build-scripts/core/plugins/server.plugin.ts";

export default defineConfig(async ({ mode }) => ({
    cacheDir: absolutePath("viteCache.social"),
    plugins: mode === STAGE_MODE ? [] : [devPortPlugin("SOCIAL_DEV_PORT")],
    publicDir: absolutePath("app.public"),
    root: absolutePath("app.social"),
    server: { https: await devCertificate(), strictPort: true },
}));
