import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt, stringAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { isVerbOrOpensWith } from "../../shared/manifests/verb.manifest.ts";
import { listener } from "../../shared/factories/listener.factory.ts";
import ts from "typescript";

const LIFECYCLE_VERBS: readonly string[] = [
    "attach",
    "connect",
    "init",
    "initialize",
    "listen",
    "mount",
    "observe",
    "open",
    "run",
    "start",
    "subscribe",
    "watch",
];

const EXEMPT_BASENAME_SUFFIXES = [".test.ts", ".spec.ts"];

const BIND = "bind";

const basenameOf = function basenameOf(path: string): string {
    const norm = path.split("\\").join("/");
    const idx = norm.lastIndexOf("/");
    return idx === -1 ? norm : norm.slice(idx + 1);
};

const isExemptFile = function isExemptFile(filename: string): boolean {
    const basename = basenameOf(filename);
    return EXEMPT_BASENAME_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const calleeNameOf = function calleeNameOf(callee: AstNode | null): string {
    if (callee === null) {
        return "";
    }
    if (callee.type === "Identifier") {
        return nameOf(callee);
    }
    if (callee.type === "MemberExpression") {
        const property = nodeAt(callee, "property");
        return isType(property, "Identifier") ? nameOf(property) : "";
    }
    if (callee.type === "ChainExpression") {
        return calleeNameOf(nodeAt(callee, "expression"));
    }
    return "";
};

const isLifecycleCall = function isLifecycleCall(node: AstNode): boolean {
    const callee = nodeAt(node, "callee");
    const name = calleeNameOf(callee);
    if (name === "" || callee === null) {
        return false;
    }
    if (callee.type === "Identifier") {
        return isVerbOrOpensWith(name, LIFECYCLE_VERBS);
    }
    return LIFECYCLE_VERBS.includes(name);
};

const isReturnDiscarded = function isReturnDiscarded(node: AstNode): boolean {
    const parent = nodeAt(node, "parent");
    if (parent === null) {
        return false;
    }
    if (parent.type === "ExpressionStatement") {
        return true;
    }
    return parent.type === "ChainExpression" && isType(nodeAt(parent, "parent"), "ExpressionStatement");
};

const isWrappedInVoid = function isWrappedInVoid(node: AstNode): boolean {
    const parent = nodeAt(node, "parent");
    return parent?.type === "UnaryExpression" && stringAt(parent, "operator") === "void";
};

interface TypedServices {
    readonly program: ts.Program;
    readonly esTreeNodeToTSNodeMap: { readonly get: (node: unknown) => ts.Node };
}

const isTypedServices = function isTypedServices(value: unknown): value is TypedServices {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const program: unknown = Reflect.get(value, "program");
    const map: unknown = Reflect.get(value, "esTreeNodeToTSNodeMap");
    if (typeof program !== "object" || program === null) {
        return false;
    }
    return typeof map === "object" && map !== null && typeof Reflect.get(map, "get") === "function";
};

const EMPTY_RETURNS: ReadonlySet<ts.TypeFlags> = new Set([ts.TypeFlags.Void, ts.TypeFlags.Undefined]);

const returnsNothing = function returnsNothing(context: RuleContext, node: unknown): boolean {
    const services: unknown = Reflect.get(context.sourceCode, "parserServices");
    if (!isTypedServices(services)) {
        return false;
    }
    const type = services.program.getTypeChecker().getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return EMPTY_RETURNS.has(type.getFlags());
};

const boundLifecycleName = function boundLifecycleName(node: AstNode): string {
    const callee = nodeAt(node, "callee");
    if (!isType(callee, "MemberExpression") || calleeNameOf(callee) !== BIND) {
        return "";
    }
    const target = nodeAt(callee, "object");
    const name = isType(target, "MemberExpression") ? calleeNameOf(target) : "";
    return LIFECYCLE_VERBS.includes(name) ? name : "";
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            callExpression(view, node) {
                const bound = boundLifecycleName(view);
                if (bound !== "") {
                    context.report({ data: { name: bound }, messageId: "lifecycleBound", node });
                    return;
                }
                if (!isLifecycleCall(view) || !isReturnDiscarded(view) || isWrappedInVoid(view)) {
                    return;
                }
                if (returnsNothing(context, node)) {
                    return;
                }
                const name = calleeNameOf(nodeAt(view, "callee"));
                context.report({ data: { name }, messageId: "handleDiscarded", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: [] }),
            description:
                "A lifecycle call that returns a handle must have that return captured. Which calls are lifecycle calls is DERIVED from the verb the name opens with, never from a list of known functions — a list omits every runner added after it was written, and this rule's whole value is catching the new one. A free function matches when its name begins with a lifecycle verb at a camel-case boundary, so a runner named for what it starts is caught the day it is written. A method matches only when its name IS the bare verb, which keeps the platform's verb-prefixed accessors out without naming any of them. Discarding the return throws away the dispose path and creates silent lifecycle drift: either store the handle and call it on teardown, or mark the discard intentional with an explicit void. Where the type checker is available, a call whose type says it returns nothing has no handle to lose and is not reported; without type information every discarded lifecycle call is reported. Binding a lifecycle method to call it later hides the call from this check, so the bind itself is reported.",
        },
        messages: {
            handleDiscarded:
                "Lifecycle call `{{ name }}(...)` discards its return value. If the function returns a handle (`{ unmount }` / `{ stop }` / `{ dispose }`), the cleanup path is lost. Either: (a) `const handle = {{ name }}(...)` and call `handle.unmount/stop/dispose` in your teardown, OR (b) wrap as `void {{ name }}(...)` to declare the discard intentional.",
            lifecycleBound:
                "The lifecycle method `{{ name }}` is bound to be called later, which hides the call from the handle check. Call the method directly, so the check can see whether its return carries a handle.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
