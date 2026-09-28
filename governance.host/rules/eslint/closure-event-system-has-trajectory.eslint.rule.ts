import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import { normalizePath, projectFiles } from "../../shared/resolvers/anchor.resolver.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import type { ClosureGraph } from "../../types/closure.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { loadClosureGraph } from "../../shared/loaders/graph.loader.ts";
import { resolveFile } from "../../shared/matchers/filename.matcher.ts";

const LISTENER_REGISTRAR = "registerEventListener";
const PAYLOAD_MAP = "EventPayloadMap";
const EVENT_SUBJECT = "event";

const GRAPH = loadClosureGraph();

const listenerRegistryFile = function listenerRegistryFile(closure: ClosureGraph): string {
    return closure.exports.find((e) => e.name === LISTENER_REGISTRAR)?.file ?? "";
};

const isEventTypesFile = function isEventTypesFile(filename: string): boolean {
    return normalizePath(filename).endsWith(`/${resolveFile(EVENT_SUBJECT, "types", projectFiles())}`);
};

const countSubscribers = function countSubscribers(closure: ClosureGraph): number {
    const ownDefinition = listenerRegistryFile(closure);
    const external = closure.subscribes.filter((s) => ownDefinition === "" || s.file !== ownDefinition).length;
    return external + closure.eventActivity.filter((e) => e.fn === LISTENER_REGISTRAR).length;
};

const hasOnlyPlaceholderEvents = function hasOnlyPlaceholderEvents(node: AstNode | null): boolean {
    if (!isType(node, "TSInterfaceDeclaration") || nameOf(nodeAt(node, "id")) !== PAYLOAD_MAP) {
        return false;
    }
    const members = nodesAt(nodeAt(node, "body"), "body");
    if (members.length === 0) {
        return true;
    }
    return members.every((m) => {
        if (m.type !== "TSPropertySignature") {
            return false;
        }
        const annotation = nodeAt(nodeAt(m, "typeAnnotation"), "typeAnnotation");
        return isType(annotation, "TSNeverKeyword");
    });
};

const declaresRealEvents = function declaresRealEvents(program: AstNode): boolean {
    return nodesAt(program, "body").some((stmt) => {
        const declaration = stmt.type === "ExportNamedDeclaration" ? nodeAt(stmt, "declaration") : stmt;
        return isType(declaration, "TSInterfaceDeclaration") && !hasOnlyPlaceholderEvents(declaration);
    });
};

export default {
    create(context: RuleContext): RuleListener {
        if (!isEventTypesFile(context.filename)) {
            return {};
        }
        return listener({
            program(view, node) {
                if (GRAPH === null) {
                    context.report({ messageId: "graphMissing", node });
                    return;
                }
                const wired = countSubscribers(GRAPH) > 0 || GRAPH.emits.length > 0;
                if (!declaresRealEvents(view) || !wired) {
                    context.report({ messageId: "zeroTrajectory", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: ["architecture:speculative-generality"], enforces: [] }),
            description:
                "Where an event surface exists, it must have trajectory: at least one real, non-`never` payload declared in the payload map, AND at least one emit or subscribe site outside the registrar's own definition.",
        },
        messages: {
            graphMissing:
                "The closure graph is missing. Run the gate, whose auto-fix stage rebuilds the graph before linting reads it.",
            zeroTrajectory:
                "The event system is a zero-trajectory scaffold: its payload map holds only placeholders, or there is no emit site and no external subscribe site. Wire the first event end to end — payload entry, id, emit, listener — or delete the surface.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
