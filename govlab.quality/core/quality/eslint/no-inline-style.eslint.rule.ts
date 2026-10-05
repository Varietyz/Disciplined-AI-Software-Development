import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";
import { inHostScope } from "#core/predicates/eslint.predicate";

interface AstNode {
    type: string;
    name?: string;
    value?: unknown;
    left?: AstNode;
    object?: AstNode;
    property?: AstNode;
    callee?: AstNode;
    arguments?: AstNode[];
}

const STYLE_OWN_PROPS = new Set(["style", "cssText"]);

const isAstNode = function isAstNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isAstNode(value) ? value : null;
};

const identName = function identName(node: AstNode | undefined): string | null {
    return node?.type === "Identifier" && typeof node.name === "string" ? node.name : null;
};

const assignsStyle = function assignsStyle(left: AstNode | undefined): boolean {
    if (left?.type !== "MemberExpression") {
        return false;
    }
    const prop = identName(left.property);
    if (prop === null) {
        return false;
    }
    if (STYLE_OWN_PROPS.has(prop)) {
        return true;
    }
    return left.object?.type === "MemberExpression" && identName(left.object.property) === "style";
};

const firstArgIsStyle = function firstArgIsStyle(call: AstNode): boolean {
    const first = call.arguments?.[0];
    return first?.type === "Literal" && first.value === "style";
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        if (!inHostScope(context)) {
            return {};
        }
        const onAssign = (node: Rule.Node): void => {
            const assign = asNode(node);
            if (assign !== null && assignsStyle(assign.left)) {
                context.report({ messageId: "inline", node });
            }
        };
        const onCall = (node: Rule.Node): void => {
            const call = asNode(node);
            const callee = call?.callee;
            const prop = callee?.type === "MemberExpression" ? identName(callee.property) : null;
            if (prop === "setProperty" || (prop === "setAttribute" && call !== null && firstArgIsStyle(call))) {
                context.report({ messageId: "inline", node });
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["AssignmentExpression", onAssign],
            ["CallExpression", onCall],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["csp"],
        description: "Forbid scripted inline style (strict CSP + type-cascade runtime-appearance ban)",
        messages: {
            inline: 'Scripted inline style is forbidden (strict CSP). Express appearance via a data-el/data-variant class + a CSS custom property in a stylesheet or constructable sheet — never element.style, .cssText, .setProperty(), or setAttribute("style", ...).',
        },
        ruleId: "no_inline_style",
    }),
} satisfies Rule.RuleModule;
