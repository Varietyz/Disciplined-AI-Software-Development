import { DEPENDENCY_FIELDS, PACKAGE_MANIFEST } from "#configuration/constants/package.constants";
import type { DependencyGraph, Fans, GraphLink, GraphNode, GraphRow } from "#types/dependency.types";
import { field, stringField } from "#core/selectors/field.selector";
import { TOP_PACKAGES } from "#configuration/constants/metric.constants";
import { isRecord } from "#core/predicates/record.predicate";
import path from "node:path";
import { posixOf } from "#core/selectors/source.selector";
import { readJson } from "#core/loaders/data.loader";
import { workspaceMembers } from "#core/resolvers/package.resolver";

const declaredDependencies = function declaredDependencies(pkg: unknown): Set<string> {
    return new Set(
        DEPENDENCY_FIELDS.flatMap((fieldName) => {
            const block = field(pkg, fieldName);
            return isRecord(block) ? Object.keys(block) : [];
        }),
    );
};

const buildNodes = function buildNodes(root: string, dirs: readonly string[]): Map<string, GraphNode> {
    const nodes = new Map<string, GraphNode>();
    for (const dir of dirs) {
        const pkg = readJson(path.join(dir, PACKAGE_MANIFEST));
        const name = stringField(pkg, "name");
        if (name.length > 0) {
            nodes.set(name, { deps: declaredDependencies(pkg), name, rel: posixOf(path.relative(root, dir)) });
        }
    }
    return nodes;
};

const computeFans = function computeFans(nodes: Map<string, GraphNode>): Fans {
    const nodeList = [...nodes.values()];
    const internal = new Map(nodeList.map((node) => [node.name, [...node.deps].filter((dep) => nodes.has(dep))]));
    const fanOut = new Map(nodeList.map((node) => [node.name, internal.get(node.name)?.length ?? 0]));
    const fanIn = new Map(
        nodeList.map((node) => [
            node.name,
            nodeList.filter((other) => (internal.get(other.name) ?? []).includes(node.name)).length,
        ]),
    );
    return {
        edges: [...internal.values()].reduce((sum, deps) => sum + deps.length, 0),
        fanIn,
        fanOut,
        leaves: nodeList.filter((node) => (internal.get(node.name) ?? []).length === 0).length,
    };
};

const topRows = function topRows(counts: Map<string, number>, nodes: Map<string, GraphNode>): GraphRow[] {
    return [...counts.entries()]
        .filter(([, count]) => count > 0)
        .toSorted((a, b) => b[1] - a[1])
        .slice(0, TOP_PACKAGES)
        .map(([name, count]) => ({ count, name, rel: nodes.get(name)?.rel ?? "" }));
};

const linkedRows = function linkedRows(fans: Fans, nodes: Map<string, GraphNode>): GraphLink[] {
    return [...nodes.values()]
        .map((node) => ({
            fanIn: fans.fanIn.get(node.name) ?? 0,
            fanOut: fans.fanOut.get(node.name) ?? 0,
            name: node.name,
            rel: node.rel,
        }))
        .filter((row) => row.fanIn > 0 || row.fanOut > 0)
        .toSorted((a, b) => b.fanIn - a.fanIn || b.fanOut - a.fanOut);
};

export const collectDependencyGraph = function collectDependencyGraph(root: string): DependencyGraph {
    const nodes = buildNodes(root, workspaceMembers(root));
    const fans = computeFans(nodes);
    const links = linkedRows(fans, nodes);
    return {
        edges: fans.edges,
        isolated: nodes.size - links.length,
        leaves: fans.leaves,
        links,
        nodeCount: nodes.size,
        topFanIn: topRows(fans.fanIn, nodes),
        topFanOut: topRows(fans.fanOut, nodes),
    };
};
