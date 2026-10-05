import type { SystemModel } from "@govlab/docs/types/system.types.ts";

export const SYSTEM_MODEL: SystemModel = {
    components: [
        { id: "ui", kind: "external", label: "Browser UI" },
        { id: "api", kind: "service", label: "Backend API" },
        { id: "db", kind: "db", label: "Database" },
    ],
    deployment: [
        { dependsOn: ["pg", "redis"], id: "app", kind: "app", label: "app" },
        { id: "pg", kind: "db", label: "postgres" },
        { id: "redis", kind: "cache", label: "redis" },
    ],
    dispatch: [
        { key: "html", table: "router", target: "HtmlProvider" },
        { key: "plain", table: "router", target: "TextProvider" },
    ],
    entities: [
        { fields: [{ name: "id" }, { name: "email" }], id: "users", label: "users" },
        { fields: [{ name: "id" }, { name: "userId" }], id: "posts", label: "posts" },
    ],
    entityRelations: [{ from: "posts", kind: "aggregation", label: "author", to: "users" }],
    messages: [
        { from: "ui", name: "request", to: "api" },
        { from: "api", name: "query", to: "db" },
    ],
    name: "Example",
    runtimeDeferred: ["executed sequence ordering", "FSM transition paths"],
    security: [{ decision: "bearer token", enforcedBy: "api", id: "auth", label: "auth" }],
    trustBoundaries: [{ components: ["api", "db"], id: "server", label: "Server" }],
};
