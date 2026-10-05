import { describe, expect, it } from "vitest";
import { hasValue, ownerRuleId, treeFor } from "@govlab/quality/core/converters/emitter.converter.ts";
import type { EmitDescriptor } from "@govlab/quality/types/emitter.types.ts";

const LINE_LENGTH = 100;

const descriptor = function descriptor(
    idiom: EmitDescriptor["idiom"],
    extra: Partial<EmitDescriptor> = {},
): EmitDescriptor {
    return {
        configTarget: "tool.yaml",
        format: "yaml",
        idiom,
        selectContainer: "select",
        settingsContainer: "settings",
        tool: "tool",
        ...extra,
    };
};

const CONCEPTS = [
    { canonicalId: "line-length", knob: "max", ruleIds: ["E501"], value: LINE_LENGTH },
    { canonicalId: "no-unused", knob: null, ruleIds: ["F401"] },
];

describe("hasValue", () => {
    it("holds for a concept that carries a knob and a value", () => {
        expect(CONCEPTS.map(hasValue)).toStrictEqual([true, false]);
    });
});

describe("ownerRuleId", () => {
    it("prefers the exact id, then the shortest id that contains the canonical one, then the first id", () => {
        expect(ownerRuleId("max-len", ["max-len", "max-len-x"])).toBe("max-len");
        expect(ownerRuleId("max-len", ["rule.max_len.long", "maxlen"])).toBe("maxlen");
        expect(ownerRuleId("absent", ["first", "second"])).toBe("first");
        expect(ownerRuleId("absent", [])).toBe("");
    });
});

describe("treeFor", () => {
    it("builds a central tree with the selected rules and the settings under their container", () => {
        expect(treeFor({ concepts: CONCEPTS, descriptor: descriptor("central"), ignore: [] })).toStrictEqual({
            select: ["E501", "F401"],
            settings: { max: LINE_LENGTH },
        });
    });

    it("builds one block per rule for the per-rule idiom", () => {
        expect(treeFor({ concepts: CONCEPTS, descriptor: descriptor("per-rule"), ignore: [] })).toStrictEqual({
            E501: { max: LINE_LENGTH },
            F401: {},
        });
    });

    it("keys each rule under the rules container, with a valued concept on its owner rule", () => {
        const tree = treeFor({
            concepts: CONCEPTS,
            descriptor: descriptor("rules-container", { ruleContainer: "rules" }),
            ignore: [],
        });
        expect(tree).toStrictEqual({ rules: { E501: { max: LINE_LENGTH }, F401: "enable" } });
    });
});
