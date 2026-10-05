import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface AstNode {
    type: string;
    name?: string;
    argument?: AstNode;
    expression?: AstNode;
    arguments?: AstNode[];
    body?: AstNode[];
}

type OnHit = (node: AstNode, subject: string, count: number) => void;

const DEFAULT_THRESHOLD = 3;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const isAstNode = (value: unknown): value is AstNode => isRecord(value) && "type" in value;

const asNode = (value: unknown): AstNode | null => (isAstNode(value) ? value : null);

const isRuleNode = (value: unknown): value is Rule.Node => isRecord(value) && "type" in value;

const resolveThreshold = (raw: unknown): number => {
    const threshold = isRecord(raw) ? raw["threshold"] : DEFAULT_THRESHOLD;
    return typeof threshold === "number" ? threshold : DEFAULT_THRESHOLD;
};

const awaitedCallOf = (stmt: AstNode): AstNode | null => {
    if (stmt.type !== "ExpressionStatement" || stmt.expression?.type !== "AwaitExpression") {
        return null;
    }
    const call = stmt.expression.argument;
    return call?.type === "CallExpression" ? call : null;
};

const firstArgSubject = (call: AstNode): string | null => {
    const first = (call.arguments ?? []).at(0);
    if (!first) {
        return null;
    }
    if (first.type === "Identifier" && typeof first.name === "string") {
        return first.name;
    }
    return first.type === "ThisExpression" ? "this" : null;
};

const subjectOf = (stmt: AstNode): string | null => {
    const call = awaitedCallOf(stmt);
    return call === null ? null : firstArgSubject(call);
};

const extendRun = (body: AstNode[], start: number, subject: string): number => {
    let end = start;
    while (end + 1 < body.length) {
        const next = body[end + 1];
        if (!next || subjectOf(next) !== subject) {
            break;
        }
        end += 1;
    }
    return end;
};

const runSubject = (body: AstNode[], start: number): { end: number; subject: string | null } => {
    const head = body[start];
    if (!head) {
        return { end: start, subject: null };
    }
    const subject = subjectOf(head);
    if (subject === null) {
        return { end: start, subject: null };
    }
    return { end: extendRun(body, start, subject), subject };
};

const scanBody = (body: AstNode[], threshold: number, onHit: OnHit): void => {
    let start = 0;
    while (start < body.length) {
        const run = runSubject(body, start);
        const head = body[start];
        if (head && run.subject !== null && run.end - start + 1 >= threshold) {
            onHit(head, run.subject, threshold);
        }
        start = run.subject === null ? start + 1 : run.end + 1;
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const threshold = resolveThreshold(context.options[0]);
        const onHit: OnHit = (node, subject, count) => {
            if (isRuleNode(node)) {
                context.report({
                    data: { count: String(count), subject, threshold: String(threshold) },
                    messageId: "sequentialEffectBlock",
                    node,
                });
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
            "Disallow a flat sequential block of effect calls threading a shared subject — mandate a self-registering composable effect pipeline",
        messages: {
            sequentialEffectBlock:
                "This function threads '{{subject}}' through {{count}}+ consecutive awaited effect calls — a flat, hardcoded async pipeline that grows one line per concern and offers no composition, filtering, grouping, instrumentation, or dynamic registration. Replace it with a self-registering effect pipeline: define each effect once (the condition under which it applies, its order, its run), register it, and let a runner compose/filter/order/instrument the registered effects (the defineContextFragment/composeContext + defineTurnField pattern). Adding a concern then means registering an effect, not editing this function.",
        },
        ruleId: "sequential_effect_block",
        schema: [
            {
                additionalProperties: false,
                properties: { threshold: { maximum: 12, minimum: 2, type: "integer" } },
                type: "object",
            },
        ],
    }),
} satisfies Rule.RuleModule;
