import {
    commandFailed,
    portHeldLine,
    portReleasedLine,
    probeFailed,
    signalFailed,
} from "#configuration/strings/server.strings";
import { execFileSync } from "node:child_process";
import { isRecord } from "#core/selectors/base.selector";
import process from "node:process";
import { wait } from "#core/timers/base.timer";

const WINDOWS = "win32";
const LISTENING = "LISTENING";
const SYSTEM_PIDS: ReadonlySet<string> = new Set(["0", "4"]);
const RELEASE_ATTEMPTS = 20;
const RELEASE_INTERVAL_MS = 50;

const LOCAL_ADDRESS_COLUMN = 1;
const STATE_COLUMN = 3;
const PID_COLUMN = 4;

const NO_MATCH_STATUS = 1;
const TASK_GONE_STATUS = 128;
const PROCESS_GONE = "ESRCH";

const tokensOf = function tokensOf(line: string): string[] {
    return line
        .split(" ")
        .map((token) => token.trim())
        .filter((token) => token.length > 0);
};

const exitStatusOf = function exitStatusOf(error: unknown): unknown {
    return isRecord(error) ? error["status"] : null;
};

const commandOutput = function commandOutput(
    file: string,
    args: readonly string[],
    quiet: ReadonlySet<number>,
): string {
    try {
        return execFileSync(file, [...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    } catch (error: unknown) {
        const status = exitStatusOf(error);
        if (typeof status === "number" && quiet.has(status)) {
            return "";
        }
        throw new Error(commandFailed(file), { cause: error });
    }
};

const signaled = function signaled(pid: number): boolean {
    try {
        process.kill(pid, "SIGKILL");
        return true;
    } catch (error: unknown) {
        if (isRecord(error) && error["code"] === PROCESS_GONE) {
            return false;
        }
        throw new Error(signalFailed(pid), { cause: error });
    }
};

const windowsHolders = function windowsHolders(port: number): string[] {
    const suffix = `:${String(port)}`;
    const pids = new Set<string>();
    for (const line of commandOutput("netstat", ["-ano", "-p", "TCP"], new Set()).split("\n")) {
        const tokens = tokensOf(line);
        const local = tokens[LOCAL_ADDRESS_COLUMN] ?? "";
        const state = tokens[STATE_COLUMN] ?? "";
        const pid = tokens[PID_COLUMN] ?? "";
        if (local.endsWith(suffix) && state === LISTENING && pid.length > 0 && !SYSTEM_PIDS.has(pid)) {
            pids.add(pid);
        }
    }
    return [...pids];
};

const posixHolders = function posixHolders(port: number): string[] {
    const listed = commandOutput("lsof", ["-ti", `tcp:${String(port)}`, "-sTCP:LISTEN"], new Set([NO_MATCH_STATUS]));
    return [
        ...new Set(
            listed
                .split("\n")
                .map((line) => line.trim())
                .filter((pid) => pid.length > 0 && !SYSTEM_PIDS.has(pid)),
        ),
    ];
};

export const holdersOf = function holdersOf(port: number): string[] {
    return process.platform === WINDOWS ? windowsHolders(port) : posixHolders(port);
};

const alive = function alive(pid: number): boolean {
    try {
        process.kill(pid, 0);
        return true;
    } catch (error: unknown) {
        if (isRecord(error) && error["code"] === PROCESS_GONE) {
            return false;
        }
        throw new Error(probeFailed(pid), { cause: error });
    }
};

const killTaskTree = function killTaskTree(pid: number): boolean {
    try {
        const output = commandOutput("taskkill", ["/PID", String(pid), "/F", "/T"], new Set([TASK_GONE_STATUS]));
        return output.length > 0;
    } catch (error: unknown) {
        if (alive(pid)) {
            throw error;
        }
        return true;
    }
};

export const terminateTree = function terminateTree(pid: number): boolean {
    return process.platform === WINDOWS ? killTaskTree(pid) : signaled(-pid);
};

const terminate = function terminate(pid: string): boolean {
    return process.platform === WINDOWS ? killTaskTree(Number(pid)) : signaled(Number(pid));
};

export const awaitRelease = async function awaitRelease(port: number, attempt = 0): Promise<boolean> {
    if (holdersOf(port).length === 0) {
        return true;
    }
    if (attempt >= RELEASE_ATTEMPTS) {
        return false;
    }
    await wait(RELEASE_INTERVAL_MS);
    return awaitRelease(port, attempt + 1);
};

export const freePort = async function freePort(port: number): Promise<string[]> {
    const held = holdersOf(port);
    if (held.length === 0) {
        return [];
    }
    held.forEach((pid) => {
        terminate(pid);
    });
    const released = await awaitRelease(port);
    const label = held.join(", ");
    if (!released) {
        process.stderr.write(portHeldLine(port, label));
        return held;
    }
    process.stdout.write(portReleasedLine(port, label));
    return held;
};
