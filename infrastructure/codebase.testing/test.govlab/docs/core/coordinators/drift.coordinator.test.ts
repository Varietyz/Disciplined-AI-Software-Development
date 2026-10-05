import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import type { Spec } from "@govlab/docs/types/document.output.types.ts";
import { checkSpec } from "@govlab/docs/core/coordinators/drift.coordinator.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

interface RunResult {
    errors: string[];
    heals: string[];
    onDisk: string;
    written: string[];
}

const failingGate: Spec["gate"] = async () => {
    await Promise.resolve();
    return { findings: [{ line: 1, message: "bad" }] };
};

const sequence = function sequence(values: readonly string[]): (onDisk: string) => Promise<string> {
    const state = { at: 0 };
    return async () => {
        await Promise.resolve();
        const value = values[Math.min(state.at, values.length - 1)] ?? "";
        state.at += 1;
        return value;
    };
};

const counter = function counter(): (onDisk: string) => Promise<string> {
    const state = { at: 0 };
    return async () => {
        await Promise.resolve();
        state.at += 1;
        return `V${String(state.at)}`;
    };
};

const runCheck = async function runCheck(
    initial: string,
    produce: (onDisk: string) => Promise<string>,
    options: { fix: boolean; gate?: Spec["gate"] },
): Promise<RunResult> {
    const dir = mkdtempSync(join(tmpdir(), "docdrift-"));
    const path = join(dir, "artifact.generated.md");
    writeVerbatim(path, initial);
    const written: string[] = [];
    const spec: Spec = {
        driftCode: "test-drift",
        label: "test-spec",
        normalize: (text) => text,
        path,
        produce,
        ...(options.gate === undefined ? {} : { gate: options.gate, gateCode: "test-gate" }),
    };
    try {
        const result = await checkSpec(spec, options.fix, (target, content) => {
            written.push(content);
            writeVerbatim(target.path, content);
        });
        return { ...result, onDisk: readFileSync(path, "utf8"), written };
    } finally {
        rmSync(dir, { force: true, recursive: true });
    }
};

describe("checkSpec", () => {
    it("reports clean when the produced content already matches the disk", async () => {
        expect(await runCheck("SAME", sequence(["SAME"]), { fix: true })).toMatchObject({
            errors: [],
            heals: [],
            written: [],
        });
    });

    it("regenerates a stale artifact once two productions agree", async () => {
        const result = await runCheck("OLD", sequence(["NEW"]), { fix: true });
        expect(result.heals).toStrictEqual([expect.stringContaining("regenerated")]);
        expect(result.onDisk).toBe("NEW");
    });

    it("self-heals a transient bad production without rewriting a correct artifact", async () => {
        const result = await runCheck("GOOD", sequence(["BAD", "GOOD"]), { fix: true });
        expect(result.heals).toStrictEqual([expect.stringContaining("self-healed")]);
        expect(result.written).toStrictEqual([]);
    });

    it("fails as non-deterministic when productions never agree", async () => {
        const result = await runCheck("INIT", counter(), { fix: true });
        expect(result.errors).toStrictEqual([expect.stringContaining("non-deterministic")]);
        expect(result.written).toStrictEqual([]);
    });

    it("keeps an artifact that fails its gate, and reports drift without writing when fix is off", async () => {
        const gated = await runCheck("OLD", sequence(["BROKEN"]), { fix: true, gate: failingGate });
        expect(gated.errors).not.toStrictEqual([]);
        expect(gated.onDisk).toBe("OLD");
        const unfixed = await runCheck("OLD", sequence(["NEW"]), { fix: false });
        expect(unfixed.errors).toStrictEqual([expect.stringContaining("regenerate")]);
        expect(unfixed.onDisk).toBe("OLD");
    });
});
