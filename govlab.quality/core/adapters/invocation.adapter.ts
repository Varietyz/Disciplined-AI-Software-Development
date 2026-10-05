import { OUTPUT_LIMIT } from "#configuration/constants/tool.constants";
import type { SpawnSyncOptionsWithStringEncoding } from "node:child_process";
import type { ToolSpawn } from "#types/tool.types";
import { commandFailed } from "#configuration/strings/catalog.strings";
import spawn from "cross-spawn";

const UNKNOWN_VERSION = "unknown";

export const spawnTool = function spawnTool(
    bin: string,
    args: string[],
    options: SpawnSyncOptionsWithStringEncoding,
): ToolSpawn {
    return spawn.sync(bin, args, { maxBuffer: OUTPUT_LIMIT, ...options });
};

export const commandOutput = function commandOutput(bin: string, args: string[]): string {
    const result = spawnTool(bin, args, { encoding: "utf8" });
    if (result.error instanceof Error || result.status !== 0) {
        throw new Error(commandFailed([bin, ...args].join(" "), result.stderr));
    }
    return result.stdout;
};

export const commandVersion = function commandVersion(bin: string, args: string[]): string {
    const result = spawnTool(bin, args, { encoding: "utf8" });
    const first = result.status === 0 ? (result.stdout.split("\n")[0] ?? "").trim() : "";
    return first === "" ? UNKNOWN_VERSION : first;
};
