import type { FixableResult, SafeFixFs } from "@govlab/quality/types/edit.types.ts";
import { describe, expect, it } from "vitest";
import { applyFixesSafely } from "@govlab/quality/core/persistence/edit.persistence.ts";
import path from "node:path";
import { relativePath } from "@ssot/paths";

const ROOT = "/repo";
const FILE_A = "/repo/a.ts";

const result = (filePath: string, output: string | undefined, messages: { fatal?: boolean }[] = []): FixableResult => ({
    filePath,
    messages,
    output,
});

interface Recorder {
    fs: SafeFixFs;
    files: Map<string, string>;
    ops: string[];
}

const recorder = (initial: [string, string][], failWriteOn?: string): Recorder => {
    const files = new Map(initial);
    const ops: string[] = [];
    const fs: SafeFixFs = {
        ensureDir: (dir) => {
            ops.push(`mkdir ${dir}`);
        },
        read: (file) => {
            ops.push(`read ${file}`);
            return files.get(file) ?? "";
        },
        rename: (from, to) => {
            ops.push(`rename ${from} → ${to}`);
            const value = files.get(from) ?? "";
            files.set(to, value);
            files.delete(from);
        },
        write: (file, data) => {
            ops.push(`write ${file}`);
            if (typeof failWriteOn === "string" && file.includes(failWriteOn)) {
                throw new Error(`write failed: ${file}`);
            }
            files.set(file, data);
        },
    };
    return { files, fs, ops };
};

describe("applyFixesSafely", () => {
    it("writes fixed files atomically via a temp file in the cache, outside every walked tree", () => {
        const rec = recorder([[FILE_A, "old"]]);
        const outcome = applyFixesSafely([result(FILE_A, "new", [])], { fs: rec.fs, root: ROOT });
        const temp = path.join(ROOT, relativePath("toolCache"), "fix-tmp", "a.ts.govlab-fix-tmp");
        expect(outcome.written).toEqual([FILE_A]);
        expect(rec.files.get(FILE_A)).toBe("new");
        expect(rec.ops).toContain(`rename ${temp} → ${FILE_A}`);
        expect(rec.ops.some((op) => op.includes(`${FILE_A}.govlab-fix-tmp`))).toBe(false);
    });

    it("refuses a file outside the workspace root, which has no cache home for its temp file", () => {
        const rec = recorder([["/elsewhere/b.ts", "old"]]);
        expect(() => applyFixesSafely([result("/elsewhere/b.ts", "new", [])], { fs: rec.fs, root: ROOT })).toThrow(
            "outside the workspace root",
        );
    });

    it("dry-run records pending and writes nothing", () => {
        const rec = recorder([[FILE_A, "old"]]);
        const outcome = applyFixesSafely([result(FILE_A, "new", [])], { dryRun: true, fs: rec.fs, root: ROOT });
        expect(outcome.pending).toEqual([FILE_A]);
        expect(outcome.written).toEqual([]);
        expect(rec.files.get(FILE_A)).toBe("old");
        expect(rec.ops.some((op) => op.startsWith("write"))).toBe(false);
    });

    it("backup snapshots the original before writing", () => {
        const rec = recorder([[FILE_A, "old"]]);
        applyFixesSafely([result(FILE_A, "new", [])], { backup: true, fs: rec.fs, root: ROOT });
        const backupPath = path.join(ROOT, relativePath("toolCache"), "fix-backup", "a.ts");
        expect(rec.files.get(backupPath)).toBe("old");
    });

    it("skips a file whose messages contain a fatal parse error", () => {
        const rec = recorder([[FILE_A, "old"]]);
        const outcome = applyFixesSafely([result(FILE_A, "broken", [{ fatal: true }])], { fs: rec.fs, root: ROOT });
        expect(outcome.skipped).toEqual([FILE_A]);
        expect(outcome.written).toEqual([]);
        expect(rec.files.get(FILE_A)).toBe("old");
    });

    it("writes a file with residual NON-fatal messages (no rollback on residual findings)", () => {
        const rec = recorder([[FILE_A, "old"]]);
        const outcome = applyFixesSafely([result(FILE_A, "new", [{ fatal: false }, {}])], { fs: rec.fs, root: ROOT });
        expect(outcome.written).toEqual([FILE_A]);
        expect(rec.files.get(FILE_A)).toBe("new");
    });

    it("rolls back already-written files when a later write throws", () => {
        const rec = recorder(
            [
                [FILE_A, "oldA"],
                ["/repo/b.ts", "oldB"],
            ],
            "b.ts",
        );
        expect(() =>
            applyFixesSafely([result(FILE_A, "newA", []), result("/repo/b.ts", "newB", [])], {
                fs: rec.fs,
                root: ROOT,
            }),
        ).toThrow();
        expect(rec.files.get(FILE_A)).toBe("oldA");
    });
});
