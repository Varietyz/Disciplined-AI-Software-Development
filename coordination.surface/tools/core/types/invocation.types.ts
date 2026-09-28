export interface Outcome {
    readonly message: string;
    readonly code: number;
}

export interface Invocation {
    readonly caller: string;
    readonly target: string;
    readonly absolute: string;
}

export type Operation = (invocation: Invocation) => Outcome | Promise<Outcome> | null;
