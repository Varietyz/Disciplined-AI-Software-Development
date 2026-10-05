import { describe, expect, it, vi } from "vitest";
import { devPortPlugin } from "@banes-lab/build-scripts/core/plugins/server.plugin.ts";

const vault = vi.hoisted(() => ({ reads: 0 }));

vi.mock("@ssot/secrets", () => ({
    portOf: () => {
        vault.reads += 1;
        return 4202;
    },
}));

vi.mock("@banes-lab/build-scripts/core/factories/certificate.factory.ts", () => ({
    devCertificate: async () => {
        await Promise.resolve();
        return { cert: "c", key: "k" };
    },
}));

const configOf = async function configOf(command: "build" | "serve"): Promise<unknown> {
    const { config } = devPortPlugin("SITE_DEV_PORT");
    if (typeof config !== "function") {
        throw new TypeError("the plugin declares no config hook");
    }
    const held: unknown = await Reflect.apply(config, undefined, [{}, { command, mode: "development" }]);
    return held;
};

describe("devPortPlugin", () => {
    it("reads the dev port only when a server starts, so a build or a config load never opens the vault", async () => {
        vault.reads = 0;
        await expect(configOf("build")).resolves.toBeNull();
        expect(vault.reads).toBe(0);
        await expect(configOf("serve")).resolves.toStrictEqual({
            server: { https: { cert: "c", key: "k" }, port: 4202, strictPort: true },
        });
        expect(vault.reads).toBe(1);
    });
});
