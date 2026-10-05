export interface FlagSpec {
    readonly describe: string;
    readonly name: string;
    readonly repeatable?: boolean;
    readonly takesValue: boolean;
}

export interface PositionalSpec {
    readonly describe: string;
    readonly name: string;
    readonly optional?: boolean;
    readonly variadic?: boolean;
}

export interface ArgvSpec {
    readonly command: string;
    readonly flags: readonly FlagSpec[];
    readonly positionals?: readonly PositionalSpec[];
    readonly rest?: PositionalSpec;
    readonly summary: string;
}

export interface ParsedArgv {
    readonly flags: ReadonlyMap<string, readonly string[]>;
    readonly positionals: readonly string[];
    readonly rest: readonly string[];
}

export type ArgvOutcome =
    | { readonly kind: "help"; readonly usage: string }
    | { readonly kind: "parsed"; readonly argv: ParsedArgv }
    | { readonly kind: "refused"; readonly reason: string; readonly usage: string };
