export interface GraphNode {
    deps: Set<string>;
    name: string;
    rel: string;
}

export interface GraphRow {
    count: number;
    name: string;
    rel: string;
}

export interface GraphLink {
    fanIn: number;
    fanOut: number;
    name: string;
    rel: string;
}

export interface DependencyGraph {
    edges: number;
    isolated: number;
    leaves: number;
    links: GraphLink[];
    nodeCount: number;
    topFanIn: GraphRow[];
    topFanOut: GraphRow[];
}

export interface Fans {
    fanIn: Map<string, number>;
    fanOut: Map<string, number>;
    edges: number;
    leaves: number;
}
