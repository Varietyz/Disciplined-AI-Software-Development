import { expect, test } from "vitest";
import { ruleIdsFor, toolTokensOf } from "@govlab/quality/core/selectors/emitter.selector.ts";

const TOKENS = { ruff: { "line-length": { knob: "line-length", ruleIds: ["E501"] } } };

test("toolTokensOf answers a tool's tokens, and ruleIdsFor the rules one concept maps to", () => {
    const ruff = toolTokensOf(TOKENS, "ruff");
    expect(ruleIdsFor(ruff, "line-length")).toStrictEqual(["E501"]);
    expect(ruleIdsFor(ruff, "absent")).toStrictEqual([]);
    expect(toolTokensOf(TOKENS, "absent")).toStrictEqual({});
});
