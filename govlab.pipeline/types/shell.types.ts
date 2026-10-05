export interface ShellDescriptor {
    readonly flag: string;
    readonly shell: string;
}

export interface CapturedOutcome {
    readonly code: number;
    readonly out: string;
}
