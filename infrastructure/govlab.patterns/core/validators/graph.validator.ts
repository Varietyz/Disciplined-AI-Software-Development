import {
    deadNode,
    effectCycle,
    missingProducer,
    orphanNode,
    ownProducer,
    producedTwice,
    stepsBack,
} from "#configuration/strings/graph.strings";
import type { Node } from "#types/graph.types";
import { reasoningRank } from "#core/resolvers/axis.resolver";

export class GraphError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "GraphError";
    }
}

interface WalkState {
    index: ReadonlyMap<string, Node>;
    visiting: Set<string>;
    done: Set<string>;
}

const indexNodes = function indexNodes(nodes: readonly Node[]): Map<string, Node> {
    const index = new Map<string, Node>();
    for (const node of nodes) {
        if (index.has(node.id)) {
            throw new GraphError(producedTwice(node.id));
        }
        index.set(node.id, node);
    }
    return index;
};

const checkEdges = function checkEdges(nodes: readonly Node[], index: ReadonlyMap<string, Node>): void {
    for (const node of nodes) {
        for (const producer of node.inputs) {
            if (!index.has(producer)) {
                throw new GraphError(missingProducer(node.id, producer));
            }
            if (producer === node.id) {
                throw new GraphError(ownProducer(node.id));
            }
        }
    }
};

const walk = function walk(nodeId: string, state: WalkState): void {
    if (state.done.has(nodeId)) {
        return;
    }
    if (state.visiting.has(nodeId)) {
        throw new GraphError(effectCycle(nodeId));
    }
    state.visiting.add(nodeId);
    for (const producer of state.index.get(nodeId)?.inputs ?? []) {
        walk(producer, state);
    }
    state.visiting.delete(nodeId);
    state.done.add(nodeId);
};

const checkAcyclic = function checkAcyclic(nodes: readonly Node[], index: ReadonlyMap<string, Node>): void {
    const state: WalkState = { done: new Set<string>(), index, visiting: new Set<string>() };
    for (const node of nodes) {
        walk(node.id, state);
    }
};

const checkMonotone = function checkMonotone(nodes: readonly Node[], index: ReadonlyMap<string, Node>): void {
    for (const node of nodes) {
        for (const producer of node.inputs) {
            const upstream = index.get(producer);
            if (upstream && reasoningRank(upstream.reasoning) > reasoningRank(node.reasoning)) {
                throw new GraphError(stepsBack(producer, node.id));
            }
        }
    }
};

const checkReachable = function checkReachable(nodes: readonly Node[]): void {
    const consumed = new Set(nodes.flatMap((node) => node.inputs));
    for (const node of nodes) {
        if (node.kind !== "source" && node.inputs.length === 0) {
            throw new GraphError(orphanNode(node.id));
        }
        if (node.kind === "analysis" && !consumed.has(node.id)) {
            throw new GraphError(deadNode(node.id));
        }
    }
};

export const validateGraph = function validateGraph(nodes: readonly Node[]): void {
    const index = indexNodes(nodes);
    checkEdges(nodes, index);
    checkAcyclic(nodes, index);
    checkMonotone(nodes, index);
    checkReachable(nodes);
};
