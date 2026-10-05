import { describe, expect, it, vi } from "vitest";
import type { Secrets } from "@banes-lab/deploy/types/deployment.types.ts";
import { loadSecrets } from "@banes-lab/deploy/core/loaders/environment.loader.ts";

const vault = vi.hoisted(() => ({ passphrase: null as string | null }));

vi.mock("@ssot/secrets", () => ({
    optionalTextOf: () => vault.passphrase,
    textOf: (key: string) => `value of ${key}`,
}));

describe("loadSecrets", () => {
    it("reads the host and both webhooks from the vault, and no passphrase when the vault holds none", () => {
        vault.passphrase = null;
        const expected: Secrets = {
            deployWebhook: "value of DEPLOY_DISCORD_WEBHOOK_URL",
            host: "value of DEPLOY_HOST",
            keyFile: "value of DEPLOY_KEY_FILE",
            nginxWebhook: "value of NGINX_DISCORD_WEBHOOK_URL",
            passphrase: null,
            user: "value of DEPLOY_USER",
        };
        expect(loadSecrets()).toStrictEqual(expected);
    });

    it("carries the passphrase when the vault holds one", () => {
        vault.passphrase = "held";
        expect(loadSecrets().passphrase).toBe("held");
    });
});
