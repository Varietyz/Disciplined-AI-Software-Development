export interface BrowserWindow {
    readonly width: number;
    readonly height: number;
    readonly software: boolean;
    readonly profileDir: string;
}

export interface ActivePort {
    readonly path: string;
    readonly port: string;
}

export interface BrowserHandle {
    readonly exitCode: () => number | null;
    readonly close: () => Promise<void>;
}

export interface ConsoleRecord {
    readonly level: string;
    readonly text: string;
    readonly source: string;
}

export interface Session {
    readonly send: (method: string, params?: Record<string, unknown>) => Promise<Record<string, unknown>>;
    readonly close: () => void;
    readonly records: () => readonly ConsoleRecord[];
}
