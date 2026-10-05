import type { RuntimeBinding } from "../../types/manifest.types.ts";

export const RUNTIME_BINDINGS: readonly RuntimeBinding[] = [{ pathKey: "app.nginxScripts", runtime: "nginx-quickjs" }];

export const ABSENT_MEMBERS: ReadonlyMap<string, ReadonlySet<string>> = new Map([
    ["nginx-quickjs", new Set(["localeCompare"])],
]);
