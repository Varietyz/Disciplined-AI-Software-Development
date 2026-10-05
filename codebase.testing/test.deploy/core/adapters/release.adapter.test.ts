import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { ARCHIVE_BINARY } from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { buildRelease, packFolder } from "@banes-lab/deploy/core/adapters/release.adapter.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("packFolder", () => {
    it("packs every file of a folder, dot-named folders included, relative to the folder", async () => {
        const root = mkdtempSync(join(tmpdir(), "pack-"));
        const source = join(root, "web");
        mkdirSync(join(source, ".hidden"), { recursive: true });
        writeVerbatim(join(source, "a.html"), "a");
        writeVerbatim(join(source, ".hidden", "b.js"), "b");
        const archive = join(root, "site.tar.gz");
        await packFolder(source, archive);
        const listed = execFileSync(ARCHIVE_BINARY, ["-tzf", "site.tar.gz"], { cwd: root, encoding: "utf8" });
        rmSync(root, { force: true, recursive: true });
        expect(listed).toContain("a.html");
        expect(listed).toContain(".hidden/b.js");
    });
});

describe("buildRelease", () => {
    it("runs the build in its own process and reports a failing exit", async () => {
        const root = mkdtempSync(join(tmpdir(), "build-"));
        const ended = await buildRelease(root);
        rmSync(root, { force: true, recursive: true });
        expect(ended.signal).toBeNull();
        expect(ended.code).not.toBe(0);
    }, 60_000);
});
