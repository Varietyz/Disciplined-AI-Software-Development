export interface RouteStamp {
    readonly fingerprint: string;
    readonly lastmod: string;
}

export type RouteLedger = Readonly<Partial<Record<string, RouteStamp>>>;

export type RouteStamps = ReadonlyMap<string, string>;
