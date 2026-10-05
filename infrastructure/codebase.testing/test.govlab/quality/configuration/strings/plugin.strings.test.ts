import {
    corePluginsMissing,
    namespaceWithoutPlugin,
    pluginFolderUnreadable,
    pluginLoadFailed,
    pluginShape,
    pluginWithoutDefault,
    reservedNamespace,
} from "@govlab/quality/configuration/strings/plugin.strings.ts";
import { describe, expect, it } from "vitest";

describe("plugin strings", () => {
    it("name the plugin file, the folder and the namespace each error reports", () => {
        const lines: [string, string][] = [
            [pluginFolderUnreadable("plugins"), "plugins"],
            [pluginLoadFailed("a.ts"), "a.ts"],
            [pluginWithoutDefault("a.ts"), "a.ts"],
            [pluginShape("a.ts"), "a.ts"],
            [reservedNamespace("a.ts", "local"), '"local"'],
            [namespaceWithoutPlugin("a.ts", "mine"), '"mine"'],
            [corePluginsMissing("eslint-plugin-x"), "eslint-plugin-x"],
        ];
        for (const [line, part] of lines) {
            expect(line).toContain(part);
        }
    });
});
