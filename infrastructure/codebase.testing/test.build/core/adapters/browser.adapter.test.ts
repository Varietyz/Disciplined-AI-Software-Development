import { afterEach, describe, expect, it, vi } from "vitest";
import { devtoolsEndpoint, openSession } from "@banes-lab/build-scripts/core/adapters/browser.adapter.ts";
import { mkdtempSync, rmSync } from "node:fs";
import { ACTIVE_PORT_FILE } from "@banes-lab/build-scripts/configuration/constants/browser.constants.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const NO_TIME_MS = 0;
const TARGETS_METHOD = "Target.getTargets";
const TARGETS = [
    { targetId: "w1", type: "service_worker" },
    { targetId: "p1", type: "page" },
];
const SOCKETS: FakeSocket[] = [];

const idOf = function idOf(payload: string): number {
    const parsed: unknown = JSON.parse(payload);
    if (typeof parsed !== "object" || parsed === null || !("id" in parsed)) {
        return 0;
    }
    const { id } = parsed;
    return typeof id === "number" ? id : 0;
};

class FakeSocket extends EventTarget {
    public readonly sent: string[] = [];

    public closed = false;

    public constructor() {
        super();
        SOCKETS.push(this);
        queueMicrotask(() => {
            this.dispatchEvent(new Event("open"));
        });
    }

    public send(payload: string): void {
        this.sent.push(payload);
        const result = payload.includes(TARGETS_METHOD) ? { targetInfos: TARGETS } : { answered: true };
        this.deliver({ id: idOf(payload), result });
    }

    public close(): void {
        this.closed = true;
    }

    public deliver(message: Record<string, unknown>): void {
        this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(message) }));
    }
}

describe("devtoolsEndpoint", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("gives up when the browser writes no port file within the timeout", async () => {
        const profile = mkdtempSync(join(tmpdir(), "devtools-"));
        await expect(devtoolsEndpoint(profile, NO_TIME_MS)).resolves.toBeNull();
        rmSync(profile, { force: true, recursive: true });
    });

    it("reads the port file, asks the browser socket for its targets and addresses the page socket", async () => {
        vi.stubGlobal("WebSocket", FakeSocket);
        const profile = mkdtempSync(join(tmpdir(), "devtools-"));
        writeVerbatim(join(profile, ACTIVE_PORT_FILE), "9333\n/devtools/browser/b1\n");
        await expect(devtoolsEndpoint(profile, NO_TIME_MS)).resolves.toBe("ws://127.0.0.1:9333/devtools/page/p1");
        expect(SOCKETS.at(-1)?.closed).toBe(true);
        rmSync(profile, { force: true, recursive: true });
    });
});

describe("openSession", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("sends commands, collects console records and closes the socket", async () => {
        vi.stubGlobal("WebSocket", FakeSocket);
        const session = await openSession("wss://fake", false);
        const socket = SOCKETS.at(-1);
        const answer = await session.send("Page.enable");
        socket?.deliver({ method: "Runtime.consoleAPICalled", params: { args: [{ value: "seen" }], type: "log" } });
        session.close();
        expect(answer).toStrictEqual({ answered: true });
        expect(session.records().map((record) => record.text)).toStrictEqual(["seen"]);
        expect(socket?.closed).toBe(true);
    });
});
