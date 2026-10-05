import { describe, expect, it, vi } from "vitest";
import { keyMissing, valueMalformed } from "@ssot/secrets/configuration/strings/environment.strings.ts";
import { optionalTextOf, portOf, textOf } from "@ssot/secrets/core/resolvers/environment.resolver.ts";

const vault = vi.hoisted(() => ({ fields: new Map<string, string>() }));

vi.mock("@ssot/secrets/core/adapters/environment.adapter.ts", () => ({
    fieldLabels: () => new Set(vault.fields.keys()),
    revealField: (_entry: string, label: string) => String(vault.fields.get(label)),
}));

const RUNTIME = "banes-lab.com/Runtime";

describe("portOf", () => {
    it("returns a declared port as a number", () => {
        vault.fields = new Map([["SITE_DEV_PORT", "4202"]]);
        expect(portOf("SITE_DEV_PORT")).toBe(4202);
    });

    it("refuses a required key the entry does not hold, and a value of the wrong kind", () => {
        vault.fields = new Map();
        expect(() => portOf("SITE_DEV_PORT")).toThrow(keyMissing("SITE_DEV_PORT", RUNTIME));
        vault.fields = new Map([["SITE_DEV_PORT", "12a"]]);
        expect(() => portOf("SITE_DEV_PORT")).toThrow(valueMalformed("SITE_DEV_PORT", "port"));
    });
});

describe("textOf", () => {
    it("returns a declared address", () => {
        vault.fields = new Map([["DEPLOY_DISCORD_WEBHOOK_URL", "https://example.test/hook"]]);
        expect(textOf("DEPLOY_DISCORD_WEBHOOK_URL")).toBe("https://example.test/hook");
    });
});

describe("optionalTextOf", () => {
    it("returns null when the entry holds no field of that label, and the value when it does", () => {
        vault.fields = new Map();
        expect(optionalTextOf("SSH_PASSPHRASE")).toBeNull();
        vault.fields = new Map([["SSH_PASSPHRASE", "held phrase"]]);
        expect(optionalTextOf("SSH_PASSPHRASE")).toBe("held phrase");
    });
});
