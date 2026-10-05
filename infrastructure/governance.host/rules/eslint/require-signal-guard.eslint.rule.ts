import type { Rule } from "eslint";
import { defineCheck } from "@govlab/context/check";

defineCheck({ detects: ["architecture:unobservable-failure"], enforces: ["architecture:error-handling"] });

interface AstNode {
    type: string;
    name?: string;
    callee?: AstNode;
    id?: AstNode;
}

const SPAWN_CALLEE = "spawnTool";
const GUARD_NAMES = new Set(["signalKilled", "signalDeathResult", "terminalOf", "passOf"]);

const MESSAGE =
    "A spawned tool that dies by a signal reports no exit status, and a caller that gates on that status reads the killed run as a clean one. Check the spawn result for signal death before any exit status gates it, by classifying the result for a terminal outcome or by testing for signal death and returning the signal-death result. [require_signal_guard]";

const isNode = function isNode(value: unknown): value is AstNode {
    return value !== null && typeof value === "object" && "type" in value;
};

const asNode = function asNode(value: unknown): AstNode | null {
    return isNode(value) ? value : null;
};

interface GuardState {
    declaresSpawn: boolean;
    sawGuard: boolean;
    spawnNode: Rule.Node | null;
}

const makeNoteIdentifier = function makeNoteIdentifier(state: GuardState): (node: Rule.Node) => void {
    return function noteIdentifier(node: Rule.Node): void {
        const name = asNode(node)?.name;
        if (name !== undefined && GUARD_NAMES.has(name)) {
            state.sawGuard = true;
        }
    };
};

const makeOnDeclarator = function makeOnDeclarator(state: GuardState): (node: Rule.Node) => void {
    return function onDeclarator(node: Rule.Node): void {
        if (asNode(node)?.id?.name === SPAWN_CALLEE) {
            state.declaresSpawn = true;
        }
    };
};

const makeOnCall = function makeOnCall(state: GuardState): (node: Rule.Node) => void {
    return function onCall(node: Rule.Node): void {
        const call = asNode(node);
        if (state.spawnNode === null && call?.callee?.type === "Identifier" && call.callee.name === SPAWN_CALLEE) {
            state.spawnNode = node;
        }
    };
};

const makeOnProgramExit = function makeOnProgramExit(context: Rule.RuleContext, state: GuardState): () => void {
    return function onProgramExit(): void {
        if (state.spawnNode !== null && !state.sawGuard && !state.declaresSpawn) {
            context.report({ messageId: "guard", node: state.spawnNode });
        }
    };
};

const requireSignalGuard: Rule.RuleModule = {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const state: GuardState = { declaresSpawn: false, sawGuard: false, spawnNode: null };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["CallExpression", makeOnCall(state)],
            ["Identifier", makeNoteIdentifier(state)],
            ["VariableDeclarator", makeOnDeclarator(state)],
            ["Program:exit", makeOnProgramExit(context, state)],
        ];
        return Object.fromEntries(handlers);
    },
    meta: {
        docs: {
            description:
                "A spawned child that dies by signal reports no exit status, so coercing that absent status to success folds a killed process into the clean path and parses its missing output as zero findings — a false all-clear, the worst outcome a gate can produce. Check for signal death immediately after the spawn's error branch, before any status coercion.",
        },
        messages: { guard: MESSAGE },
        schema: [],
        type: "problem",
    },
};

export default {
    plugins: { "govlab-quality": { rules: { "require-signal-guard": requireSignalGuard } } },
    tool: "eslint",
};
