export type ConcernValue = (number | string)[] | boolean | number | string;

export type ConcernConfig = Record<string, ConcernValue>;

export interface ResolvedConcern {
    exclude: boolean;
    value?: number;
    optionValue?: (number | string)[];
}
