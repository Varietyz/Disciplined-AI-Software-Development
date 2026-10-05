import type { CommandResult, Journal, Shell } from "@banes-lab/deploy/types/deployment.types.ts";

export interface FakeShell extends Shell {
    readonly commands: string[];
    readonly downloads: (readonly [string, string])[];
    readonly uploads: (readonly [string, string])[];
}

export const fakeShell = function fakeShell(answer: (command: string) => CommandResult): FakeShell {
    const commands: string[] = [];
    const downloads: (readonly [string, string])[] = [];
    const uploads: (readonly [string, string])[] = [];
    return {
        commands,
        connect: async () => {
            await Promise.resolve();
        },
        dispose: () => {},
        download: async (local, remote) => {
            downloads.push([local, remote]);
            await Promise.resolve();
        },
        downloads,
        run: async (command) => {
            commands.push(command);
            return answer(command);
        },
        upload: async (local, remote) => {
            uploads.push([local, remote]);
            await Promise.resolve();
        },
        uploads,
    };
};

export const ok = function ok(stdout = ""): CommandResult {
    return { code: 0, stderr: "", stdout };
};

export const fakeJournal = function fakeJournal(): Journal & { readonly lines: string[] } {
    const lines: string[] = [];
    const log = (message: string): void => {
        lines.push(message);
    };
    return { error: log, lines, log, mark: log, summary: () => lines.join("\n") };
};
