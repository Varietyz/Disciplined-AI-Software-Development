export interface TabEntry {
    readonly id: string;
    readonly label: string;
    readonly path: string;
}

export interface PageTabs {
    readonly page: string;
    readonly tabs: readonly TabEntry[];
}

export interface TabRouter {
    readonly pagePath: (page: string) => string;
    readonly tabLink: (page: string, tab: string) => string;
}
