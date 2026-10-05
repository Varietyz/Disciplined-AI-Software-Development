import { asNode, identName } from "#core/selectors/syntax.selector";
import type { Rule } from "eslint";
import type { SyntaxNode } from "#types/syntax.types";
import { govlabMeta } from "#core/factories/eslint.factory";

const BITWISE_BINARY = new Set(["&", "|", "^", "<<", ">>", ">>>"]);
const BITWISE_ASSIGN = new Set(["&=", "|=", "^=", "<<=", ">>=", ">>>="]);
const FLAGS_SUFFIX = "Flags";

const enumNameIsFlags = function enumNameIsFlags(obj: SyntaxNode | undefined): boolean {
    if (!obj) {
        return false;
    }
    if (obj.type === "Identifier") {
        return (obj.name ?? "").endsWith(FLAGS_SUFFIX);
    }
    return obj.type === "MemberExpression" && (identName(obj.property) ?? "").endsWith(FLAGS_SUFFIX);
};

const isFlagMember = function isFlagMember(node: SyntaxNode | undefined): boolean {
    return node?.type === "MemberExpression" && enumNameIsFlags(node.object);
};

const isFlagExpr = function isFlagExpr(node: SyntaxNode | undefined): boolean {
    if (!node) {
        return false;
    }
    if (isFlagMember(node)) {
        return true;
    }
    if (node.type === "BinaryExpression" && typeof node.operator === "string" && BITWISE_BINARY.has(node.operator)) {
        return isFlagExpr(node.left) && isFlagExpr(node.right);
    }
    if (node.type === "UnaryExpression" && node.operator === "~") {
        return isFlagExpr(node.argument);
    }
    return false;
};

const flagBitwise = function flagBitwise(context: Rule.RuleContext, raw: Rule.Node): void {
    context.report({ messageId: "bitwise", node: raw });
};

const reportBinary = function reportBinary(context: Rule.RuleContext, raw: Rule.Node): void {
    const node = asNode(raw);
    if (node !== null && typeof node.operator === "string" && BITWISE_BINARY.has(node.operator) && !isFlagExpr(node)) {
        flagBitwise(context, raw);
    }
};

const reportUnary = function reportUnary(context: Rule.RuleContext, raw: Rule.Node): void {
    const node = asNode(raw);
    if (node?.operator === "~" && !isFlagExpr(node.argument)) {
        flagBitwise(context, raw);
    }
};

const reportAssign = function reportAssign(context: Rule.RuleContext, raw: Rule.Node): void {
    const node = asNode(raw);
    if (
        node !== null &&
        typeof node.operator === "string" &&
        BITWISE_ASSIGN.has(node.operator) &&
        !isFlagExpr(node.right)
    ) {
        flagBitwise(context, raw);
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const handlers: [string, (node: Rule.Node) => void][] = [
            [
                "BinaryExpression",
                (node): void => {
                    reportBinary(context, node);
                },
            ],
            [
                "UnaryExpression",
                (node): void => {
                    reportUnary(context, node);
                },
            ],
            [
                "AssignmentExpression",
                (node): void => {
                    reportAssign(context, node);
                },
            ],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["operator-style"],
        description:
            "Reserve bitwise operators for bitfield-enum flag algebra; use arithmetic and logical operators for numeric and boolean logic",
        messages: {
            bitwise:
                "Bitwise operators are reserved for bitfield-enum flag algebra: every operand must be a flag-enum member whose enum name ends in `Flags`. Use arithmetic (`+`/`-`/`*`) or logical (`&&`/`||`/`!`) operators for numeric and boolean logic; test a single flag bit with the parity form `Math.floor(flags / mask) % 2 === 1`; combine flags with `|` across `*Flags` enum members.",
        },
        ruleId: "no_bitwise_outside_flags",
    }),
} satisfies Rule.RuleModule;
