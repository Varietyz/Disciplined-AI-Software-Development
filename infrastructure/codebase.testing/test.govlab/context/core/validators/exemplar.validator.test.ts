import { type Exemplar, createAlgoGrammar, createGovlabContext } from "@govlab/context";
import type { ContractRecord } from "@govlab/context/types/algorithm.types.ts";
import assert from "node:assert/strict";
import { exemplarGapsOf } from "@govlab/context/core/validators/exemplar.validator.ts";
import { test } from "vitest";

const record = (id: string, exemplar?: Exemplar, meta = false): ContractRecord => ({
    composes: [],
    flow: [],
    force: [],
    id,
    intent: "i",
    invariant: "v",
    productions: [],
    title: id,
    ...(exemplar ? { exemplar } : {}),
    ...(meta ? { meta } : {}),
});

test("a non-meta contract with a missing, identical or codeless exemplar is a gap, and a meta record is exempt", () => {
    const algo = createAlgoGrammar({
        data: [
            {
                category: "planted",
                records: [
                    record("missing"),
                    record("identical", { after: "x = 1;", before: "x = 1;", lang: "ts", medium: "code" }),
                    record("codeless", { after: "prose", before: "other", lang: "ts", medium: "code" }),
                    record("sound", { after: "x = 1;", before: "x = 2;", lang: "ts", medium: "code" }),
                    record("meta-root", undefined, true),
                ],
                tier: "leaf",
            },
        ],
        symbols: [],
    });
    assert.deepEqual(
        exemplarGapsOf(algo).map((gap) => gap.id),
        ["missing", "identical", "codeless"],
    );
    assert.deepEqual(createGovlabContext().validateResolution().exemplarGaps, []);
});
