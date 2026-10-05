export type EntityRelationKind = "aggregation" | "composition" | "dependency" | "realization";

export interface SystemComponent {
    id: string;
    label: string;
    kind?: string;
    boundary?: string;
}

export interface TrustBoundary {
    id: string;
    label: string;
    components: string[];
}

export interface EntityField {
    name: string;
}

export interface Entity {
    id: string;
    label: string;
    fields: EntityField[];
}

export interface EntityRelation {
    from: string;
    to: string;
    kind: EntityRelationKind;
    label?: string | undefined;
}

export interface DeploymentService {
    id: string;
    label: string;
    kind?: string;
    dependsOn?: string[];
}

export interface DispatchEdge {
    table: string;
    key: string;
    target: string;
}

export interface MessageFlow {
    from: string;
    to: string;
    name: string;
    direction?: string;
}

export interface SecurityPoint {
    id: string;
    label: string;
    decision: string;
    enforcedBy?: string;
}

export interface SystemModel {
    name: string;
    components?: SystemComponent[];
    trustBoundaries?: TrustBoundary[];
    entities?: Entity[];
    entityRelations?: EntityRelation[];
    deployment?: DeploymentService[];
    dispatch?: DispatchEdge[];
    messages?: MessageFlow[];
    security?: SecurityPoint[];
    runtimeDeferred?: readonly string[];
}

export interface SystemSection {
    heading: string;
    render: (model: SystemModel) => string | null;
}
