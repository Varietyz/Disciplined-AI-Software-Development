import type { CodeEdge, CodeGraph, CodeNode } from "#types/graph.types";

export class GraphStore {
    readonly #nodes = new Map<string, CodeNode>();
    readonly #edges: CodeEdge[] = [];
    readonly #visited = new Set<string>();
    #unresolved = 0;

    public get unresolved(): number {
        return this.#unresolved;
    }

    public bumpUnresolved(): void {
        this.#unresolved += 1;
    }

    public addNode(node: CodeNode): void {
        if (!this.#nodes.has(node.id)) {
            this.#nodes.set(node.id, node);
        }
    }

    public pushEdge(edge: CodeEdge): void {
        this.#edges.push(edge);
    }

    public hasVisited(id: string): boolean {
        return this.#visited.has(id);
    }

    public markVisited(id: string): void {
        this.#visited.add(id);
    }

    public result(): CodeGraph {
        return { edges: this.#edges, nodes: [...this.#nodes.values()] };
    }
}
