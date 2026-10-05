export interface ConfigExtract {
    readonly name: string;
    readonly read: (root: string) => Promise<unknown>;
}
