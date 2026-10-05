import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface AstNode {
    type: string;
    name?: string;
    computed?: boolean;
    object?: AstNode;
    property?: AstNode;
    expression?: AstNode;
    argument?: AstNode;
    arguments?: AstNode[];
    callee?: AstNode;
    body?: AstNode[];
}

type OnHit = (node: AstNode, callee: string, count: number) => void;

const DEFAULT_THRESHOLD = 3;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const isAstNode = (value: unknown): value is AstNode => isRecord(value) && "type" in value;

const asNode = (value: unknown): AstNode | null => (isAstNode(value) ? value : null);

const isRuleNode = (value: unknown): value is Rule.Node => isRecord(value) && "type" in value;

const resolveThreshold = (raw: unknown): number => {
    const threshold = isRecord(raw) ? raw["threshold"] : DEFAULT_THRESHOLD;
    return typeof threshold === "number" ? threshold : DEFAULT_THRESHOLD;
};

const memberPath = (object: string | null, property: string | undefined): string | null =>
    typeof object === "string" && typeof property === "string" ? `${object}.${property}` : null;

const serializeCallee = (node: AstNode | null | undefined): string | null => {
    if (!node) {
        return null;
    }
    if (node.type === "Identifier") {
        return node.name ?? null;
    }
    if (node.type === "ThisExpression") {
        return "this";
    }
    if (node.type !== "MemberExpression" || node.computed === true) {
        return null;
    }
    return memberPath(serializeCallee(node.object), node.property?.name);
};

const descriptorCalleeOf = (stmt: AstNode): string | null => {
    if (stmt.type !== "ExpressionStatement" || !stmt.expression) {
        return null;
    }
    const inner = stmt.expression;
    const expr = inner.type === "AwaitExpression" && inner.argument ? inner.argument : inner;
    if (expr.type !== "CallExpression") {
        return null;
    }
    const first = (expr.arguments ?? []).at(0);
    if (first?.type !== "ObjectExpression") {
        return null;
    }
    return serializeCallee(expr.callee);
};

const extendRun = (body: AstNode[], start: number, callee: string): number => {
    let end = start;
    while (end + 1 < body.length) {
        const next = body[end + 1];
        if (!next || descriptorCalleeOf(next) !== callee) {
            break;
        }
        end += 1;
    }
    return end;
};

const scanRun = (body: AstNode[], start: number, ctx: { onHit: OnHit; threshold: number }): number => {
    const head = body[start];
    if (!head) {
        return start + 1;
    }
    const callee = descriptorCalleeOf(head);
    if (callee === null) {
        return start + 1;
    }
    const end = extendRun(body, start, callee);
    if (end - start + 1 >= ctx.threshold) {
        ctx.onHit(head, callee, ctx.threshold);
    }
    return end + 1;
};

const scanBody = (body: AstNode[], threshold: number, onHit: OnHit): void => {
    let start = 0;
    while (start < body.length) {
        start = scanRun(body, start, { onHit, threshold });
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const threshold = resolveThreshold(context.options[0]);
        const onHit: OnHit = (node, callee, count) => {
            if (isRuleNode(node)) {
                context.report({ data: { callee, count: String(count) }, messageId: "callEnumeration", node });
            }
        };
        const visit = (node: Rule.Node): void => {
            const body = asNode(node)?.body;
            if (Array.isArray(body)) {
                scanBody(body, threshold, onHit);
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["BlockStatement", visit],
            ["Program", visit],
            ["StaticBlock", visit],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["open-closed"],
        description:
            "Disallow a run of consecutive statement-calls to the same callee — mandate a declarative data collection folded by iteration",
        messages: {
            callEnumeration:
                "{{count}} consecutive statements call '{{callee}}' with a descriptor object literal — a list of similar definitions enumerated as repeated code. Collect the descriptors into one declarative frozen array (const ITEMS = [ {{callee}}({...}), ... ]) and consume that array, so a new entry is a data row rather than another statement.",
        },
        ruleId: "call_enumeration_to_data",
        schema: [
            {
                additionalProperties: false,
                properties: { threshold: { maximum: 20, minimum: 3, type: "integer" } },
                type: "object",
            },
        ],
    }),
} satisfies Rule.RuleModule;
