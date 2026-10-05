import type { CapturedOutcome, ShellDescriptor } from "#types/shell.types";
import { FALLBACK_EXIT, FLAG_SEPARATOR } from "#configuration/constants/shell.constants";
import type { WriteStream } from "node:tty";
import process from "node:process";
import { spawn } from "node:child_process";

const spawnCommand = function spawnCommand(
    shell: ShellDescriptor,
    command: string,
    stdio: "inherit" | "pipe",
    cwd?: string,
): ReturnType<typeof spawn> {
    return spawn(shell.shell, [...shell.flag.split(FLAG_SEPARATOR), command], {
        cwd,
        stdio,
        windowsVerbatimArguments: true,
    });
};

export const runCaptured = async function runCaptured(
    shell: ShellDescriptor,
    command: string,
    cwd?: string,
): Promise<CapturedOutcome> {
    return new Promise((resolve) => {
        const child = spawnCommand(shell, command, "pipe", cwd);
        const chunks: string[] = [];
        const collect = (buffer: Buffer): void => {
            chunks.push(buffer.toString("utf8"));
        };
        child.stdout?.on("data", collect);
        child.stderr?.on("data", collect);
        child.on("error", (error: Error) => {
            chunks.push(`${error.message}\n`);
        });
        child.on("close", (code: number | null) => {
            resolve({ code: code ?? FALLBACK_EXIT, out: chunks.join("") });
        });
    });
};

export const runLive = async function runLive(shell: ShellDescriptor, command: string): Promise<number> {
    return new Promise((resolve) => {
        const child = spawnCommand(shell, command, "inherit");
        child.on("error", (error: Error) => {
            process.stderr.write(`${error.message}\n`);
            resolve(FALLBACK_EXIT);
        });
        child.on("close", (code: number | null) => {
            resolve(code ?? FALLBACK_EXIT);
        });
    });
};

export const runTee = async function runTee(
    shell: ShellDescriptor,
    command: string,
    cwd?: string,
): Promise<CapturedOutcome> {
    return new Promise((resolve) => {
        const child = spawnCommand(shell, command, "pipe", cwd);
        const chunks: string[] = [];
        const relay = (buffer: Buffer, stream: WriteStream): void => {
            const text = buffer.toString("utf8");
            chunks.push(text);
            stream.write(text);
        };
        child.stdout?.on("data", (buffer: Buffer) => {
            relay(buffer, process.stdout);
        });
        child.stderr?.on("data", (buffer: Buffer) => {
            relay(buffer, process.stderr);
        });
        child.on("error", (error: Error) => {
            chunks.push(`${error.message}\n`);
        });
        child.on("close", (code: number | null) => {
            resolve({ code: code ?? FALLBACK_EXIT, out: chunks.join("") });
        });
    });
};
