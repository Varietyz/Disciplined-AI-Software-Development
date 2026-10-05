export interface Scope {
    coversDefault: (specifier: string | null) => boolean;
    coversName: (symbol: string) => boolean;
    label: string;
    specifier: string | null;
}
