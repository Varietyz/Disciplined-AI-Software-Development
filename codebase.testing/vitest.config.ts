import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { relativePath } from "@ssot/paths";

const TESTS = relativePath("codebase.testing");
const WEB_TESTS = relativePath("codebase.testing.app");
const WEB_SETUP = [`${WEB_TESTS}/core/loaders/stylesheet.fixture.ts`];
const SOCIAL_TESTS = relativePath("codebase.testing.social");
const DOCUMENT_TESTS = [`${SOCIAL_TESTS}/core/renderers/**/*.test.ts`, `${SOCIAL_TESTS}/core/timers/**/*.test.ts`];

export default defineConfig({
    root: fileURLToPath(new URL("../", import.meta.url)),
    test: {
        globals: false,
        hookTimeout: 30_000,
        projects: [
            {
                extends: true,
                test: {
                    environment: "node",
                    exclude: [`${WEB_TESTS}/**`, ...DOCUMENT_TESTS],
                    include: [`${TESTS}/**/*.test.ts`],
                    name: "node",
                },
            },
            { extends: true, test: { environment: "jsdom", include: DOCUMENT_TESTS, name: "stage" } },
            {
                extends: true,
                test: {
                    environment: "jsdom",
                    include: [`${WEB_TESTS}/**/*.test.ts`],
                    name: "web",
                    setupFiles: WEB_SETUP,
                },
            },
        ],
        reporters: ["default"],
        testTimeout: 30_000,
    },
});
