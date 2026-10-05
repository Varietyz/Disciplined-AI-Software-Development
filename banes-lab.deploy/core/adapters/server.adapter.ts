import { LOG_SIZE_COMMAND, LOG_TAIL_COMMAND } from "#configuration/constants/nginx.constants";
import { PROBE_LOG_UNREADABLE } from "#configuration/strings/deployment.strings";
import type { Shell } from "#types/deployment.types";

export const logSize = async function logSize(shell: Shell, log: string): Promise<number> {
    const result = await shell.run(`${LOG_SIZE_COMMAND} ${log}`);
    const size = Number(result.stdout.trim());
    if (result.code !== 0 || !Number.isInteger(size)) {
        throw new Error(PROBE_LOG_UNREADABLE + log);
    }
    return size;
};

export const loggedSince = async function loggedSince(shell: Shell, log: string, offset: number): Promise<string> {
    const size = await logSize(shell, log);
    const from = size < offset ? 0 : offset;
    if (size === from) {
        return "";
    }
    const result = await shell.run(`${LOG_TAIL_COMMAND}${String(from + 1)} ${log}`);
    if (result.code !== 0) {
        throw new Error(PROBE_LOG_UNREADABLE + log);
    }
    return result.stdout.trim();
};
