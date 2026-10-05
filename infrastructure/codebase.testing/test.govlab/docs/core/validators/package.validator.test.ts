import { afterAll, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { deadScriptRefs } from "@govlab/docs/core/validators/package.validator.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "doc-scripts-"));
mkdirSync(join(root, "bin"), { recursive: true });
writeVerbatim(join(root, "bin", "real.ts"), "");
const PKG = join(root, "package.json");
writeVerbatim(
    PKG,
    JSON.stringify({
        scripts: {
            build: "node bin/real.ts && node 'bin/gone.ts'",
            glob: "node bin/*.ts",
            vendor: "node node_modules/x/cli.js",
        },
    }),
);

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("deadScriptRefs", () => {
    it("reports a script path that does not exist and skips globs and vendored paths", () => {
        expect(deadScriptRefs(PKG)).toStrictEqual([{ path: "bin/gone.ts", script: "build" }]);
        expect(deadScriptRefs(join(root, "absent.json"))).toStrictEqual([]);
    });
});
