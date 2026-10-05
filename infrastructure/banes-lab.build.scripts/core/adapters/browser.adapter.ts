import { ACTIVE_PORT_FILE, LOCKED_FILE_CODES } from "#configuration/constants/browser.constants";
import type { ActivePort, ConsoleRecord, Session } from "#types/browser.types";
import { EVENT_METHODS, eventRecord } from "#core/converters/browser.converter";
import {
    NOT_TEXT_MESSAGE,
    SOCKET_FAILED,
    consoleEcho,
    noReply,
    notObjectMessage,
    protocolFailed,
    socketClosed,
} from "#configuration/strings/browser.strings";
import { existsSync, readFileSync } from "node:fs";
import { isRecord, numberAt, recordAt, textAt } from "#core/selectors/base.selector";
import { join } from "node:path";
import process from "node:process";
import { wait } from "#core/timers/base.timer";

const POLL_INTERVAL_MS = 200;
const SEND_TIMEOUT_MS = 120_000;
const PAGE_TYPE = "page";
const SOCKET_ROOT = "/devtools/";
const PAGE_TARGET = "page/";

const socketUrl = function socketUrl(port: string, target: string): string {
    return `ws://127.0.0.1:${port}/devtools/${target}`;
};

const targetOf = function targetOf(path: string): string {
    return path.startsWith(SOCKET_ROOT) ? path.slice(SOCKET_ROOT.length) : path;
};

const isLockedFile = function isLockedFile(error: unknown): boolean {
    return error instanceof Error && "code" in error && LOCKED_FILE_CODES.has(String(error.code));
};

const readWhenUnlocked = function readWhenUnlocked(file: string): string | null {
    try {
        return readFileSync(file, "utf8");
    } catch (error) {
        if (isLockedFile(error)) {
            return null;
        }
        throw error;
    }
};

const activePortOf = function activePortOf(profileDir: string): ActivePort | null {
    const file = join(profileDir, ACTIVE_PORT_FILE);
    const text = existsSync(file) ? readWhenUnlocked(file) : null;
    if (text === null) {
        return null;
    }
    const [port = "", path = ""] = text.split("\n").map((line) => line.trim());
    return port.length > 0 && path.length > 0 ? { path, port } : null;
};

const pageIdOf = function pageIdOf(targets: unknown): string | null {
    const infos = isRecord(targets) ? targets["targetInfos"] : null;
    const records = Array.isArray(infos) ? infos.filter(isRecord) : [];
    const page = records.find((info) => textAt(info, "type") === PAGE_TYPE);
    return page === undefined ? null : textAt(page, "targetId");
};

const pollForPort = async function pollForPort(profileDir: string, deadline: number): Promise<ActivePort | null> {
    const active = activePortOf(profileDir);
    if (active !== null || Date.now() >= deadline) {
        return active;
    }
    await wait(POLL_INTERVAL_MS);
    return pollForPort(profileDir, deadline);
};

const opened = async function opened(socket: WebSocket): Promise<void> {
    return new Promise<void>((ready, fail) => {
        socket.addEventListener("open", () => {
            ready();
        });
        socket.addEventListener("error", () => {
            fail(new Error(SOCKET_FAILED));
        });
    });
};

interface PendingCall {
    readonly method: string;
    readonly settle: (value: Record<string, unknown>) => void;
    readonly fail: (reason: Error) => void;
    readonly timer: ReturnType<typeof setTimeout>;
}

const protocolError = function protocolError(method: string, error: Record<string, unknown>): Error {
    return new Error(protocolFailed(method, textAt(error, "message") ?? JSON.stringify(error)));
};

const settleReply = function settleReply(pending: Map<number, PendingCall>, parsed: Record<string, unknown>): void {
    const id = numberAt(parsed, "id");
    const call = id === null ? undefined : pending.get(id);
    if (id === null || call === undefined) {
        return;
    }
    pending.delete(id);
    clearTimeout(call.timer);
    const error = recordAt(parsed, "error");
    if (error === null) {
        call.settle(recordAt(parsed, "result") ?? {});
    } else {
        call.fail(protocolError(call.method, error));
    }
};

const failPending = function failPending(pending: Map<number, PendingCall>): void {
    for (const call of pending.values()) {
        clearTimeout(call.timer);
        call.fail(new Error(socketClosed(call.method)));
    }
    pending.clear();
};

const parsedMessage = function parsedMessage(event: MessageEvent): Record<string, unknown> {
    if (typeof event.data !== "string") {
        throw new TypeError(NOT_TEXT_MESSAGE);
    }
    const parsed: unknown = JSON.parse(event.data);
    if (!isRecord(parsed)) {
        throw new TypeError(notObjectMessage(event.data));
    }
    return parsed;
};

export const openSession = async function openSession(endpoint: string, echoConsole: boolean): Promise<Session> {
    const socket = new WebSocket(endpoint);
    const pending = new Map<number, PendingCall>();
    const collected: ConsoleRecord[] = [];
    let nextId = 0;
    await opened(socket);
    socket.addEventListener("close", () => {
        failPending(pending);
    });
    socket.addEventListener("message", (event: MessageEvent) => {
        const parsed = parsedMessage(event);
        const record = EVENT_METHODS.has(textAt(parsed, "method") ?? "") ? eventRecord(parsed) : null;
        if (record === null) {
            settleReply(pending, parsed);
            return;
        }
        collected.push(record);
        if (echoConsole) {
            process.stdout.write(consoleEcho(record.text));
        }
    });
    return {
        close: (): void => {
            socket.close();
        },
        records: (): readonly ConsoleRecord[] => collected,
        send: async (method: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> => {
            nextId += 1;
            const id = nextId;
            return new Promise((settle, fail) => {
                const timer = setTimeout(() => {
                    pending.delete(id);
                    fail(new Error(noReply(method, SEND_TIMEOUT_MS)));
                }, SEND_TIMEOUT_MS);
                pending.set(id, { fail, method, settle, timer });
                socket.send(JSON.stringify({ id, method, params }));
            });
        },
    };
};

export const devtoolsEndpoint = async function devtoolsEndpoint(
    profileDir: string,
    timeoutMs: number,
): Promise<string | null> {
    const active = await pollForPort(profileDir, Date.now() + timeoutMs);
    if (active === null) {
        return null;
    }
    const browser = await openSession(socketUrl(active.port, targetOf(active.path)), false);
    const targets = await browser.send("Target.getTargets");
    browser.close();
    const page = pageIdOf(targets);
    return page === null ? null : socketUrl(active.port, PAGE_TARGET + page);
};
