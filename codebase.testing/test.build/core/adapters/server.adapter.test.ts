import {
    awaitRelease,
    freePort,
    holdersOf,
    terminateTree,
} from "@banes-lab/build-scripts/core/adapters/server.adapter.ts";
import { describe, expect, it } from "vitest";
import { createServer } from "node:net";
import process from "node:process";
import { spawn } from "node:child_process";

const UNBOUND_PORT = 59_231;

const listening = async function listening(): Promise<{ close: () => Promise<void>; port: number }> {
    const server = createServer();
    const port = await new Promise<number>((settle, fail) => {
        server.once("error", fail);
        server.listen(0, "127.0.0.1", () => {
            const address = server.address();
            settle(typeof address === "object" && address !== null ? address.port : 0);
        });
    });
    return {
        close: async () =>
            new Promise<void>((settle) => {
                server.close(() => {
                    settle();
                });
            }),
        port,
    };
};

describe("holdersOf", () => {
    it("names a holder for a port something is listening on", async () => {
        const server = await listening();
        try {
            expect(holdersOf(server.port).length).toBeGreaterThan(0);
        } finally {
            await server.close();
        }
    });

    it("names no holder for a port nothing is listening on", () => {
        expect(holdersOf(UNBOUND_PORT)).toStrictEqual([]);
    });

    it("returns each holder once, so a port with several sockets is not double-counted", async () => {
        const server = await listening();
        try {
            const held = holdersOf(server.port);
            expect(held).toStrictEqual([...new Set(held)]);
        } finally {
            await server.close();
        }
    });
});

describe("freePort", () => {
    it("reports nothing terminated for a port nothing holds", async () => {
        await expect(freePort(UNBOUND_PORT)).resolves.toStrictEqual([]);
    });
});

describe("awaitRelease", () => {
    it("answers at once for a port nothing holds", async () => {
        await expect(awaitRelease(UNBOUND_PORT)).resolves.toBe(true);
    });

    it("gives up and answers false while something keeps listening", async () => {
        const server = await listening();
        try {
            await expect(awaitRelease(server.port)).resolves.toBe(false);
        } finally {
            await server.close();
        }
    });
});

describe("terminateTree", () => {
    it("stops the process it is given, so a started server does not outlive its starter", async () => {
        const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
            detached: process.platform !== "win32",
            stdio: "ignore",
        });
        const exited = new Promise<void>((settle) => {
            child.once("exit", () => {
                settle();
            });
        });
        expect(child.pid).toBeDefined();
        expect(terminateTree(child.pid ?? 0)).toBe(true);
        await expect(exited).resolves.toBeUndefined();
    });
});
