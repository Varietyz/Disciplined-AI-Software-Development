import { expect, test } from "vitest";
import { govlabMeta } from "@govlab/quality/core/factories/eslint.factory.ts";

test("govlabMeta tags each message with the rule id and nests the concepts under docs", () => {
    const meta = govlabMeta({
        canonical: ["magic-number"],
        description: "Demo rule",
        messages: { found: "Found it." },
        ruleId: "demo_rule",
    });
    expect(meta.messages?.["found"]).toBe("Found it. [demo_rule] [canon: quality:concept:magic-number]");
    expect(meta.docs).toMatchObject({ canonical: ["magic-number"], description: "Demo rule", ruleId: "demo_rule" });
    expect(meta.docs?.url).toBeUndefined();
    expect(meta.type).toBe("problem");
    expect(meta.schema).toStrictEqual([]);
});
