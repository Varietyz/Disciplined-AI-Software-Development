import type { CuratedSuggestion } from "#types/edit.types";
import type { RuleOptions } from "#types/eslint.types";

export const JS_ESLINT_TOOLS: ReadonlySet<string> = new Set(["eslint", "govlab-eslint"]);

export const NON_ESLINT_TOOLS: ReadonlySet<string> = new Set(["govlab-stylelint"]);

export const RULE_OPTION_DEFAULTS: ReadonlyMap<string, RuleOptions> = new Map<string, RuleOptions>([
    ["@typescript-eslint/no-magic-numbers", { ignore: [-1, 0, 1] }],
    ["camelcase", { properties: "never" }],
    ["max-lines", { skipBlankLines: true, skipComments: true }],
    ["max-lines-per-function", { skipBlankLines: true, skipComments: true }],
    ["no-magic-numbers", { ignore: [-1, 0, 1] }],
]);

export const REQUIRES_MANDATORY_OPTIONS: ReadonlySet<string> = new Set(["jsonc/sort-keys", "jsonc/sort-array-values"]);

export const INCOMPATIBLE_ESLINT_RULES: ReadonlySet<string> = new Set([
    "jsonc/auto",
    "sort-keys",
    "sort-imports",
    "no-plusplus",
    "no-duplicate-imports",
    "no-multi-assign",
    "func-style",
]);

export const GOVLAB_NAMESPACES: ReadonlyMap<string, string> = new Map([
    ["govlab-context", "govlab-context"],
    ["govlab-eslint", "govlab"],
    ["govlab-extraction", "govlab-extraction"],
]);

export const TS_PREFIX = "@typescript-eslint/";
export const TS_FILES = ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];
export const CONSUMER_CONFIG_FILES = ["ts", "js", "mjs", "cts", "mts"].map((ext) => `**/govlab.config.${ext}`);
export const CONSUMER_CONFIG_OFF = ["@typescript-eslint/naming-convention", "max-lines"];
export const JS_FILES = ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.jsx"];
export const HTML_FILES = ["**/*.html"];
export const MANIFEST_FILES = ["**/package.json", "**/_manifest.json"];
export const LANGUAGE = { ecmaVersion: 2025, sourceType: "module" } as const;
export const JSX = { ecmaFeatures: { jsx: true } };
export const JS_ECOSYSTEMS = new Set(["javascript", "typescript"]);
export const LANG_FILES = new Map<string, string[]>([
    ["json", ["**/*.json"]],
    ["yaml", ["**/*.yml", "**/*.yaml"]],
]);
export const LANG_PARSERS = new Map<string, string>([
    ["json", "jsonc-eslint-parser"],
    ["yaml", "yaml-eslint-parser"],
]);
export const TS_TEST_FILES = [
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.test.mts",
    "**/*.test.cts",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/*-live-test.ts",
    "**/*-live-test.mts",
    "**/tests/**/*.ts",
    "**/tests/**/*.tsx",
    "**/tests/**/*.mts",
    "**/__tests__/**/*.ts",
    "**/__tests__/**/*.tsx",
];
export const CORE_PLUGIN_SCOPE = "@govlab/";
export const HTML_PLUGIN = "eslint-plugin-html";
export const TS_PARSER = "@typescript-eslint/parser";
export const JSON_PARSER = "jsonc-eslint-parser";
export const RULE_OFF = "off";
export const ALL_IGNORED_MARKER = "are ignored";
export const ESLINT_RULE_SUFFIX = ".eslint.rule.ts";
export const STYLISH_FORMATTER = "stylish";
export const CURATED_SUGGESTIONS: readonly CuratedSuggestion[] = [
    {
        messageId: "missingAccessibility",
        pick: "prefix",
        prefix: "public",
        ruleId: "@typescript-eslint/explicit-member-accessibility",
    },
    { messageId: null, pick: "sole", prefix: "", ruleId: "@typescript-eslint/prefer-optional-chain" },
    { messageId: null, pick: "sole", prefix: "", ruleId: "@typescript-eslint/no-unnecessary-type-conversion" },
];
