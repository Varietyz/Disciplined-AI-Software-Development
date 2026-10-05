import {
    commandFailed,
    portHeldLine,
    portReleasedLine,
    probeFailed,
    serverExitLine,
    signalFailed,
} from "@banes-lab/build-scripts/configuration/strings/server.strings.ts";
import { describe, expect, it } from "vitest";

describe("commandFailed, signalFailed and probeFailed", () => {
    it("name the command or the process that failed", () => {
        expect(commandFailed("netstat")).toContain("netstat failed");
        expect(signalFailed(12)).toContain("signaling process 12 failed");
        expect(probeFailed(12)).toContain("probing process 12 failed");
    });
});

describe("serverExitLine, portHeldLine and portReleasedLine", () => {
    it("name the server, the port and the process each line is about", () => {
        expect(serverExitLine("site", 1)).toBe("[dev] the site server exited with code 1; stopping the others\n");
        expect(portHeldLine(4202, "12")).toContain("port 4202 still held after terminating pid 12");
        expect(portReleasedLine(4202, "12")).toBe("[free-port] released port 4202 from pid 12\n");
    });
});
