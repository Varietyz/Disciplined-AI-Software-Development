import { asNode, nodeAt, walk } from "@ssot/govlab/shared/selectors/syntax.selector.ts";
import {
    collectRuleFile,
    collectRuleObject,
    declaredIds,
    isNonEmptyString,
    propertiesOf,
    propertyNamed,
    reportedIds,
    textOf,
} from "@ssot/govlab/shared/analyzers/rule.analyzer.ts";
import { describe, expect, it } from "vitest";
import type { AstNode } from "@ssot/govlab/types/syntax.types.ts";
import { Linter } from "eslint";
import { listener } from "@ssot/govlab/shared/factories/listener.factory.ts";

const linter = new Linter();

const programOf = function programOf(code: string): AstNode {
    let program: unknown = null;
    const capture = {
        create() {
            return listener({
                program(_view, node) {
                    program = node;
                },
            });
        },
        meta: { messages: {}, schema: [], type: "problem" as const },
    };
    linter.verify(
        code,
        [
            {
                files: ["**/*.ts"],
                languageOptions: { ecmaVersion: 2025 as const, sourceType: "module" as const },
                plugins: { t: { rules: { r: capture } } },
                rules: { "t/r": "error" as const },
            },
        ],
        "probe.ts",
    );
    const node = asNode(program);
    if (node === null) {
        throw new Error("the capture rule did not observe a Program node");
    }
    return node;
};

const RULE = [
    "export default {",
    "    create(context) { context.report({ messageId: 'used', node: null }); return {}; },",
    "    meta: { docs: { description: 'states the shape' }, messages: { used: 'u', unused: 'x' }, schema: [], type: 'problem' },",
    "};",
].join("\n");

describe("collectRuleFile and collectRuleObject", () => {
    const program = programOf(RULE);
    const file = collectRuleFile(program);

    it("finds the object carrying both meta and create and neither any nor a guard import", () => {
        expect(file.ruleObjects).toHaveLength(1);
        expect(file.anyNodes).toHaveLength(0);
        expect(file.guards).toHaveLength(0);
    });

    it("resolves the meta property and its value", () => {
        const [ruleObject] = file.ruleObjects;
        const shape = collectRuleObject(ruleObject ?? program);
        expect(shape.metaProperty).not.toBeNull();
        expect(shape.meta?.type).toBe("ObjectExpression");
    });

    it("pairs the reported ids against the declared ones", () => {
        expect([...reportedIds(program)]).toStrictEqual(["used"]);
        expect([...declaredIds(file.ruleObjects)].sort((a, b) => a.localeCompare(b))).toStrictEqual(["unused", "used"]);
    });
});

describe("propertiesOf, propertyNamed, textOf and isNonEmptyString", () => {
    const program = programOf(`const o = { a: "x", b: \`\`, c: "" + "y" };`);
    let init: AstNode | null = null;
    walk(program, (node) => {
        if (node.type === "ObjectExpression") {
            init = node;
        }
    });

    const slotOf = function slotOf(name: string, slot: string): AstNode | null {
        return nodeAt(propertyNamed(init, name), slot);
    };

    it("reads properties by name and reports whether their text is non-empty", () => {
        expect(propertiesOf(init)).toHaveLength(3);
        expect(textOf(slotOf("a", "key"))).toBe("a");
        expect(isNonEmptyString(slotOf("a", "value"))).toBe(true);
        expect(isNonEmptyString(slotOf("b", "value"))).toBe(false);
        expect(isNonEmptyString(slotOf("c", "value"))).toBe(true);
        expect(propertyNamed(init, "missing")).toBeNull();
    });
});
