import { JSDOM } from "jsdom";
import type { Mermaid } from "mermaid";
import type { MermaidParser } from "#types/diagram.types";

const GLOBAL_KEYS: readonly string[] = ["DOMParser", "Node", "SVGElement", "HTMLElement", "getComputedStyle"];
const BLANK_PAGE = "<!DOCTYPE html><html><body></body></html>";
const LINE_BREAK = "\n";

const loaded: { mermaid?: Promise<Mermaid> } = {};

const noop = function noop(): null {
    return null;
};

const installGlobals = function installGlobals(dom: JSDOM): void {
    const view = dom.window;
    Reflect.set(globalThis, "window", view);
    Reflect.set(globalThis, "document", Reflect.get(view, "document"));
    for (const key of GLOBAL_KEYS) {
        Reflect.set(globalThis, key, Reflect.get(view, key));
    }
    if (!Reflect.has(globalThis, "navigator")) {
        Object.defineProperty(globalThis, "navigator", { configurable: true, value: Reflect.get(view, "navigator") });
    }
    if (!Reflect.has(view, "matchMedia")) {
        Reflect.set(view, "matchMedia", () => ({ addListener: noop, matches: false, removeListener: noop }));
    }
};

const loadParser = async function loadParser(): Promise<Mermaid> {
    installGlobals(new JSDOM(BLANK_PAGE, { pretendToBeVisual: true }));
    const { default: mermaid } = await import("mermaid");
    const { default: elkLayouts } = await import("@mermaid-js/layout-elk");
    mermaid.registerLayoutLoaders(elkLayouts);
    mermaid.initialize({ securityLevel: "strict", startOnLoad: false });
    return mermaid;
};

const firstLine = function firstLine(message: string): string {
    const lineBreak = message.indexOf(LINE_BREAK);
    return lineBreak === -1 ? message.trim() : message.slice(0, lineBreak).trim();
};

const messageOf = function messageOf(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
};

export const createMermaidParser = async function createMermaidParser(): Promise<MermaidParser> {
    try {
        loaded.mermaid ??= loadParser();
        const mermaid = await loaded.mermaid;
        return {
            available: true,
            async parse(code: string): Promise<string | null> {
                try {
                    await mermaid.parse(code);
                    return null;
                } catch (error) {
                    return firstLine(messageOf(error));
                }
            },
        };
    } catch (error) {
        return { available: false, reason: messageOf(error) };
    }
};
