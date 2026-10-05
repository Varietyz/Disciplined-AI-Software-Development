import type { Rule } from "eslint";
import { absolutePath } from "@ssot/paths";
import fs from "node:fs";
import { govlabMeta } from "#core/factories/eslint.factory";
import path from "node:path";

const SURFACE_DATA = "surface.data.json";
const CORRECTNESS_SUFFIX = "-correctness";

interface AstNode {
    type: string;
    name?: string;
    value?: unknown;
    callee?: AstNode;
    arguments?: AstNode[];
}

let cachedTags: Set<string> | null = null;

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const isAstNode = function isAstNode(value: unknown): value is AstNode {
    return isRecord(value) && "type" in value;
};

const isRuleNode = function isRuleNode(value: unknown): value is Rule.Node {
    return isRecord(value) && "type" in value;
};

const recordsOf = function recordsOf(parsed: unknown): unknown[] {
    return isRecord(parsed) && Array.isArray(parsed["records"]) ? parsed["records"] : [];
};

const collectTag = function collectTag(tags: Set<string>, id: string): void {
    tags.add(id);
    if (id.endsWith(CORRECTNESS_SUFFIX)) {
        tags.add(id.slice(0, id.length - CORRECTNESS_SUFFIX.length));
    }
};

const readSurfaceTags = function readSurfaceTags(): Set<string> {
    const tags = new Set<string>();
    const raw = fs.readFileSync(path.join(absolutePath("govlab.context.reasoning"), SURFACE_DATA), "utf8");
    const parsed: unknown = JSON.parse(raw);
    for (const record of recordsOf(parsed)) {
        const id = isRecord(record) ? record["id"] : null;
        if (typeof id === "string" && id.length > 0) {
            collectTag(tags, id);
        }
    }
    return tags;
};

const loadSurfaceTags = function loadSurfaceTags(): Set<string> {
    cachedTags ??= readSurfaceTags();
    return cachedTags;
};

const leadingTag = function leadingTag(text: string): string | null {
    let start = 0;
    while (start < text.length && text.charAt(start) === " ") {
        start += 1;
    }
    if (text.charAt(start) !== "[") {
        return null;
    }
    const close = text.indexOf("]", start);
    if (close === -1) {
        return null;
    }
    return text.slice(start + 1, close);
};

const stringArg = function stringArg(value: unknown): { node: AstNode; value: string } | null {
    if (!isAstNode(value)) {
        return null;
    }
    const { callee } = value;
    if (callee?.type !== "Identifier" || (callee.name !== "test" && callee.name !== "it")) {
        return null;
    }
    const [first] = value.arguments ?? [];
    if (first?.type !== "Literal" || typeof first.value !== "string") {
        return null;
    }
    return { node: first, value: first.value };
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const file = context.filename.split("\\").join("/");
        if (!file.includes(".test.")) {
            return {};
        }
        const tags = loadSurfaceTags();
        if (tags.size === 0) {
            return {};
        }
        const onCall = (node: Rule.Node): void => {
            const arg = stringArg(node);
            if (arg === null) {
                return;
            }
            const tag = leadingTag(arg.value);
            if (tag !== null && !tags.has(tag) && isRuleNode(arg.node)) {
                context.report({ data: { tag }, messageId: "unknownSurface", node: arg.node });
            }
        };
        return Object.fromEntries([["CallExpression", onCall]]);
    },
    meta: govlabMeta({
        canonical: ["test-quality"],
        description:
            "A [tag] prefix on a test/it name declares the test-surface it covers and must be a canonical surface from @govlab/context — the full id or its short form without the -correctness suffix — so surface coverage stays classifiable and drift-free.",
        messages: {
            unknownSurface:
                "Unknown test-surface tag '[{{tag}}]' — use a canonical surface id or short form from @govlab/context testSurfaces().",
        },
        ruleId: "valid_test_surface",
        schema: [],
    }),
} satisfies Rule.RuleModule;
