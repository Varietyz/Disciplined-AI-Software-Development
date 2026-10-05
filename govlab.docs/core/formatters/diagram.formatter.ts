import type {
    AccessibleText,
    ClassDef,
    EdgeWeight,
    GraphEdge,
    GraphModel,
    GraphNode,
    GraphSubgraph,
} from "#types/diagram.types";
import { idSanitize, label } from "#core/normalizers/diagram.normalizer";
import { byString } from "#core/selectors/base.selector";

const INDENT = "    ";
const NESTED_INDENT = "        ";
const ELK_HEADER: readonly string[] = ["---", "config:", "  layout: elk", "---"];
const DASHED_WEIGHTS: ReadonlySet<EdgeWeight | undefined> = new Set<EdgeWeight | undefined>(["teardown", "dependency"]);

const byId = byString<GraphNode>((node) => node.id);
const byEndpoints = byString<GraphEdge>((edge) => `${edge.from} ${edge.to} ${edge.weight ?? ""} ${edge.label ?? ""}`);
const bySubgraphId = byString<GraphSubgraph>((subgraph) => subgraph.id);
const byClassName = byString<ClassDef>((def) => def.name);

export const accLines = function accLines(model: AccessibleText): string[] {
    return [
        ...(typeof model.accTitle === "string" ? [`${INDENT}accTitle: ${label(model.accTitle)}`] : []),
        ...(typeof model.accDescr === "string" ? [`${INDENT}accDescr: ${label(model.accDescr)}`] : []),
    ];
};

const wrapNode = function wrapNode(node: GraphNode): string {
    const id = idSanitize(node.id);
    const text = label(node.label);
    if (node.shape === "decision") {
        return `${id}{"${text}"}`;
    }
    return node.shape === "collaborator" ? `${id}[["${text}"]]` : `${id}["${text}"]`;
};

const arrowBody = function arrowBody(weight: EdgeWeight | undefined): string {
    if (weight === "hook") {
        return "==>";
    }
    return DASHED_WEIGHTS.has(weight) ? "-.->" : "-->";
};

const edgeArrow = function edgeArrow(weight: EdgeWeight | undefined, caption: string): string {
    const body = arrowBody(weight);
    return caption.length === 0 ? body : `${body}|${caption}|`;
};

const subgraphMembers = function subgraphMembers(subgraphs: readonly GraphSubgraph[]): Set<string> {
    return new Set(subgraphs.flatMap((subgraph) => subgraph.nodeIds));
};

const looseNodeLines = function looseNodeLines(nodes: readonly GraphNode[], inSubgraph: ReadonlySet<string>): string[] {
    return nodes.filter((node) => !inSubgraph.has(node.id)).map((node) => `${INDENT}${wrapNode(node)}`);
};

const subgraphLines = function subgraphLines(
    subgraphs: readonly GraphSubgraph[],
    nodes: readonly GraphNode[],
): string[] {
    return subgraphs.flatMap((subgraph) => {
        const members = new Set(subgraph.nodeIds);
        return [
            `${INDENT}subgraph ${idSanitize(subgraph.id)}["${label(subgraph.title)}"]`,
            ...nodes.filter((node) => members.has(node.id)).map((node) => `${NESTED_INDENT}${wrapNode(node)}`),
            `${INDENT}end`,
        ];
    });
};

const edgeLine = function edgeLine(edge: GraphEdge): string {
    const caption = typeof edge.label === "string" ? label(edge.label) : "";
    return `${INDENT}${idSanitize(edge.from)} ${edgeArrow(edge.weight, caption)} ${idSanitize(edge.to)}`;
};

const classDefLines = function classDefLines(defs: readonly ClassDef[]): string[] {
    return defs
        .toSorted(byClassName)
        .map((def) => `${INDENT}classDef ${idSanitize(def.name)} stroke:${def.stroke},stroke-width:2px;`);
};

const classMemberLines = function classMemberLines(nodes: readonly GraphNode[]): string[] {
    const members = new Map<string, string[]>();
    for (const node of nodes) {
        if (typeof node.class === "string") {
            members.set(node.class, [...(members.get(node.class) ?? []), idSanitize(node.id)]);
        }
    }
    return [...members.keys()]
        .toSorted((left, right) => left.localeCompare(right))
        .map((name) => {
            const ids = (members.get(name) ?? []).toSorted((left, right) => left.localeCompare(right));
            return `${INDENT}class ${ids.join(",")} ${idSanitize(name)};`;
        });
};

export const emitGraph = function emitGraph(model: GraphModel): string {
    const nodes = model.nodes.toSorted(byId);
    const subgraphs = (model.subgraphs ?? []).toSorted(bySubgraphId);
    return [
        ...ELK_HEADER,
        `${model.kind} ${model.direction}`,
        ...accLines(model),
        ...looseNodeLines(nodes, subgraphMembers(subgraphs)),
        ...subgraphLines(subgraphs, nodes),
        ...model.edges.toSorted(byEndpoints).map(edgeLine),
        ...classDefLines(model.classDefs ?? []),
        ...classMemberLines(nodes),
    ].join("\n");
};
