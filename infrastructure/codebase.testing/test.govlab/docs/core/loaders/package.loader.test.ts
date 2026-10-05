import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { membersWithoutManifest, workspaceMembers } from "@govlab/docs/core/loaders/package.loader.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const state = { root: "" };

const fixture = function fixture(dir: string, name: string, content: string): void {
    const target = join(state.root, ...dir.split("/"));
    mkdirSync(target, { recursive: true });
    writeVerbatim(join(target, name), content);
};

beforeEach(() => {
    state.root = mkdtempSync(join(tmpdir(), "govlab-workspaces-"));
    fixture("", "package.json", '{ "name": "root", "workspaces": ["apps/*", "tools/lint"] }');
    for (const member of ["apps/web", "apps/api", "tools/lint"]) {
        fixture(member, "package.json", '{ "name": "member" }');
    }
    fixture("apps/web", "_manifest.json", '{ "label": "member" }');
    fixture("tools/lint", "_manifest.json", '{ "label": "member" }');
    mkdirSync(join(state.root, "apps", "notes"), { recursive: true });
});

afterEach(() => {
    rmSync(state.root, { force: true, recursive: true });
});

describe("workspaceMembers and membersWithoutManifest", () => {
    it("expand the declared globs to folders with a package file, and name those without a manifest", () => {
        expect(workspaceMembers(state.root)).toStrictEqual(["apps/api", "apps/web", "tools/lint"]);
        expect(membersWithoutManifest(state.root)).toStrictEqual(["apps/api"]);
    });
});
