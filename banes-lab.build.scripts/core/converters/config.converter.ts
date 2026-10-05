const ESLINT_KEPT_FIELDS: readonly string[] = ["name", "files", "ignores", "linterOptions", "rules"];

const PLUGINS_FIELD = "plugins";

const isPlain = function isPlain(value: unknown): value is Record<string, unknown> {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const prototype: unknown = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
};

export const jsonSafe = function jsonSafe(value: unknown): unknown {
    if (value === null) {
        return null;
    }
    if (value instanceof RegExp) {
        return String(value);
    }
    if (Array.isArray(value)) {
        return value.map(jsonSafe).filter((entry) => entry !== undefined);
    }
    if (isPlain(value)) {
        return Object.fromEntries(
            Object.entries(value)
                .map(([key, entry]): [string, unknown] => [key, jsonSafe(entry)])
                .filter(([, entry]) => entry !== undefined),
        );
    }
    return typeof value === "function" || typeof value === "symbol" || typeof value === "object" ? undefined : value;
};

export const eslintScopes = function eslintScopes(configs: readonly unknown[]): unknown[] {
    return configs.filter(isPlain).map((scope) => {
        const plugins = scope[PLUGINS_FIELD];
        const kept = Object.fromEntries(
            ESLINT_KEPT_FIELDS.filter((field) => field in scope).map((field) => [field, scope[field]]),
        );
        return jsonSafe(isPlain(plugins) ? { ...kept, [PLUGINS_FIELD]: Object.keys(plugins) } : kept);
    });
};

export const neutralized = function neutralized(
    value: unknown,
    tokens: readonly (readonly [string, string])[],
): unknown {
    if (typeof value === "string") {
        return tokens.reduce((text, [from, to]) => text.split(from).join(to), value);
    }
    if (Array.isArray(value)) {
        return value.map((entry) => neutralized(entry, tokens));
    }
    if (isPlain(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [neutralized(key, tokens), neutralized(entry, tokens)]),
        );
    }
    return value;
};
