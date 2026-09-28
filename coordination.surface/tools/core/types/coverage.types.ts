import type { DeclaredRule } from "./rule.types.ts";
import type { Finding } from "./segment.types.ts";

export interface RosterRow {
    readonly slug: string;
    readonly line: number;
    readonly cell: string;
    readonly cells: number;
}

export interface ConditionalSlot {
    readonly slug: string;
    readonly section: string;
    readonly name: string;
    readonly reached: boolean;
}

export interface Declaration {
    readonly path: string;
    readonly declared: DeclaredRule;
}

export type DeclarationRoute = "conduct" | "gated" | "ungated";

export interface DeclarationOutcome {
    readonly route: DeclarationRoute;
    readonly findings: Finding[];
    readonly conditional: ConditionalSlot | null;
}
