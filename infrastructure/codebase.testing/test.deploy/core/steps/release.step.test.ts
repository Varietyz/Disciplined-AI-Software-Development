import type { CommandResult, UploadStats } from "@banes-lab/deploy/types/deployment.types.ts";
import { REMOTE_SITE, SITE_ARCHIVE } from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";
import { UPLOAD_INCOMPLETE, unpackFailed } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import { describe, expect, it, vi } from "vitest";
import { fakeJournal, fakeShell, ok } from "./shell.fixture.ts";
import { uploadSite } from "@banes-lab/deploy/core/steps/release.step.ts";

interface Entry {
    readonly isDirectory: () => boolean;
    readonly name: string;
}

const fileSystem = vi.hoisted(() => ({
    readdirSync: vi.fn<(path: string) => Entry[]>(),
    statSync: vi.fn<(path: string) => { size: number }>(),
}));

const packed = vi.hoisted(() => ({ calls: [] as (readonly [string, string])[] }));

vi.mock("node:fs", async (importOriginal) => ({ ...(await importOriginal<Record<string, unknown>>()), ...fileSystem }));

vi.mock("@banes-lab/deploy/core/adapters/release.adapter.ts", () => ({
    packFolder: async (source: string, archive: string) => {
        packed.calls.push([source, archive]);
        await Promise.resolve();
    },
}));

const entry = function entry(name: string, directory: boolean): Entry {
    return { isDirectory: () => directory, name };
};

const tree = function tree(): void {
    fileSystem.readdirSync.mockImplementation((path) =>
        path.endsWith(".hidden") ? [entry("b.js", false)] : [entry("a.html", false), entry(".hidden", true)],
    );
    fileSystem.statSync.mockReturnValue({ size: 5 });
};

const answering = function answering(count: string, unpack: CommandResult = ok()): (command: string) => CommandResult {
    return (command) => {
        if (command.includes("wc -l")) {
            return ok(count);
        }
        return command.includes("tar -xzf") ? unpack : ok();
    };
};

describe("uploadSite", () => {
    it("packs the tree, uploads one archive, replaces the remote site with its contents, and counts the files", async () => {
        tree();
        const shell = fakeShell(answering("2\n"));
        const stats: UploadStats = await uploadSite(shell, fakeJournal());
        expect(packed.calls.at(-1)?.[1].endsWith(SITE_ARCHIVE)).toBe(true);
        expect(shell.uploads).toHaveLength(1);
        expect(shell.commands.some((command) => command.includes("tar -xzf") && command.includes(REMOTE_SITE))).toBe(
            true,
        );
        expect(stats).toStrictEqual({ failedCount: 0, totalBytes: 10, totalFileCount: 2, uploadedCount: 2 });
    });

    it("fails when the archive does not unpack, or the droplet holds fewer files than the build", async () => {
        tree();
        const broken = fakeShell(answering("2\n", { code: 2, stderr: "gzip: unexpected end", stdout: "" }));
        await expect(uploadSite(broken, fakeJournal())).rejects.toThrow(unpackFailed("gzip: unexpected end"));
        const short = fakeShell(answering("1\n"));
        await expect(uploadSite(short, fakeJournal())).rejects.toThrow(UPLOAD_INCOMPLETE);
    });
});
