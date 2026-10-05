export const DOM_OBJECTS: ReadonlySet<string> = new Set(["DOMFactory", "domLab", "DOMSelectors", "StyleManager"]);

export const DOM_DOCUMENT_METHODS: ReadonlySet<string> = new Set([
    "createElement",
    "createElementNS",
    "querySelector",
    "querySelectorAll",
    "getElementById",
    "getElementsByClassName",
    "getElementsByTagName",
]);

export const DOM_MUTATION_METHODS: ReadonlySet<string> = new Set([
    "appendChild",
    "removeChild",
    "insertBefore",
    "replaceChild",
    "replaceChildren",
    "append",
    "prepend",
    "remove",
    "insertAdjacentElement",
    "insertAdjacentHTML",
]);

export const DOM_PROPERTIES: ReadonlySet<string> = new Set([
    "innerHTML",
    "textContent",
    "innerText",
    "outerHTML",
    "classList",
]);

export const API_METHODS: ReadonlySet<string> = new Set(["get", "post", "put", "delete", "patch"]);

export const API_GLOBALS: ReadonlySet<string> = new Set(["fetch", "XMLHttpRequest"]);

export const STORAGE_OBJECTS: ReadonlySet<string> = new Set(["localStorage", "sessionStorage", "indexedDB"]);

export const EVENT_METHODS: ReadonlySet<string> = new Set(["addEventListener", "removeEventListener"]);

export const EVENT_OBJECTS: ReadonlySet<string> = new Set(["EventManager", "GestureManager", "HapticManager"]);

export const TIMER_GLOBALS: ReadonlySet<string> = new Set([
    "setTimeout",
    "setInterval",
    "requestAnimationFrame",
    "cancelAnimationFrame",
]);

export const DOMAIN_LABELS: Readonly<Record<string, string>> = {
    api: "API/network calls",
    dom: "DOM manipulation",
    events: "event binding",
    storage: "storage operations",
    timer: "timer/animation scheduling",
};
