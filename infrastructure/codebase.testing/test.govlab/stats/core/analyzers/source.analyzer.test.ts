import {
    EXCLUDED_ORDER,
    INLINE_BLANKS,
    KIBIBYTE,
    LARGEST_KEEP,
    LINE_BREAK,
    MAX_TEXT_BYTES,
    ROOT_AREA,
} from "@govlab/stats/configuration/constants/source.constants.ts";
import { afterAll, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { INPUT } from "../loaders/stats.fixture.ts";
import { join } from "node:path";
import { runScan } from "@govlab/stats/core/analyzers/source.analyzer.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const root = mkdtempSync(join(tmpdir(), "source-analyzer-"));
const skipped = join(root, "member", "skipped");
const ignore = (target: string): boolean => target === skipped;

mkdirSync(join(root, "member", "skipped"), { recursive: true });
writeVerbatim(join(root, "top.ts"), `const a = 1;${LINE_BREAK}${LINE_BREAK}`);
writeVerbatim(join(root, "member", "a.ts"), "export const b = 2;\n");
writeVerbatim(join(root, "member", "notes.md"), "# Notes\n");
writeVerbatim(join(root, "member", "data.json"), "{}\n");
writeVerbatim(join(root, "member", "a.generated.ts"), "export const c = 3;\n");
writeVerbatim(join(root, "member", "image.bin"), Buffer.from([0, 1, 2]));
writeVerbatim(join(root, "member", "skipped", "hidden.ts"), "export const d = 4;\n");

afterAll(() => {
    rmSync(root, { force: true, recursive: true });
});

describe("runScan", () => {
    const state = runScan({ ignore, members: ["member"], root });

    it("routes each file to authored, generated, ingested or binary, and skips an ignored folder", () => {
        expect(state.authored.get("source")?.files).toBe(2);
        expect(state.authored.get("prose")?.files).toBe(1);
        expect(state.excluded.get("generated")?.files).toBe(1);
        expect(state.excluded.get("ingested")?.files).toBe(1);
        expect(state.excluded.get("binary")?.files).toBe(1);
        expect(EXCLUDED_ORDER).toHaveLength(3);
    });

    it("assigns a file to its member's area, and a loose file to the root area", () => {
        expect([...state.byArea.keys()].toSorted((a, b) => a.localeCompare(b))).toStrictEqual([ROOT_AREA, "member"]);
    });

    it("returns fresh state on every call", () => {
        expect(runScan({ ignore, members: ["member"], root }).files).toBe(state.files);
    });

    it("keeps the census within its bounds on the real workspace", () => {
        expect(INPUT.state.lines.code).toBeLessThanOrEqual(INPUT.state.lines.total);
        expect(INPUT.state.largest.length).toBeLessThanOrEqual(LARGEST_KEEP);
        expect(state.dirs).toBe(1);
        expect(state.textFiles).toBe(state.files - 1);
        expect(MAX_TEXT_BYTES % KIBIBYTE).toBe(0);
        expect(INLINE_BLANKS.has(" ")).toBe(true);
    });
});
