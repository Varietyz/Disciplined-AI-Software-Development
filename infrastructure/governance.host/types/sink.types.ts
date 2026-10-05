import type { AstNode } from "./syntax.types.ts";

export interface SinkArgument {
    readonly argument: AstNode | null;
    readonly sink: string;
}

export interface CopyHit {
    readonly keyName: string;
    readonly value: AstNode;
}
