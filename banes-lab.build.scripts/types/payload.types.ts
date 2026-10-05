import type { Discovery } from "#types/site.types";

export type DiscoverySource = () => Promise<Discovery>;

export type CatalogSource = () => Promise<ReadonlyMap<string, string>>;

export interface PayloadAddress {
    readonly page: string;
    readonly tab: string | null;
}
