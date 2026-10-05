import { RUNNER_MODULES, WHOLE } from "@banes-lab/build-scripts/configuration/constants/loader.constants.ts";
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

const WEB_PACKAGE = "@banes-lab/web/";
const MEMBER = absolutePath("app.member");

const fileOf = (path: string): string => join(MEMBER, path.slice(WEB_PACKAGE.length));

const declares = (source: string, name: string): boolean =>
    [" ", ":"].some((after) => source.includes(`export const ${name}${after}`));

describe("RUNNER_MODULES", () => {
    const modules = Object.entries(RUNNER_MODULES);

    it("names a web member file for every module the build loads through the runner", () => {
        for (const [, module] of modules) {
            expect(module.path.startsWith(WEB_PACKAGE)).toBe(true);
            expect(existsSync(fileOf(module.path))).toBe(true);
        }
    });

    it("declares only names the module exports, so a rename in the web member fails here", () => {
        for (const [key, module] of modules) {
            if (module.names === WHOLE) {
                continue;
            }
            const source = readFileSync(fileOf(module.path), "utf8");
            for (const name of module.names) {
                expect(declares(source, name), `${key}: ${name}`).toBe(true);
            }
        }
    });

    it("gives every module one entry", () => {
        const paths = modules.map(([, module]) => module.path);
        expect(new Set(paths).size).toBe(paths.length);
    });
});
