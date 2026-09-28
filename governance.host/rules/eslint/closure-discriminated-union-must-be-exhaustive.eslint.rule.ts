import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import {
    calleeName,
    isType,
    literalString,
    nameOf,
    nodeAt,
    nodesAt,
    numberAt,
    stringAt,
} from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const EXEMPT_BASENAME_SUFFIXES = [".test.ts", ".spec.ts"];
const MIN_CHAIN_LENGTH = 3;
const EQUALITY_OPERATORS = new Set(["===", "=="]);
const NEVER_MARKER = "never";

const basenameOf = function basenameOf(path: string): string {
    const norm = path.split("\\").join("/");
    const idx = norm.lastIndexOf("/");
    return idx === -1 ? norm : norm.slice(idx + 1);
};

const isExemptFile = function isExemptFile(filename: string): boolean {
    const basename = basenameOf(filename);
    return EXEMPT_BASENAME_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const memberKey = function memberKey(node: AstNode | null): string | null {
    if (node === null) {
        return null;
    }
    if (node.type === "Identifier") {
        return nameOf(node);
    }
    if (node.type !== "MemberExpression") {
        return null;
    }
    const object = memberKey(nodeAt(node, "object"));
    const property = nodeAt(node, "property");
    if (object === null || !isType(property, "Identifier")) {
        return null;
    }
    return `${object}.${nameOf(property)}`;
};

const literalText = function literalText(node: AstNode | null): string | null {
    if (node?.type !== "Literal") {
        return null;
    }
    const text = literalString(node);
    if (text !== null) {
        return text;
    }
    const numeric = numberAt(node, "value");
    return numeric === null ? null : String(numeric);
};

const extractDiscriminator = function extractDiscriminator(
    test: AstNode | null,
): { key: string; value: string } | null {
    if (test?.type !== "BinaryExpression" || !EQUALITY_OPERATORS.has(stringAt(test, "operator"))) {
        return null;
    }
    const key = memberKey(nodeAt(test, "left"));
    const value = literalText(nodeAt(test, "right"));
    return key === null || value === null ? null : { key, value };
};

const declaresNever = function declaresNever(statement: AstNode): boolean {
    return nodesAt(statement, "declarations").some((d) => {
        const annotation = nodeAt(nodeAt(d, "id"), "typeAnnotation");
        return isType(nodeAt(annotation, "typeAnnotation"), "TSNeverKeyword");
    });
};

const callsNever = function callsNever(statement: AstNode): boolean {
    const expression = nodeAt(statement, "expression");
    if (!isType(expression, "CallExpression")) {
        return false;
    }
    return calleeName(expression).toLowerCase().includes(NEVER_MARKER);
};

const isAssertNever = function isAssertNever(node: AstNode | null): boolean {
    if (node === null) {
        return false;
    }
    if (node.type === "ThrowStatement") {
        return true;
    }
    if (node.type !== "BlockStatement") {
        return false;
    }
    return nodesAt(node, "body").some((s) => {
        if (s.type === "ThrowStatement") {
            return true;
        }
        if (s.type === "ExpressionStatement") {
            return callsNever(s);
        }
        return s.type === "VariableDeclaration" && declaresNever(s);
    });
};

const walkChain = function walkChain(start: AstNode, key: string): { branches: string[]; final: AstNode | null } {
    const branches: string[] = [];
    let node: AstNode = start;
    while (node.type === "IfStatement") {
        const disc = extractDiscriminator(nodeAt(node, "test"));
        if (disc?.key !== key) {
            return { branches, final: node };
        }
        branches.push(disc.value);
        const alternate = nodeAt(node, "alternate");
        if (alternate === null) {
            return { branches, final: null };
        }
        if (alternate.type !== "IfStatement") {
            return { branches, final: alternate };
        }
        node = alternate;
    }
    return { branches, final: null };
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        const seen = new WeakSet<AstNode>();
        return listener({
            ifStatement(view, node) {
                if (seen.has(view)) {
                    return;
                }
                const disc = extractDiscriminator(nodeAt(view, "test"));
                if (disc === null) {
                    return;
                }
                const result = walkChain(view, disc.key);
                if (result.branches.length < MIN_CHAIN_LENGTH) {
                    return;
                }
                let walker: AstNode = view;
                while (walker.type === "IfStatement") {
                    seen.add(walker);
                    const next = nodeAt(walker, "alternate");
                    if (next === null) {
                        break;
                    }
                    walker = next;
                }
                if (result.final === null || !isAssertNever(result.final)) {
                    const payload = { key: disc.key, values: result.branches.join(", ") };
                    context.report({ data: payload, messageId: "notExhaustive", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:type-safety"] }),
            description:
                'When an if/else-if chain switches on a discriminator (`x.kind === "a"` / `x.slot === "b"`), the terminal arm must be an exhaustiveness assertion — either a final `else { throw new Error(...) }` or `assertNever(x.kind)`. Without it, adding a new discriminator value silently drops contributions through the chain. Type-union additions become silent dead-letter holes.',
        },
        messages: {
            notExhaustive:
                "If/else-if chain on `{{ key }}` (values {{ values }}) has no exhaustiveness terminal. Add `else { throw new Error(...) }` or `else { const _exhaustive: never = {{ key }}; }`. Without it, adding a new value to the union silently drops cases here.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
