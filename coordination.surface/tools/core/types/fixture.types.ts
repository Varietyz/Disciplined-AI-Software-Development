export interface Sample {
    readonly path: string;
    readonly text: string;
}

export interface GateFixture {
    readonly rule: string;
    readonly kind?: string;
    readonly exempt?: string;
    readonly onDisk?: true;
    readonly fires?: readonly Sample[];
    readonly passes?: readonly Sample[];
    readonly heals?: readonly Sample[];
}

export type BranchObservation = Readonly<Record<string, boolean | number | string>>;

export interface BranchFixture {
    readonly subject: string;
    readonly branch: string;
    readonly seed: readonly Sample[];
    readonly exercise: (root: string) => BranchObservation;
    readonly expect: BranchObservation;
}

export interface FixtureRegistry {
    readonly gates: readonly GateFixture[];
    readonly branches: readonly BranchFixture[];
    readonly sources: readonly string[];
    readonly unreadable: readonly string[];
}

export interface FixtureTree {
    readonly root: string;
    readonly release: () => void;
}
