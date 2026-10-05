import { describe, expect, it } from "vitest";
import { loadProducers } from "@govlab/quality/core/loaders/producer.loader.ts";

const KNOB_FIELD = 2;

describe("the eslint producer", () => {
    it("derives numeric knobs from eslint rule schemas", async () => {
        const producer = (await loadProducers()).find((entry) => entry.name === "eslint");
        const entries = (await producer?.knobs?.()) ?? [];
        const maxLines = entries.find((entry) => entry[0] === "eslint" && entry[1] === "max-lines");
        expect(maxLines?.[KNOB_FIELD]?.knob).toBe("max");
    });
});
