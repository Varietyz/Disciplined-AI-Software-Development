import type { DocGraph, DocNode, NodeEdgeField, NodeEdges } from "#types/document.types";

const VISITING = 0;
const DONE = 1;
const CYCLE_KEY_SEPARATOR = "|";

const NAME_EDGE_FIELDS: readonly NodeEdgeField[] = [
    { field: "depends-on", key: "dependsOn" },
    { field: "links", key: "links" },
    { field: "supersedes", key: "supersedes" },
];

class CycleDetector {
    public readonly cycles: string[][] = [];
    private readonly state = new Map<string, number>();
    private readonly stack: string[] = [];
    private readonly seenCycle = new Set<string>();
    private readonly byName: Readonly<Record<string, DocNode>>;

    public constructor(byName: Readonly<Record<string, DocNode>>) {
        this.byName = byName;
    }

    public visit(name: string): void {
        const mark = this.state.get(name);
        if (mark === DONE) {
            return;
        }
        if (mark === VISITING) {
            this.recordCycle(name);
            return;
        }
        this.state.set(name, VISITING);
        this.stack.push(name);
        for (const dep of this.byName[name]?.dependsOn ?? []) {
            if (Object.hasOwn(this.byName, dep)) {
                this.visit(dep);
            }
        }
        this.stack.pop();
        this.state.set(name, DONE);
    }

    private recordCycle(name: string): void {
        const cycle = this.stack.slice(this.stack.indexOf(name));
        const key = cycle.toSorted((left, right) => left.localeCompare(right)).join(CYCLE_KEY_SEPARATOR);
        if (!this.seenCycle.has(key)) {
            this.seenCycle.add(key);
            this.cycles.push([...cycle, name]);
        }
    }
}

const resolveNodeEdges = function resolveNodeEdges(
    node: DocNode,
    byName: Readonly<Record<string, DocNode>>,
): NodeEdges {
    const dead = NAME_EDGE_FIELDS.flatMap(({ key, field }) =>
        node[key]
            .filter((target) => !Object.hasOwn(byName, target))
            .map((target) => ({ field, from: node.name, relPath: node.relPath, target })),
    );
    const superseded = node.supersedes.filter((target) => Object.hasOwn(byName, target));
    return { dead, superseded };
};

const indexNodes = function indexNodes(nodes: readonly DocNode[]): {
    byName: Record<string, DocNode>;
    duplicateNames: string[];
} {
    const byName: Record<string, DocNode> = {};
    const duplicates = new Set<string>();
    for (const node of nodes) {
        if (Object.hasOwn(byName, node.name)) {
            duplicates.add(node.name);
        } else {
            byName[node.name] = node;
        }
    }
    return { byName, duplicateNames: [...duplicates] };
};

export const buildDocGraph = function buildDocGraph(nodes: DocNode[]): DocGraph {
    const { byName, duplicateNames } = indexNodes(nodes);
    const edges = nodes.map((node) => resolveNodeEdges(node, byName));
    const detector = new CycleDetector(byName);
    for (const node of nodes) {
        detector.visit(node.name);
    }
    return {
        byName,
        cycles: detector.cycles,
        deadEdges: edges.flatMap((edge) => edge.dead),
        duplicateNames,
        nodes,
        superseded: [...new Set(edges.flatMap((edge) => edge.superseded))],
    };
};
