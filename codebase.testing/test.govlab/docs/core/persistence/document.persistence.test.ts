import { afterEach, describe, expect, it } from "vitest";
import {
    healFile,
    healMarkdown,
    persistSpec,
    persistWorkspaceMap,
} from "@govlab/docs/core/persistence/document.persistence.ts";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const made: string[] = [];

const scratch = function scratch(): string {
    const dir = mkdtempSync(join(tmpdir(), "docpersist-"));
    made.push(dir);
    return dir;
};

afterEach(() => {
    for (const dir of made.splice(0)) {
        rmSync(dir, { force: true, recursive: true });
    }
});

describe("persistSpec", () => {
    it("writes a plain spec and refuses a hardened spec whose diagram breaks the subset", () => {
        const path = join(scratch(), "nested", "out.generated.md");
        const base = {
            driftCode: "test",
            label: "test",
            mkdir: true,
            normalize: (text: string) => text,
            path,
            produce: () => "",
        };
        persistSpec(base, "written body");
        expect(readFileSync(path, "utf8")).toBe("written body");
        expect(() => {
            persistSpec({ ...base, harden: true }, '```mermaid\nflowchart TD\n    A(["stadium"])\n```\n');
        }).toThrow("failed hardening");
    });
});

describe("healFile and healMarkdown", () => {
    it("write only when the content changed, and stamp a generated mark", () => {
        const path = join(scratch(), "a.generated.md");
        expect(healFile(path, "x")).toBe(true);
        expect(healFile(path, "x")).toBe(false);
        expect(healMarkdown(path, "# Body\n")).toBe(true);
        expect(readFileSync(path, "utf8")).toContain("Auto-generated");
    });
});

describe("persistWorkspaceMap", () => {
    it("writes the map content under a created folder", () => {
        const path = join(scratch(), "deep", "map.generated.md");
        persistWorkspaceMap({ content: "map", path, rel: "map.generated.md" });
        expect(readFileSync(path, "utf8")).toBe("map");
    });
});
