import { describe, expect, it, vi } from "vitest";
import { devServers, moduleServer } from "@banes-lab/build-scripts/core/factories/server.factory.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { DEV_ARGV } from "@banes-lab/build-scripts/configuration/constants/server.constants.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SITE_PORT = 4202;
const SOCIAL_PORT = 4203;

vi.mock("@ssot/secrets", () => ({ portOf: (key: string) => (key === "SITE_DEV_PORT" ? SITE_PORT : SOCIAL_PORT) }));

describe("moduleServer", () => {
    it("creates a middleware-mode module server at the root it is given, which a caller closes", async () => {
        const root = mkdtempSync(join(tmpdir(), "module-server-"));
        const server = await moduleServer(root);
        try {
            expect(server.config.root.split("\\").join("/")).toBe(root.split("\\").join("/"));
            expect(server.config.server.middlewareMode).toBe(true);
        } finally {
            await server.close();
            rmSync(root, { force: true, recursive: true });
        }
    });
});

describe("devServers", () => {
    it("runs the site on the port the environment declares with --host, and the social share on its own", () => {
        const servers = devServers();
        expect(servers.map((server) => [server.label, server.port, server.args])).toStrictEqual([
            ["site", SITE_PORT, ["--host"]],
            ["social", SOCIAL_PORT, []],
        ]);
        expect(servers.every((server) => server.config.endsWith("vite.config.ts"))).toBe(true);
        expect(DEV_ARGV.flags).toStrictEqual([]);
    });
});
