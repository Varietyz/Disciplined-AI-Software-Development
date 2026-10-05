import type { CodeFinding, ModuleEdge } from "#types/code.types";
import {
    FINDING_KINDS,
    MEMBER_ARROW,
    REMEDY,
    cycleDetail,
    importCycleDetail,
} from "#configuration/strings/code.strings";
import { HIGH_SEVERITY } from "#configuration/constants/report.constants";
import { scopeOf } from "#core/formatters/definition.formatter";

const REL_CYCLE = 9;
const MIN_CYCLE = 2;
const CONFIDENCE = "high";

class SccFinder {
    private readonly adj: ReadonlyMap<string, string[]>;
    private readonly index = new Map<string, number>();
    private readonly low = new Map<string, number>();
    private readonly onStack = new Set<string>();
    private readonly stack: string[] = [];
    private readonly sccs: string[][] = [];
    private counter = 0;

    public constructor(adj: ReadonlyMap<string, string[]>) {
        this.adj = adj;
    }

    public run(nodes: readonly string[]): string[][] {
        for (const node of nodes) {
            if (!this.index.has(node)) {
                this.strongConnect(node);
            }
        }
        return this.sccs;
    }

    private visit(node: string, next: string): void {
        if (!this.index.has(next)) {
            this.strongConnect(next);
            this.low.set(node, Math.min(this.low.get(node) ?? 0, this.low.get(next) ?? 0));
            return;
        }
        if (this.onStack.has(next)) {
            this.low.set(node, Math.min(this.low.get(node) ?? 0, this.index.get(next) ?? 0));
        }
    }

    private popScc(node: string): void {
        const scc: string[] = [];
        let popped = "";
        while (popped !== node) {
            popped = this.stack.pop() ?? node;
            this.onStack.delete(popped);
            scc.push(popped);
        }
        this.sccs.push(scc);
    }

    private strongConnect(node: string): void {
        this.index.set(node, this.counter);
        this.low.set(node, this.counter);
        this.counter += 1;
        this.stack.push(node);
        this.onStack.add(node);
        for (const next of this.adj.get(node) ?? []) {
            this.visit(node, next);
        }
        if (this.low.get(node) === this.index.get(node)) {
            this.popScc(node);
        }
    }
}

export const findStronglyConnected = function findStronglyConnected(
    adj: ReadonlyMap<string, string[]>,
    nodes: readonly string[],
): string[][] {
    return new SccFinder(adj).run(nodes);
};

const adjacencyOf = function adjacencyOf(edges: readonly ModuleEdge[]): Map<string, string[]> {
    const adj = new Map<string, string[]>();
    for (const edge of edges) {
        adj.set(edge.from, [...(adj.get(edge.from) ?? []), edge.to]);
    }
    return adj;
};

const cyclesOf = function cyclesOf(edges: readonly ModuleEdge[]): string[][] {
    const adj = adjacencyOf(edges);
    const nodes = [...new Set([...adj.keys(), ...[...adj.values()].flat()])];
    return findStronglyConnected(adj, nodes).filter((scc) => scc.length >= MIN_CYCLE);
};

const cycleFinding = function cycleFinding(kind: string, detail: string, members: string[], name: string): CodeFinding {
    return {
        confidence: CONFIDENCE,
        detail,
        file: "",
        kind,
        line: 0,
        members,
        name,
        relevance: REL_CYCLE,
        remedy: REMEDY.get(kind) ?? "",
        severity: HIGH_SEVERITY,
    };
};

export const callCycleFindings = function callCycleFindings(edges: readonly ModuleEdge[]): CodeFinding[] {
    return cyclesOf(edges)
        .filter((scc) => new Set(scc.map(scopeOf)).size > 1)
        .map((scc) => {
            const sorted = scc.toSorted((a, b) => a.localeCompare(b));
            const detail = cycleDetail(scc.length, sorted.join(MEMBER_ARROW));
            return cycleFinding(FINDING_KINDS.callCycle, detail, sorted, sorted[0] ?? "");
        });
};

export const moduleImportCycleFindings = function moduleImportCycleFindings(
    edges: readonly ModuleEdge[],
    titleOf: (dir: string) => string,
): Map<string, CodeFinding[]> {
    const out = new Map<string, CodeFinding[]>();
    for (const scc of cyclesOf(edges)) {
        const members = scc.toSorted((a, b) => a.localeCompare(b)).map(titleOf);
        const detail = importCycleDetail(scc.length, members.join(MEMBER_ARROW));
        for (const dir of scc) {
            const finding = cycleFinding(FINDING_KINDS.importCycle, detail, members, titleOf(dir));
            out.set(dir, [...(out.get(dir) ?? []), finding]);
        }
    }
    return out;
};
