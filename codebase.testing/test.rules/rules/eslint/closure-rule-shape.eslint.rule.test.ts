import { describe, expect, it } from "vitest";
import { Linter } from "eslint";
import { absolutePath } from "@ssot/paths";
import rule from "@ssot/govlab/rules/eslint/closure-rule-shape.eslint.rule.ts";
import { sep } from "node:path";

const linter = new Linter();
const config = [
    {
        files: ["**/*.ts"],
        languageOptions: {
            ecmaVersion: 2025 as const,
            parser: await import("@typescript-eslint/parser"),
            sourceType: "module" as const,
        },
        plugins: { t: { rules: { r: rule } } },
        rules: { "t/r": "error" as const },
    },
];

const RULE_FILE = `${absolutePath("govlabHost.rules").split(sep).join("/")}/eslint/probe.eslint.rule.ts`;
const OTHER_FILE = `${absolutePath("govlabHost.rules").split(sep).join("/")}/eslint/notes.ts`;

const idsFor = function idsFor(code: string, file = RULE_FILE): string[] {
    return linter
        .verify(code, config, file)
        .map((message) => message.messageId)
        .filter((id): id is string => typeof id === "string");
};

const WELL_FORMED = `export default {
    create(context) {
        return { Program(node) { context.report({ messageId: "bad", node }); } };
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: [] }),
            description: "Describes the shape this rule enforces.",
        },
        messages: { bad: "A finding." },
        schema: [],
        type: "problem",
    },
};`;

const DECLARATION = "            checks: defineCheck({ detects: [], enforces: [] }),\n";

describe("closure-rule-shape", () => {
    it("accepts a rule declaring every required part", () => {
        expect(idsFor(WELL_FORMED)).toStrictEqual([]);
    });

    it("ignores a file that is not a rule file", () => {
        expect(idsFor("export const notes: any = 1;", OTHER_FILE)).toStrictEqual([]);
    });

    it("reports an explicit any anywhere in a rule file", () => {
        expect(idsFor(WELL_FORMED.replace("create(context)", "create(context: any)"))).toContain("explicitAny");
    });

    it("reports a file whose object declares create without meta", () => {
        expect(idsFor("export default { create() { return {}; } };")).toContain("missingRuleObject");
    });

    it("reports a file whose object declares meta without create", () => {
        const code = `export default { meta: { docs: { description: "x" }, messages: { a: "b" }, schema: [], type: "problem" } };`;
        expect(idsFor(code)).toContain("missingRuleObject");
    });

    it("pairs messages across every rule object a plugin wrapper carries", () => {
        const code = `defineCheck({ detects: [], enforces: [] });
const a = {
    create(context) { return { Program(node) { context.report({ messageId: "one", node }); } }; },
    meta: { docs: { description: "First." }, messages: { one: "A." }, schema: [], type: "problem" },
};
const b = {
    create(context) { return { Program(node) { context.report({ messageId: "two", node }); } }; },
    meta: { docs: { description: "Second." }, messages: { two: "B." }, schema: [], type: "problem" },
};
export default { plugins: { ns: { rules: { a, b } } }, tool: "eslint" };`;
        expect(idsFor(code)).toStrictEqual([]);
    });

    it("reports a missing meta key", () => {
        expect(idsFor(WELL_FORMED.replace("        schema: [],\n", ""))).toContain("missingMetaKey");
    });

    it("reports an empty or absent description", () => {
        expect(idsFor(WELL_FORMED.replace('"Describes the shape this rule enforces."', '"  "'))).toContain(
            "missingDescription",
        );
    });

    it("reports a rule that declares no check, and accepts a module-level declaration in its place", () => {
        const undeclared = WELL_FORMED.replace(DECLARATION, "");
        expect(idsFor(undeclared)).toContain("missingChecks");
        expect(idsFor(`defineCheck({ detects: [], enforces: [] });\n${undeclared}`)).not.toContain("missingChecks");
    });

    it("reports a self-declared severity", () => {
        expect(idsFor(WELL_FORMED.replace("schema: [],", 'schema: [], severity: "error",'))).toContain(
            "severityDeclared",
        );
    });

    it("reports a messageId reported but not declared", () => {
        expect(idsFor(WELL_FORMED.replace('bad: "A finding."', 'other: "A finding."'))).toContain("unknownMessageId");
    });

    it("reports a message declared but never reported", () => {
        expect(
            idsFor(WELL_FORMED.replace('messages: { bad: "A finding." }', 'messages: { bad: "A.", spare: "B." }')),
        ).toContain("unusedMessage");
    });

    it("reports a rule that re-applies the member guard", () => {
        const code = `import { isGovernedFile } from "../../shared/resolvers/anchor.resolver.ts";\n${WELL_FORMED}`;
        expect(idsFor(code)).toContain("projectGuard");
    });
});
