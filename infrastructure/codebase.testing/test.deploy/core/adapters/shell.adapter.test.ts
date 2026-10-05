import type { Secrets, Shell } from "@banes-lab/deploy/types/deployment.types.ts";
import { describe, expect, it } from "vitest";
import { NOT_CONNECTED } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import { createShell } from "@banes-lab/deploy/core/adapters/shell.adapter.ts";

const SECRETS: Secrets = {
    deployWebhook: "",
    host: "localhost",
    keyFile: "key",
    nginxWebhook: "",
    passphrase: null,
    user: "deploy",
};

const OPERATIONS: readonly (readonly [string, (shell: Shell) => Promise<unknown>])[] = [
    ["run", async (shell) => shell.run("true")],
    ["upload", async (shell) => shell.upload("a", "b")],
    ["download", async (shell) => shell.download("a", "b")],
];

describe("createShell", () => {
    it.each(OPERATIONS)("refuses %s until connect has resolved", async (_name, operation) => {
        await expect(operation(createShell(SECRETS))).rejects.toThrow(NOT_CONNECTED);
    });

    it("disposes safely before any connection", () => {
        expect(() => {
            createShell(SECRETS).dispose();
        }).not.toThrow();
    });
});
