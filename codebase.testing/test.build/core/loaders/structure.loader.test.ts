import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import type { DiskFolder } from "@banes-lab/build-scripts/types/structure.types.ts";
import { join } from "node:path";
import { readTree } from "@banes-lab/build-scripts/core/loaders/structure.loader.ts";
import { relativePath } from "@ssot/paths";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("readTree", () => {
    it("keeps a hidden entry at the member root only when the member ships it", () => {
        const root = mkdtempSync(join(tmpdir(), "anatomy-tree-"));
        try {
            mkdirSync(join(root, ".agent"));
            writeVerbatim(join(root, ".agent", "AGENT.md"), "# block\n");
            mkdirSync(join(root, ".cache"));
            writeVerbatim(join(root, ".cache", "state.json"), "{}\n");
            const read = readTree({
                excluded: () => null,
                moduleDir: root,
                pruned: () => false,
                root: "member",
                shipped: new Set([".agent"]),
            });
            expect(read.folders.map((folder) => folder.name)).toStrictEqual([".agent"]);
            expect(read.folders[0]?.files.map((file) => file.path)).toStrictEqual([".agent/AGENT.md"]);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });

    it("keeps an excluded file as a leaf naming its reason, never reading its bytes as text", () => {
        const root = mkdtempSync(join(tmpdir(), "anatomy-excluded-"));
        try {
            writeVerbatim(join(root, "card.png"), "binary\n");
            writeVerbatim(join(root, "notes.md"), "# notes\n");
            const read = readTree({
                excluded: (file) => (file.endsWith(".png") ? "rendered-media" : null),
                moduleDir: root,
                pruned: () => false,
                root: "member",
                shipped: new Set(),
            });
            const [card, notes] = read.files;
            expect([card?.excluded, card?.text]).toStrictEqual(["rendered-media", ""]);
            expect([notes?.excluded, notes?.text]).toStrictEqual([undefined, "# notes\n"]);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });

    it("gives each folder the imported root that governs it, and the role that root's vocabulary declares", () => {
        const root = mkdtempSync(join(tmpdir(), "anatomy-roles-"));
        const member = relativePath("app.coordination");
        try {
            mkdirSync(join(root, "tools", "core", "runners"), { recursive: true });
            writeVerbatim(join(root, "tools", "core", "runners", "venue.runner.ts"), "export {};\n");
            mkdirSync(join(root, "config"));
            mkdirSync(join(root, "loose"));
            const read = readTree({
                excluded: () => null,
                moduleDir: root,
                pruned: () => false,
                root: member,
                shipped: new Set(),
            });
            const folder = (name: string): DiskFolder | undefined => read.folders.find((held) => held.name === name);
            const tools = folder("tools");
            const core = tools?.folders[0];
            const runners = core?.folders[0];
            expect([read.role, read.governedBy]).toStrictEqual(["member", member]);
            expect([tools?.role, tools?.governedBy]).toStrictEqual(["container", `${member}/tools`]);
            expect([core?.role, runners?.role, runners?.governedBy]).toStrictEqual([
                "container",
                "concern",
                `${member}/tools`,
            ]);
            expect([folder("config")?.role, folder("loose")?.role]).toStrictEqual(["container", "subject"]);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
