import type { DeprecatedApi } from "#types/idiom.types";

export const DEPRECATED_MEMBERS: ReadonlyMap<string, DeprecatedApi> = new Map([
    [
        "substr",
        {
            reason: "String.prototype.substr is Annex B legacy (its 2nd arg is length, not end index)",
            replacement: "slice() or substring()",
        },
    ],
    [
        "hasOwnProperty",
        {
            reason: "a direct hasOwnProperty call is prototype-unsafe and shadowable by an own property",
            replacement: "Object.hasOwn(obj, key)",
        },
    ],
    ["getYear", { reason: "Date.prototype.getYear is deprecated (returns year - 1900)", replacement: "getFullYear()" }],
    ["setYear", { reason: "Date.prototype.setYear is deprecated", replacement: "setFullYear()" }],
    ["keyCode", { reason: "KeyboardEvent.keyCode is deprecated", replacement: "event.key or event.code" }],
    ["charCode", { reason: "KeyboardEvent.charCode is deprecated", replacement: "event.key" }],
]);

export const DEPRECATED_GLOBALS: ReadonlyMap<string, DeprecatedApi> = new Map([
    [
        "escape",
        { reason: "escape() is deprecated and mishandles non-ASCII code points", replacement: "encodeURIComponent()" },
    ],
    ["unescape", { reason: "unescape() is deprecated", replacement: "decodeURIComponent()" }],
]);

export const DEPRECATED_CTORS: ReadonlyMap<string, DeprecatedApi> = new Map([
    [
        "Buffer",
        {
            reason: "new Buffer() is deprecated for security reasons (uninitialized memory)",
            replacement: "Buffer.from(value) or Buffer.alloc(size)",
        },
    ],
]);
