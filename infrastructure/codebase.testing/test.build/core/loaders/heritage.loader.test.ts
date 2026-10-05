import { afterEach, describe, expect, it } from "vitest";
import { inheritedFiles, withInherited } from "@banes-lab/build-scripts/core/loaders/heritage.loader.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { readDiskFile } from "@banes-lab/build-scripts/core/loaders/structure.loader.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const CONFIG = "tsconfig.json";
const BASE = "tsconfig.base.json";

const scratch: string[] = [];

afterEach(() => {
    for (const dir of scratch.splice(0)) {
        rmSync(dir, { force: true, recursive: true });
    }
});

describe("inheritedFiles and withInherited", () => {
    it("follows a relative extends chain above the member and marks each file inherited, once", () => {
        const workspace = mkdtempSync(join(tmpdir(), "anatomy-heritage-"));
        scratch.push(workspace);
        const member = join(workspace, "member");
        writeVerbatim(join(workspace, BASE), JSON.stringify({ compilerOptions: {} }));
        writeVerbatim(join(workspace, CONFIG), JSON.stringify({ extends: `../${BASE}` }));
        const tree = {
            files: [{ ...readDiskFile(join(workspace, CONFIG), CONFIG, CONFIG), path: CONFIG }],
            folders: [],
            name: "",
            path: "",
            role: "member" as const,
        };
        const inherited = inheritedFiles(member, tree);
        expect(inherited.map((file) => file.name)).toStrictEqual([BASE]);
        expect(inherited[0]?.inherited).toBe(true);
        expect(withInherited(member, tree).files).toHaveLength(2);
        expect(withInherited(member, { ...tree, files: [] })).toStrictEqual({ ...tree, files: [] });
    });
});
