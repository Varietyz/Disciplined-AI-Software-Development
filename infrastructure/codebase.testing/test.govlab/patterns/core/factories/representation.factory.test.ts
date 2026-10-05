import { describe, expect, it } from "vitest";
import { createRng } from "@govlab/patterns/core/factories/seed.factory.ts";
import { runtimeOf } from "@govlab/patterns/core/factories/representation.factory.ts";

const SEED = 3;

describe("runtimeOf", () => {
    it("wires an accumulator's update, sample and summary into a representation runtime", () => {
        const seen: unknown[] = [];
        const runtime = runtimeOf(
            {
                result: () => seen.length,
                sample: () => seen[0] ?? null,
                update(chunk) {
                    seen.push(...chunk);
                },
            },
            () => [],
        );
        runtime.update(["a"]);
        expect(runtime.sample(createRng(SEED))).toBe("a");
        expect(runtime.findings()).toStrictEqual([]);
    });
});
