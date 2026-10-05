import type { Rule, SourceCode } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

const SAFE_VALUE_TYPES = new Set([
    "Literal",
    "ObjectExpression",
    "ArrayExpression",
    "Identifier",
    "TemplateLiteral",
    "MemberExpression",
]);
const FUNCTION_TYPES = new Set(["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"]);

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object";
};

const nodeType = function nodeType(node: Record<string, unknown>): string {
    return typeof node["type"] === "string" ? node["type"] : "";
};

const isTestFile = function isTestFile(filename: string): boolean {
    const unix = filename.split("\\").join("/");
    return unix.includes("/tests/") || unix.includes(".test.") || unix.includes(".spec.");
};

const childRecords = function* childRecords(value: unknown): Generator<Record<string, unknown>> {
    const items = Array.isArray(value) ? value : [value];
    for (const item of items) {
        if (isRecord(item)) {
            yield item;
        }
    }
};

const eachChild = function* eachChild(node: Record<string, unknown>): Generator<Record<string, unknown>> {
    for (const key of Object.keys(node)) {
        if (key !== "parent") {
            yield* childRecords(node[key]);
        }
    }
};

const hasOwnAwait = function hasOwnAwait(value: unknown): boolean {
    if (!isRecord(value)) {
        return false;
    }
    const node = value;
    const type = nodeType(node);
    if (type === "AwaitExpression") {
        return true;
    }
    if (type === "ForOfStatement" && node["await"] === true) {
        return true;
    }
    for (const child of eachChild(node)) {
        if (!FUNCTION_TYPES.has(nodeType(child)) && hasOwnAwait(child)) {
            return true;
        }
    }
    return false;
};

const collectOwnReturnArgs = function collectOwnReturnArgs(node: Record<string, unknown>): unknown[] {
    if (nodeType(node) === "ReturnStatement") {
        return [node["argument"]];
    }
    const out: unknown[] = [];
    for (const child of eachChild(node)) {
        if (!FUNCTION_TYPES.has(nodeType(child))) {
            out.push(...collectOwnReturnArgs(child));
        }
    }
    return out;
};

const isSafeReturn = function isSafeReturn(value: unknown): boolean {
    if (!isRecord(value)) {
        return true;
    }
    const type = nodeType(value);
    if (SAFE_VALUE_TYPES.has(type)) {
        return true;
    }
    if (type === "LogicalExpression") {
        return isSafeReturn(value["left"]) && isSafeReturn(value["right"]);
    }
    if (type === "ConditionalExpression") {
        return isSafeReturn(value["consequent"]) && isSafeReturn(value["alternate"]);
    }
    return false;
};

const bodyReturnsOnlySafe = function bodyReturnsOnlySafe(body: unknown): boolean {
    if (!isRecord(body)) {
        return false;
    }
    if (nodeType(body) === "BlockStatement") {
        return collectOwnReturnArgs(body).every(isSafeReturn);
    }
    return isSafeReturn(body);
};

type FnNode = Extract<Rule.Node, { type: "ArrowFunctionExpression" | "FunctionDeclaration" | "FunctionExpression" }>;

interface StubFixCtx {
    source: SourceCode;
    node: Rule.Node;
    body: FnNode["body"];
}

const buildStubFix = function buildStubFix(fixer: Rule.RuleFixer, ctx: StubFixCtx): Rule.Fix | null {
    const { source, node, body } = ctx;
    if (body.type === "BlockStatement") {
        const brace = source.getFirstToken(body);
        return brace === null ? null : fixer.insertTextAfter(brace, " await Promise.resolve();");
    }
    const arrow = source.getTokenBefore(body, { filter: (token): boolean => token.value === "=>" });
    const lastToken = source.getLastToken(node);
    if (arrow === null || lastToken === null) {
        return null;
    }
    return fixer.replaceTextRange(
        [arrow.range[1], lastToken.range[1]],
        ` { await Promise.resolve(); return (${source.getText(body)}); }`,
    );
};

const checkAsyncStub = function checkAsyncStub(context: Rule.RuleContext, node: Rule.Node): void {
    if (
        node.type !== "FunctionDeclaration" &&
        node.type !== "FunctionExpression" &&
        node.type !== "ArrowFunctionExpression"
    ) {
        return;
    }
    if (node.async !== true || node.generator === true) {
        return;
    }
    if (!isTestFile(context.filename)) {
        return;
    }
    const { body } = node;
    if (hasOwnAwait(body) || !bodyReturnsOnlySafe(body)) {
        return;
    }
    context.report({
        fix: (fixer: Rule.RuleFixer): Rule.Fix | null =>
            buildStubFix(fixer, { body, node, source: context.sourceCode }),
        messageId: "asyncStubNeedsAwait",
        node,
    });
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        return Object.fromEntries([
            [
                ":function",
                (node: Rule.Node): void => {
                    checkAsyncStub(context, node);
                },
            ],
        ]);
    },
    meta: govlabMeta({
        canonical: ["test-quality"],
        description:
            "An async function in a test file that contains no await and returns only a synchronous value is normalized to await a resolved promise as its first action. A body that returns or delegates to a call expression is left untouched, since it may already return a promise",
        fixable: "code",
        messages: {
            asyncStubNeedsAwait:
                "Async test function with no await returning a synchronous value. Await a resolved promise as the first statement, or drop async and return a resolved promise.",
        },
        ruleId: "no_async_test_without_await",
    }),
} satisfies Rule.RuleModule;
