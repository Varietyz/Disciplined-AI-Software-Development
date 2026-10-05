import type { JSDOM } from "jsdom";

export interface DiagramWalk {
    readonly attribute: string;
    readonly orderOf: (svg: ReturnType<typeof JSDOM.fragment>) => string;
}

export interface Stage {
    readonly close: () => void;
    readonly url: string;
}

export interface Hoisted {
    readonly stylesheet: string;
    readonly vectors: ReadonlyMap<string, string>;
}

export interface DiagramProgress {
    readonly rendered: ReadonlyMap<string, string>;
    readonly stalledAt: number | null;
    readonly reason: string;
}

export interface Rescoped {
    readonly css: string;
    readonly derived: ReadonlySet<string>;
}
