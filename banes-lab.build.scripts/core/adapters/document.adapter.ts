import { JSDOM } from "jsdom";

const SLASH = "/";
const ROOT_SELECTOR = "html";

class IdleObserver {
    public observe(): void {}

    public unobserve(): void {}

    public disconnect(): void {}
}

const clearSelectorCache = function clearSelectorCache(document: Document): void {
    void document.querySelectorAll(ROOT_SELECTOR);
};

const release = function release(dom: JSDOM): void {
    const { document } = dom.window;
    document.documentElement.replaceChildren();
    clearSelectorCache(document);
    dom.window.close();
};

export const readDocument = function readDocument<T>(markup: string, read: (document: Document) => T): T {
    const dom = new JSDOM(markup);
    try {
        return read(dom.window.document);
    } finally {
        release(dom);
    }
};

export const rewriteDocument = function rewriteDocument(markup: string, edit: (document: Document) => void): string {
    const dom = new JSDOM(markup);
    try {
        edit(dom.window.document);
        return dom.serialize();
    } finally {
        release(dom);
    }
};

export const rewriteEach = function rewriteEach<T>(
    markup: string,
    items: readonly T[],
    edit: (document: Document, item: T) => void,
    write: (item: T, html: string) => void,
): void {
    const dom = new JSDOM(markup);
    try {
        for (const item of items) {
            edit(dom.window.document, item);
            write(item, dom.serialize());
        }
    } finally {
        release(dom);
    }
};

export const installDocument = function installDocument(site: string): (path: string) => void {
    const { window } = new JSDOM("", { url: site + SLASH });
    const globals: readonly (readonly [string, unknown])[] = [
        ["DOMParser", window.DOMParser],
        ["Element", window.Element],
        ["HTMLElement", window.HTMLElement],
        ["IntersectionObserver", IdleObserver],
        ["Node", window.Node],
        ["Text", window.Text],
        ["document", window.document],
        ["requestAnimationFrame", (callback: () => void): number => Number(setTimeout(callback, 0))],
        ["window", window],
    ];
    for (const [name, value] of globals) {
        Reflect.set(globalThis, name, value);
    }
    return (path) => {
        window.history.replaceState({}, "", path);
    };
};
