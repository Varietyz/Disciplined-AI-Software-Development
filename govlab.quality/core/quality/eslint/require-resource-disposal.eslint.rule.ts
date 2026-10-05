import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

const DISPOSE_METHOD = "delete";
const DISPOSABLE_MODULES = new Set(["web-tree-sitter"]);

interface Frame {
    acquisitions: Rule.Node[];
    disposed: boolean;
}

const newCalleeName = function newCalleeName(node: Rule.Node): string | null {
    if (node.type !== "NewExpression") {
        return null;
    }
    const { callee } = node;
    return callee.type === "Identifier" ? callee.name : null;
};

const isDisposeCall = function isDisposeCall(node: Rule.Node): boolean {
    if (node.type !== "CallExpression") {
        return false;
    }
    const { callee } = node;
    if (callee.type !== "MemberExpression" || callee.property.type !== "Identifier") {
        return false;
    }
    return callee.property.name === DISPOSE_METHOD;
};

const importsDisposable = function importsDisposable(node: Rule.Node): boolean {
    return (
        node.type === "ImportDeclaration" &&
        typeof node.source.value === "string" &&
        DISPOSABLE_MODULES.has(node.source.value)
    );
};

class DisposalVisitor {
    private readonly disposableCtors = new Set<string>();
    private readonly frames: Frame[] = [];
    private readonly context: Rule.RuleContext;

    public constructor(context: Rule.RuleContext) {
        this.context = context;
    }

    public listeners(): Rule.RuleListener {
        const enter = this.enter.bind(this);
        const exit = this.exit.bind(this);
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["ArrowFunctionExpression", enter],
            ["ArrowFunctionExpression:exit", exit],
            ["CallExpression", this.onCall.bind(this)],
            ["FunctionDeclaration", enter],
            ["FunctionDeclaration:exit", exit],
            ["FunctionExpression", enter],
            ["FunctionExpression:exit", exit],
            ["ImportDeclaration", this.onImport.bind(this)],
            ["NewExpression", this.onNew.bind(this)],
        ];
        return Object.fromEntries(handlers);
    }

    private onImport(node: Rule.Node): void {
        if (importsDisposable(node) && node.type === "ImportDeclaration") {
            for (const spec of node.specifiers) {
                this.disposableCtors.add(spec.local.name);
            }
        }
    }

    private enter(): void {
        this.frames.push({ acquisitions: [], disposed: false });
    }

    private exit(): void {
        const frame = this.frames.pop();
        if (!frame || frame.disposed) {
            return;
        }
        for (const acquisition of frame.acquisitions) {
            this.context.report({ messageId: "undisposed", node: acquisition });
        }
    }

    private onNew(node: Rule.Node): void {
        const name = newCalleeName(node);
        const frame = this.frames.at(-1);
        if (frame && name !== null && this.disposableCtors.has(name)) {
            frame.acquisitions.push(node);
        }
    }

    private onCall(node: Rule.Node): void {
        const frame = this.frames.at(-1);
        if (frame && isDisposeCall(node)) {
            frame.disposed = true;
        }
    }
}

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        return new DisposalVisitor(context).listeners();
    },
    meta: govlabMeta({
        canonical: ["resource-leak"],
        description:
            "Require a .delete() disposal for every WASM or native resource acquired in a function. The disposable set is declared in DISPOSABLE_MODULES.",
        messages: {
            undisposed:
                "This acquires a disposable WASM or native resource, declared in DISPOSABLE_MODULES, but the enclosing function never calls .delete(). Dispose every acquired handle, in a finally block.",
        },
        ruleId: "require_resource_disposal",
        type: "problem",
    }),
} satisfies Rule.RuleModule;
