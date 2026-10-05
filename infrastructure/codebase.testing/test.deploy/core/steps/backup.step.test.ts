import { ARCHIVE_FAILED, BACKUP_REMOVED } from "@banes-lab/deploy/configuration/strings/deployment.strings.ts";
import {
    ARCHIVE_SUFFIX,
    BACKUP_PREFIX,
    BACKUP_RETENTION,
    REMOTE_SITE,
} from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";
import { archiveSite, pruneArchives, restoreSite } from "@banes-lab/deploy/core/steps/backup.step.ts";
import { describe, expect, it, vi } from "vitest";
import { fakeJournal, fakeShell, ok } from "./shell.fixture.ts";

const fileSystem = vi.hoisted(() => ({
    mkdirSync: vi.fn<(path: string) => void>(),
    readdirSync: vi.fn<(path: string) => string[]>(),
    statSync: vi.fn<(path: string) => { mtimeMs: number }>(),
    unlinkSync: vi.fn<(path: string) => void>(),
}));

vi.mock("node:fs", async (importOriginal) => ({ ...(await importOriginal<Record<string, unknown>>()), ...fileSystem }));

const archiveNames = function archiveNames(count: number): string[] {
    return Array.from({ length: count }, (_, index) => BACKUP_PREFIX + String(index) + ARCHIVE_SUFFIX);
};

describe("archiveSite", () => {
    it("archives the live site, downloads it and removes the remote copy", async () => {
        const shell = fakeShell(() => ok());
        const name = await archiveSite(shell, fakeJournal());
        expect(name.startsWith(BACKUP_PREFIX)).toBe(true);
        expect(name.endsWith(ARCHIVE_SUFFIX)).toBe(true);
        expect(shell.commands[0]).toContain(REMOTE_SITE);
        expect(shell.downloads).toHaveLength(1);
        expect(shell.commands).toHaveLength(2);
    });

    it("stops before anything ships when the archive command fails, because no rollback point exists", async () => {
        const shell = fakeShell(() => ({ code: 1, stderr: "tar failed", stdout: "" }));
        await expect(archiveSite(shell, fakeJournal())).rejects.toThrow(`${ARCHIVE_FAILED}tar failed`);
        expect(shell.downloads).toHaveLength(0);
    });

    it("logs what the archive command wrote to stderr when it succeeds", async () => {
        const shell = fakeShell(() => ({ code: 0, stderr: "tar: note", stdout: "" }));
        const journal = fakeJournal();
        await archiveSite(shell, journal);
        expect(journal.lines).toContain("tar: note");
    });
});

describe("pruneArchives", () => {
    it("removes every archive beyond the retention count", () => {
        fileSystem.unlinkSync.mockClear();
        fileSystem.readdirSync.mockReturnValue(archiveNames(BACKUP_RETENTION + 2));
        fileSystem.statSync.mockImplementation((path) => ({ mtimeMs: path.length }));
        const journal = fakeJournal();
        pruneArchives(journal);
        expect(fileSystem.unlinkSync).toHaveBeenCalledTimes(2);
        expect(journal.lines.some((line) => line.startsWith(BACKUP_REMOVED))).toBe(true);
    });

    it("ignores files that are not archives", () => {
        fileSystem.unlinkSync.mockClear();
        fileSystem.readdirSync.mockReturnValue(["notes.txt", ...archiveNames(1)]);
        pruneArchives(fakeJournal());
        expect(fileSystem.unlinkSync).not.toHaveBeenCalled();
    });
});

describe("restoreSite", () => {
    it("re-uploads the archive and extracts it over the site", async () => {
        const shell = fakeShell(() => ok());
        const [name] = archiveNames(1);
        await restoreSite(shell, fakeJournal(), name ?? "");
        expect(shell.uploads).toHaveLength(1);
        expect(shell.commands.at(-1)).toContain(REMOTE_SITE);
        expect(fileSystem.mkdirSync).toHaveBeenCalled();
    });
});
