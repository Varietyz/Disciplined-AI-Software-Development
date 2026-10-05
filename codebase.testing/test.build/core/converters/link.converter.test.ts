import { describe, expect, it } from "vitest";
import { relationGroups, rewriteTargets } from "@banes-lab/build-scripts/core/converters/link.converter.ts";

describe("relationGroups", () => {
    it("merges groups of one relation, drops a link it already holds, and drops a relation left empty", () => {
        const first = { href: null, json: "https://x.test/json/a", label: "A", markdown: null, ref: "a" };
        const second = { href: null, json: "https://x.test/json/b", label: "B", markdown: null, ref: "b" };
        const merged = relationGroups([
            { links: [first], relation: "uses" },
            { links: [], relation: "used-by" },
            { links: [first, second], relation: "uses" },
        ]);
        expect(merged.map((group) => [group.relation, group.links.map((link) => link.ref)])).toStrictEqual([
            ["uses", ["a", "b"]],
        ]);
    });
});

describe("rewriteTargets", () => {
    it("rewrites every link target outside a fence and leaves fenced lines alone", () => {
        const text = "See [a](/a) and [b](#b).\n```\n[c](/c)\n```\n[d](/d)";
        expect(rewriteTargets(text, (target) => target.toUpperCase())).toBe(
            "See [a](/A) and [b](#B).\n```\n[c](/c)\n```\n[d](/D)",
        );
    });
});
