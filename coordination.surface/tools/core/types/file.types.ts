export interface WalkOptions {
    readonly root: string;
    readonly ignored: readonly string[];
    readonly extensions: readonly string[];
    readonly excluded?: readonly string[];
}
