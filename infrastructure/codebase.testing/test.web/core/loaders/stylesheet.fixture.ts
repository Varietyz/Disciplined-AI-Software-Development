import { afterAll, beforeAll } from "vitest";

const STYLESHEET_SELECTOR = "link[rel=stylesheet]";
const LOAD_EVENT = "load";
const LOADED_ATTRIBUTE = "data-loaded";

let observer: MutationObserver | null = null;

const reportLoaded = function reportLoaded(): void {
    for (const link of document.head.querySelectorAll(STYLESHEET_SELECTOR)) {
        if (!link.hasAttribute(LOADED_ATTRIBUTE)) {
            link.setAttribute(LOADED_ATTRIBUTE, "");
            link.dispatchEvent(new Event(LOAD_EVENT));
        }
    }
};

beforeAll(() => {
    observer = new MutationObserver(reportLoaded);
    observer.observe(document.head, { childList: true });
});

afterAll(() => {
    observer?.disconnect();
    observer = null;
});
