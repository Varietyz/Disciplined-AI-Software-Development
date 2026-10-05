export interface Stop {
    readonly id: string;
    readonly code: string;
    readonly block: string;
    readonly label: string;
    readonly owner: string;
    readonly path: string;
    readonly requires: readonly string[];
}

export interface LearningRouter {
    readonly pagePath: (page: string) => string;
    readonly tabLink: (page: string, tab: string, section?: string) => string;
}

export interface SectionRecord {
    readonly id?: unknown;
    readonly title?: unknown;
}

export interface TabRecord {
    readonly id?: unknown;
    readonly label?: unknown;
    readonly sections?: unknown;
}

export type TabsFor = (page: string) => readonly TabRecord[];

export interface Unit {
    readonly external: readonly string[];
    readonly first: boolean;
    readonly label: string;
    readonly page: string;
    readonly sections: readonly SectionRecord[];
    readonly tab: string;
    readonly teaches: readonly string[];
}

export interface BlockStop {
    readonly id: string;
    readonly label: string;
    readonly path: string;
    readonly requires: readonly string[];
}

export interface Block {
    readonly code: string;
    readonly label: string;
    readonly owner: string;
    readonly stops: readonly BlockStop[];
}

export interface RouteStop {
    readonly block: string;
    readonly code: string;
    readonly id: string;
    readonly label: string;
    readonly path: string;
    readonly position: number;
    readonly requires: readonly string[];
}
