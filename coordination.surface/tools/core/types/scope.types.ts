import type { Jurisdiction } from "./rule.types.ts";

export interface ScopeSets {
    readonly byJurisdiction: Record<Jurisdiction, string[]>;
    readonly all: string[];
}
