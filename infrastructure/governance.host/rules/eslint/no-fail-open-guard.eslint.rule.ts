import type { Rule } from "eslint";
import { defineCheck } from "@govlab/context/check";

defineCheck({ detects: [], enforces: ["architecture:fail-secure"] });

import { folderFor } from "../../shared/manifests/taxonomy.manifest.ts";

interface AstNode {
    type: string;
    name?: string;
    callee?: AstNode;
    params?: AstNode[];
}

const GUARD_CONCERN = "guard";
const GUARD_FOLDER = folderFor(GUARD_CONCERN);

const GUARD_PATH_MARKERS = new Set(
    ["middleware", GUARD_FOLDER].filter((name): name is string => name !== undefined).map((name) => `/${name}/`),
);

const CONTINUATION_PARAMS = new Set(["next", "proceed", "allow", "continueRequest"]);

const MESSAGE =
    "A request guard must not continue the request from its failure path. This error handler invokes the same continuation the success path uses. Deny explicitly on the failure path. [no_fail_open_guard] [canon: quality:concept:input-validation]";

const isNode = function isNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isNode(value) ? value : null;
};

const normalize = function normalize(filename: string): string {
    return filename.split("\\").join("/");
};

const inGuardPath = function inGuardPath(filename: string): boolean {
    for (const marker of GUARD_PATH_MARKERS) {
        if (filename.includes(marker)) {
            return true;
        }
    }
    return false;
};

const continuationOf = function continuationOf(node: Rule.Node): string {
    const fn = asNode(node);
    const params = fn?.params ?? [];
    for (const param of params) {
        const name = param.name ?? "";
        if (CONTINUATION_PARAMS.has(name)) {
            return name;
        }
    }
    return "";
};

interface Tracker {
    onCall: (node: Rule.Node) => void;
    onCatchEnter: () => void;
    onCatchExit: () => void;
    onEnter: (node: Rule.Node) => void;
    onExit: (node: Rule.Node) => void;
}

interface ContinuationStack {
    active: () => readonly string[];
    pop: (node: Rule.Node) => void;
    push: (node: Rule.Node) => void;
}

const createContinuationStack = function createContinuationStack(): ContinuationStack {
    let active: readonly string[] = [];
    return {
        active: (): readonly string[] => active,
        pop(node: Rule.Node): void {
            if (continuationOf(node).length > 0) {
                active = active.slice(0, -1);
            }
        },
        push(node: Rule.Node): void {
            const continuation = continuationOf(node);
            if (continuation.length > 0) {
                active = [...active, continuation];
            }
        },
    };
};

interface CatchDepth {
    enter: () => void;
    exit: () => void;
    inside: () => boolean;
}

const createCatchDepth = function createCatchDepth(): CatchDepth {
    let depth = 0;
    return {
        enter: (): void => {
            depth += 1;
        },
        exit: (): void => {
            depth -= 1;
        },
        inside: (): boolean => depth > 0,
    };
};

const createTracker = function createTracker(context: Rule.RuleContext): Tracker {
    const stack = createContinuationStack();
    const catches = createCatchDepth();
    return {
        onCall(node: Rule.Node): void {
            const callee = asNode(node)?.callee;
            if (catches.inside() && callee?.type === "Identifier" && stack.active().includes(callee.name ?? "")) {
                context.report({ messageId: "failOpen", node });
            }
        },
        onCatchEnter: catches.enter,
        onCatchExit: catches.exit,
        onEnter: stack.push,
        onExit: stack.pop,
    };
};

const listenersFor = function listenersFor(tracker: Tracker): Rule.RuleListener {
    const entries: [string, (node: Rule.Node) => void][] = [
        ["FunctionDeclaration", tracker.onEnter],
        ["FunctionDeclaration:exit", tracker.onExit],
        ["FunctionExpression", tracker.onEnter],
        ["FunctionExpression:exit", tracker.onExit],
        ["ArrowFunctionExpression", tracker.onEnter],
        ["ArrowFunctionExpression:exit", tracker.onExit],
        ["CallExpression", tracker.onCall],
    ];
    const catchEntries: [string, () => void][] = [
        ["CatchClause", tracker.onCatchEnter],
        ["CatchClause:exit", tracker.onCatchExit],
    ];
    return Object.fromEntries([...entries, ...catchEntries]);
};

const noFailOpenGuard: Rule.RuleModule = {
    create(context: Rule.RuleContext): Rule.RuleListener {
        if (!inGuardPath(normalize(context.filename))) {
            return {};
        }
        return listenersFor(createTracker(context));
    },
    meta: {
        docs: {
            description:
                "A guard that cannot determine the answer refuses rather than allows. A failure path that returns the permissive value, or invokes the success continuation, is a fail-open guard.",
        },
        messages: { failOpen: MESSAGE },
        schema: [],
        type: "problem",
    },
};

export default { plugins: { "govlab-local": { rules: { "no-fail-open-guard": noFailOpenGuard } } }, tool: "eslint" };
