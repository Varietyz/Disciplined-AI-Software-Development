export interface DevServer {
    readonly args: readonly string[];
    readonly config: string;
    readonly label: string;
    readonly port: number;
}

export interface Prefixed {
    readonly carry: string;
    readonly lines: readonly string[];
}

export interface Supervisor {
    readonly stop: (code: number) => void;
    readonly stopped: () => boolean;
}
