import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadUserPlugins } from "@govlab/quality/core/loaders/plugin.loader.ts";
import { relativePath } from "@ssot/paths";
import { test } from "vitest";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const nsRule = function nsRule(eslint: Record<string, unknown>, ns: string, rule: string): boolean {
    const plugin = eslint[ns];
    if (!isRecord(plugin) || !isRecord(plugin["rules"])) {
        throw new Error(`expected eslint plugin '${ns}' with rules`);
    }
    return plugin["rules"][rule] !== undefined;
};

const fixtureRoot = function fixtureRoot(files: Record<string, string>): string {
    const root = mkdtempSync(join(tmpdir(), "govlab-userplugins-"));
    const dir = join(root, relativePath("govlabHost.plugins"));
    mkdirSync(dir, { recursive: true });
    for (const [name, body] of Object.entries(files)) {
        writeVerbatim(join(dir, name), body);
    }
    return root;
};

test("loads custom eslint and stylelint plugin code from the host's plugins folder (code only, no enablement)", async () => {
    const root = fixtureRoot({
        "es.mjs":
            'export default { tool: "eslint", plugins: { myns: { rules: { "no-foo": { create() { return {}; } } } } } };',
        "sl.mjs": 'export default { tool: "stylelint", plugins: [{ ruleName: "myns/no-bar" }] };',
    });
    try {
        const user = await loadUserPlugins(root);
        assert.ok(Object.hasOwn(user.eslint, "myns"), "the custom eslint plugin namespace registers");
        assert.ok(nsRule(user.eslint, "myns", "no-foo"), "the custom rule code is present");
        assert.equal(user.stylelint.length, 1, "the custom stylelint plugin registers");
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
});

const MALFORMED: Record<string, [string, string]> = {
    "a plugin for an unknown tool": ["other-tool.mjs", "must default-export"],
    "a plugin that throws on load": ["throws.mjs", "failed to load"],
    "a plugin with no default export": ["no-default.mjs", "has no default-exported object"],
    "a plugin with no plugins field": ["no-plugins.mjs", "must default-export"],
};

const MALFORMED_BODIES: Record<string, string> = {
    "no-default.mjs": "export const nope = 1;",
    "no-plugins.mjs": 'export default { tool: "eslint" };',
    "other-tool.mjs": 'export default { tool: "prettier", plugins: {} };',
    "throws.mjs": "throw new Error('boom');",
};

for (const [label, [file, message]] of Object.entries(MALFORMED)) {
    test(`${label} fails the load and names the file`, async () => {
        const root = fixtureRoot({
            [file]: MALFORMED_BODIES[file] ?? "",
            "ok.mjs": 'export default { tool: "eslint", plugins: { good: { rules: {} } } };',
        });
        try {
            await assert.rejects(loadUserPlugins(root), (error: unknown) => {
                assert.ok(error instanceof Error);
                assert.ok(error.message.includes(file), "the message names the file");
                assert.ok(error.message.includes(message), "the message states the defect");
                return true;
            });
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
}

test("a custom plugin whose namespace shadows a core namespace fails the load", async () => {
    const root = fixtureRoot({
        "own.mjs": 'export default { tool: "eslint", plugins: { mine: { rules: {} } } };',
        "shadow.mjs": 'export default { tool: "eslint", plugins: { govlab: { rules: {} } } };',
    });
    try {
        await assert.rejects(
            loadUserPlugins(root, { reservedNamespaces: new Set(["govlab", "govlab-extraction"]) }),
            (error: unknown) =>
                error instanceof Error && error.message.includes('claims the reserved namespace "govlab"'),
        );
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
});

test("two files extending the same namespace: their rules merge into one plugin object", async () => {
    const root = fixtureRoot({
        "a-first.mjs": 'export default { tool: "eslint", plugins: { dup: { rules: { one: {} } } } };',
        "b-second.mjs": 'export default { tool: "eslint", plugins: { dup: { rules: { two: {} } } } };',
    });
    try {
        const user = await loadUserPlugins(root);
        assert.ok(nsRule(user.eslint, "dup", "one"), "the first file's rule registers");
        assert.ok(nsRule(user.eslint, "dup", "two"), "the second file's rule merges into the same namespace");
        assert.deepEqual(Object.keys(user.eslint), ["dup"], "a single merged plugin object per namespace");
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
});

test("no plugins folder yields empty tiers (no throw)", async () => {
    const root = mkdtempSync(join(tmpdir(), "govlab-empty-"));
    try {
        const user = await loadUserPlugins(root);
        assert.deepEqual(user.eslint, {});
        assert.deepEqual(user.stylelint, []);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
});

test("global (~/.govlab) is NOT scanned unless allowGlobal is set", async () => {
    const root = fixtureRoot({ "es.mjs": 'export default { tool: "eslint", plugins: { local: { rules: {} } } };' });
    try {
        const user = await loadUserPlugins(root, { allowGlobal: false });
        assert.ok(Object.hasOwn(user.eslint, "local"));
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
});
