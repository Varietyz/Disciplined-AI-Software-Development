import { HEX_DIR, persistArtifacts } from "@govlab/patterns/core/persistence/report.persistence.ts";
import { describe, expect, it, vi } from "vitest";
import { healModule, runHexCheck } from "@govlab/patterns/core/coordinators/report.coordinator.ts";
import { mkdtempSync, readFileSync } from "node:fs";
import type { ModuleArtifacts } from "@govlab/patterns/types/report.types.ts";
import { join } from "node:path";
import process from "node:process";
import { tmpdir } from "node:os";

const ARTIFACT = "code.generated.html";
const ATTEMPTS = 4;
const SVG_NAME = "hex.svg";

const artifactsOf = function artifactsOf(content: string): ModuleArtifacts {
    return {
        artifacts: new Map([[ARTIFACT, content]]),
        findings: { findings: [], module: "m" },
        svgs: new Map([[SVG_NAME, content]]),
    };
};

const seeded = function seeded(content: string): string {
    const dir = mkdtempSync(join(tmpdir(), "pl-heal-"));
    persistArtifacts(dir, new Map([[ARTIFACT, content]]));
    return dir;
};

const onDisk = function onDisk(dir: string): string {
    return readFileSync(join(dir, HEX_DIR, ARTIFACT), "utf8").trimEnd();
};

const noReparse = async function noReparse(): Promise<void> {
    await Promise.resolve();
};

const sequence = function sequence(contents: readonly string[]): () => Promise<ModuleArtifacts> {
    const queue = [...contents];
    return async function generate() {
        await Promise.resolve();
        return artifactsOf(queue.length > 1 ? (queue.shift() ?? "") : (queue[0] ?? ""));
    };
};

describe("healModule", () => {
    it("reports clean when the generated artifact matches disk", async () => {
        const result = await healModule(seeded("SAME"), {
            attempts: ATTEMPTS,
            generate: sequence(["SAME"]),
            reparse: noReparse,
        });
        expect(result.state).toBe("clean");
    });

    it("heals a transient bad parse without rewriting a correct artifact", async () => {
        const dir = seeded("GOOD");
        const result = await healModule(dir, {
            attempts: ATTEMPTS,
            generate: sequence(["BAD", "GOOD"]),
            reparse: noReparse,
        });
        expect(result.state).toBe("healed");
        expect(onDisk(dir)).toBe("GOOD");
    });

    it("rewrites a stale artifact once two clean re-parses agree", async () => {
        const dir = seeded("OLD");
        const result = await healModule(dir, { attempts: ATTEMPTS, generate: sequence(["NEW"]), reparse: noReparse });
        expect(result.state).toBe("rewritten");
        expect(onDisk(dir)).toBe("NEW");
    });

    it("fails as drift when the re-parses never agree", async () => {
        const result = await healModule(seeded("INIT"), {
            attempts: ATTEMPTS,
            generate: sequence(["V1", "V2", "V3", "V4", "V5", "V6"]),
            reparse: noReparse,
        });
        expect(result.state).toBe("drift");
    });
});

describe("runHexCheck", () => {
    it("checks every module, hands on their vectors and leaves a matching master alone", async () => {
        const dir = seeded("M");
        const masterWrites: number[] = [];
        const svgWrites: ReadonlyMap<string, ReadonlyMap<string, string>>[] = [];
        const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        try {
            await runHexCheck({
                attempts: ATTEMPTS,
                generate: sequence(["M"]),
                masterOk: () => true,
                modules: [dir],
                async pool(items, worker) {
                    await Promise.all(items.map(worker));
                },
                reparse: noReparse,
                title: (moduleDir) => moduleDir,
                writeMaster() {
                    masterWrites.push(1);
                },
                writeSvgs(byModule) {
                    svgWrites.push(byModule);
                },
            });
        } finally {
            spy.mockRestore();
        }
        expect(masterWrites).toStrictEqual([]);
        expect(svgWrites).toStrictEqual([new Map([[dir, new Map([[SVG_NAME, "M"]])]])]);
    });
});
