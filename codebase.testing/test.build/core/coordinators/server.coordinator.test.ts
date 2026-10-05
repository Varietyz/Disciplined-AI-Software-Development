import {
    createSupervisor,
    startServer,
    stopAll,
    superviseServers,
} from "@banes-lab/build-scripts/core/coordinators/server.coordinator.ts";
import { describe, expect, it } from "vitest";

describe("createSupervisor", () => {
    it("stops once, reporting the first exit code, however many times it is asked", () => {
        const codes: number[] = [];
        const supervisor = createSupervisor([], (code) => {
            codes.push(code);
        });
        expect(supervisor.stopped()).toBe(false);
        supervisor.stop(3);
        supervisor.stop(0);
        expect(supervisor.stopped()).toBe(true);
        expect(codes).toStrictEqual([3]);
    });
});

describe("startServer, stopAll and superviseServers", () => {
    it("are the spawn, stop and supervise steps the entrypoint drives", () => {
        expect([typeof startServer, typeof superviseServers]).toStrictEqual(["function", "function"]);
        expect(() => {
            stopAll([]);
        }).not.toThrow();
    });
});
