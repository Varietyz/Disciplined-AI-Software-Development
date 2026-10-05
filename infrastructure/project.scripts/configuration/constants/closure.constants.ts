export const GRAPH_VERSION = 1;

export const JSON_INDENT = 4;

export const SOURCE_EXTENSION = ".ts";

export const DECLARATION_EXTENSION = ".d.ts";

export const TEST_MARK = ".test.";

export const MANIFEST_NAME = "package.json";

export const IDS_SUFFIX = ".ids.ts";

export const ICONS_SUFFIX = ".icons.ts";

export const STRINGS_SUFFIX = ".strings.ts";

export const SELF_IMPORT_MARK = "#";

export const RELATIVE_MARK = ".";

export const PARENT_SEGMENT = "..";

export const WILDCARD = "*";

export const DEEP_WILDCARD = "**";

export const SINGLE_WILDCARD = "?";

export const GLOB_CALLEE = "import.meta.glob";

export const REGISTER_PREFIX = "register";

export const CONSUMER_PREFIXES: readonly string[] = ["get", "list", "has", "emit", "dispatch"];

export const EMIT_EVENT = "emitEvent";

export const SUBSCRIBE_EVENT = "subscribeEvent";

export const REGISTER_EVENT_LISTENER = "registerEventListener";

export const EVENT_FUNCTIONS: ReadonlySet<string> = new Set([EMIT_EVENT, SUBSCRIBE_EVENT, REGISTER_EVENT_LISTENER]);

export const ID_PROPERTIES: ReadonlySet<string> = new Set(["id", "event"]);

export const DOM_CONSUMER_BUILTINS: ReadonlySet<string> = new Set([
    "getElementById",
    "getElementsByClassName",
    "getElementsByTagName",
    "getElementsByName",
    "getComputedStyle",
    "getBoundingClientRect",
    "getPropertyValue",
    "getAttribute",
    "getContext",
    "getItem",
    "getTime",
    "getFullYear",
    "getMonth",
    "getDate",
    "hasOwnProperty",
    "hasAttribute",
    "hasChildNodes",
    "hasFocus",
]);
