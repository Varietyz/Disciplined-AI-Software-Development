import { describe, expect, it } from "vitest";
import type { EmitDescriptor } from "@govlab/quality/types/emitter.types.ts";
import { xmlRulesetTree } from "@govlab/quality/core/converters/emitter.xml.converter.ts";

const MAX_LINES = 300;

const DESCRIPTOR: EmitDescriptor = {
    configTarget: "ruleset.xml",
    format: "xml",
    idiom: "rules-container",
    selectContainer: null,
    settingsContainer: null,
    tool: "pmd",
    xmlDescription: "Generated ruleset",
    xmlPropsWrap: "properties",
    xmlRefPrefix: "rulesets/",
    xmlRuleTag: "rule",
    xmlWrap: [{ attrs: { name: "govlab" }, tag: "ruleset" }],
};

describe("xmlRulesetTree", () => {
    it("wraps a description and one rule element per concept, with a valued knob as a wrapped property", () => {
        const tree = xmlRulesetTree(DESCRIPTOR, [
            { canonicalId: "file-length", knob: "maximum", ruleIds: ["ExcessiveLength"], value: MAX_LINES },
            { canonicalId: "no-unused", knob: null, ruleIds: ["UnusedVariable"] },
        ]);
        expect(tree.tag).toBe("ruleset");
        expect(tree.attrs).toStrictEqual({ name: "govlab" });
        expect(tree.children?.[0]).toStrictEqual({ tag: "description", text: "Generated ruleset" });
        expect(tree.children?.[1]).toStrictEqual({
            attrs: { name: "rulesets/ExcessiveLength" },
            children: [
                { children: [{ attrs: { name: "maximum", value: "300" }, tag: "property" }], tag: "properties" },
            ],
            tag: "rule",
        });
        expect(tree.children?.[2]?.attrs).toStrictEqual({ name: "rulesets/UnusedVariable" });
    });

    it("falls back to a bare ruleset wrapper when the descriptor names none", () => {
        const tree = xmlRulesetTree(
            {
                configTarget: "r.xml",
                format: "xml",
                idiom: "rules-container",
                selectContainer: null,
                settingsContainer: null,
                tool: "pmd",
            },
            [],
        );
        expect(tree.tag).toBe("ruleset");
        expect(tree.children).toStrictEqual([]);
        expect(tree.attrs).toBeUndefined();
    });
});
