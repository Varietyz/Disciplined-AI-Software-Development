import type { AccessibleText, FlowchartSpec, GraphEdge, NodeEntry, NodeShape } from "#types/diagram.types";
import {
    ENFORCED_BY,
    SYSTEM_DESCRIPTIONS,
    SYSTEM_VIEWS,
    securityLabel,
    viewTitle,
} from "#configuration/strings/system.strings";
import type { SecurityPoint, SystemModel } from "#types/system.types";
import { emitClassDiagram } from "#core/formatters/diagram.structure.formatter";
import { emitGraph } from "#core/formatters/diagram.formatter";

const STORE_KINDS: ReadonlySet<string> = new Set(["store", "db", "cache"]);
const EXTERNAL_KIND = "external";
const DECISION_KIND = "decision";
const GATE_CLASS = "kGate";
const DIRECTION = "TD";

const shapeOf = function shapeOf(kind: string | undefined): NodeShape {
    if (kind === EXTERNAL_KIND) {
        return "collaborator";
    }
    if (kind !== undefined && STORE_KINDS.has(kind)) {
        return "store";
    }
    return kind === DECISION_KIND ? "decision" : "rect";
};

const dedupe = function dedupe(edges: readonly GraphEdge[]): GraphEdge[] {
    const byKey = new Map<string, GraphEdge>();
    for (const edge of edges) {
        const key = [edge.from, edge.to, edge.label ?? ""].join(" ");
        if (!byKey.has(key)) {
            byKey.set(key, edge);
        }
    }
    return [...byKey.values()];
};

const flowchart = function flowchart(spec: FlowchartSpec & Required<AccessibleText>): string {
    return emitGraph({
        accDescr: spec.accDescr,
        accTitle: spec.accTitle,
        direction: spec.direction,
        edges: dedupe(spec.edges),
        kind: "flowchart",
        nodes: [...new Map(spec.nodeEntries).values()],
        subgraphs: spec.subgraphs ?? [],
    });
};

export const systemContextDiagram = function systemContextDiagram(model: SystemModel): string | null {
    const components = model.components ?? [];
    if (components.length === 0) {
        return null;
    }
    return flowchart({
        accDescr: SYSTEM_DESCRIPTIONS.context,
        accTitle: viewTitle(model.name, SYSTEM_VIEWS.context),
        direction: DIRECTION,
        edges: (model.messages ?? []).map((message) => ({ from: message.from, to: message.to, weight: "call" })),
        nodeEntries: components.map((component) => [
            component.id,
            { id: component.id, label: component.label, shape: shapeOf(component.kind) },
        ]),
        subgraphs: (model.trustBoundaries ?? []).map((boundary) => ({
            id: boundary.id,
            nodeIds: boundary.components,
            title: boundary.label,
        })),
    });
};

export const dataEntityDiagram = function dataEntityDiagram(model: SystemModel): string | null {
    const entities = model.entities ?? [];
    if (entities.length === 0) {
        return null;
    }
    return emitClassDiagram({
        accDescr: SYSTEM_DESCRIPTIONS.data,
        accTitle: viewTitle(model.name, SYSTEM_VIEWS.data),
        classes: entities.map((entity) => ({
            id: entity.id,
            label: entity.label,
            members: entity.fields.map((field) => ({ name: field.name })),
        })),
        relations: (model.entityRelations ?? []).map((relation) => ({
            from: relation.from,
            kind: relation.kind,
            label: relation.label,
            to: relation.to,
        })),
    });
};

export const deploymentDiagram = function deploymentDiagram(model: SystemModel): string | null {
    const services = model.deployment ?? [];
    if (services.length === 0) {
        return null;
    }
    return flowchart({
        accDescr: SYSTEM_DESCRIPTIONS.deployment,
        accTitle: viewTitle(model.name, SYSTEM_VIEWS.deployment),
        direction: DIRECTION,
        edges: services.flatMap((service) =>
            (service.dependsOn ?? []).map((dep): GraphEdge => ({ from: service.id, to: dep, weight: "dependency" })),
        ),
        nodeEntries: services.map((service) => [
            service.id,
            { id: service.id, label: service.label, shape: shapeOf(service.kind) },
        ]),
    });
};

export const dispatchDiagram = function dispatchDiagram(model: SystemModel): string | null {
    const dispatch = model.dispatch ?? [];
    if (dispatch.length === 0) {
        return null;
    }
    return flowchart({
        accDescr: SYSTEM_DESCRIPTIONS.dispatch,
        accTitle: viewTitle(model.name, SYSTEM_VIEWS.dispatch),
        direction: DIRECTION,
        edges: dispatch.map((edge) => ({ from: edge.table, label: edge.key, to: edge.target })),
        nodeEntries: dispatch.flatMap((edge): NodeEntry[] => [
            [edge.table, { id: edge.table, label: edge.table, shape: "collaborator" }],
            [edge.target, { id: edge.target, label: edge.target, shape: "rect" }],
        ]),
    });
};

const enforcerOf = function enforcerOf(point: SecurityPoint): string | null {
    return typeof point.enforcedBy === "string" && point.enforcedBy.length > 0 ? point.enforcedBy : null;
};

const securityEntries = function securityEntries(point: SecurityPoint): NodeEntry[] {
    const gate: NodeEntry = [
        point.id,
        { class: GATE_CLASS, id: point.id, label: securityLabel(point.label, point.decision), shape: "decision" },
    ];
    const enforcer = enforcerOf(point);
    return enforcer === null ? [gate] : [gate, [enforcer, { id: enforcer, label: enforcer, shape: "rect" }]];
};

export const securityDiagram = function securityDiagram(model: SystemModel): string | null {
    const points = model.security ?? [];
    if (points.length === 0) {
        return null;
    }
    return flowchart({
        accDescr: SYSTEM_DESCRIPTIONS.security,
        accTitle: viewTitle(model.name, SYSTEM_VIEWS.security),
        direction: DIRECTION,
        edges: points.flatMap((point) => {
            const enforcer = enforcerOf(point);
            return enforcer === null ? [] : [{ from: point.id, label: ENFORCED_BY, to: enforcer }];
        }),
        nodeEntries: points.flatMap(securityEntries),
    });
};

export const messageContractDiagram = function messageContractDiagram(model: SystemModel): string | null {
    const messages = model.messages ?? [];
    if (messages.length === 0) {
        return null;
    }
    const labelById = new Map(
        (model.components ?? []).map((component): [string, string] => [component.id, component.label]),
    );
    return flowchart({
        accDescr: SYSTEM_DESCRIPTIONS.messages,
        accTitle: viewTitle(model.name, SYSTEM_VIEWS.messages),
        direction: DIRECTION,
        edges: messages.map((message) => ({ from: message.from, label: message.name, to: message.to })),
        nodeEntries: messages.flatMap((message): NodeEntry[] => [
            [message.from, { id: message.from, label: labelById.get(message.from) ?? message.from, shape: "rect" }],
            [message.to, { id: message.to, label: labelById.get(message.to) ?? message.to, shape: "rect" }],
        ]),
    });
};
