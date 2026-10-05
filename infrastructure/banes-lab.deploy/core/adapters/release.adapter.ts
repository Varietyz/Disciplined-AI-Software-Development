import { ARCHIVE_BINARY, BUILD_ARGUMENTS, BUILD_BINARY } from "#configuration/constants/deployment.constants";
import { basename, dirname } from "node:path";
import { execFile, spawn } from "node:child_process";
import type { ChildExit } from "#types/deployment.types";

export const packFolder = async function packFolder(source: string, archive: string): Promise<void> {
    const args = ["-czf", basename(archive), "-C", source, "."];
    await new Promise<void>((resolve, reject) => {
        execFile(ARCHIVE_BINARY, args, { cwd: dirname(archive) }, (error) => {
            if (error instanceof Error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
};

export const buildRelease = async function buildRelease(member: string): Promise<ChildExit> {
    return new Promise<ChildExit>((resolve, reject) => {
        const child = spawn(BUILD_BINARY, [...BUILD_ARGUMENTS, member], { stdio: "inherit" });
        child.on("error", reject);
        child.on("exit", (code, signal) => {
            resolve({ code, signal });
        });
    });
};
