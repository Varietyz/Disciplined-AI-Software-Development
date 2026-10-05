import {
    FILE_TEST_COMMAND,
    MAIN_CONFIG,
    NGINX_ROOT,
    RELOAD_COMMAND,
    REMOTE_SCRIPTS,
    REMOTE_SITE_CONFIG,
    REMOVE_FILE_COMMAND,
    TEST_COMMAND,
} from "@banes-lab/deploy/configuration/constants/nginx.constants.ts";
import { RELOAD_FAILED, RESTORED, RESTORE_TEST_FAILED } from "@banes-lab/deploy/configuration/strings/nginx.strings.ts";
import {
    backupNameOf,
    managedTargets,
    pullManaged,
    restoreManaged,
} from "@banes-lab/deploy/core/steps/recovery.step.ts";
import { describe, expect, it, vi } from "vitest";
import { fakeJournal, fakeShell, ok } from "./shell.fixture.ts";
import type { CommandResult } from "@banes-lab/deploy/types/deployment.types.ts";
import { absolutePath } from "@ssot/paths";

vi.mock("node:fs", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    mkdirSync: vi.fn(),
}));

const MAIN = `${NGINX_ROOT}/${MAIN_CONFIG}`;
const SCRIPT = `${REMOTE_SCRIPTS}/catalog.js`;

const failing = function failing(stderr: string): CommandResult {
    return { code: 1, stderr, stdout: "" };
};

describe("managedTargets", () => {
    it("lists every remote file a push replaces: the main config, each script and the site", () => {
        expect(managedTargets()).toStrictEqual([MAIN, SCRIPT, REMOTE_SITE_CONFIG]);
    });
});

describe("backupNameOf", () => {
    it("stamps each backup and keeps the backup marker before its extension", () => {
        expect(backupNameOf(SCRIPT, "t")).toBe("catalog-t.backup.js");
        expect(backupNameOf(MAIN, "t")).toBe("nginx-t.backup.conf");
        expect(backupNameOf(REMOTE_SITE_CONFIG, "t")).toBe("banes-lab-t.backup.conf");
    });
});

describe("pullManaged", () => {
    it("downloads each present file and records an absent one so a restore removes it", async () => {
        const shell = fakeShell((command) => (command === `${FILE_TEST_COMMAND} ${SCRIPT}` ? failing("") : ok()));
        const backups = await pullManaged(shell, fakeJournal());
        expect(backups.map((backup) => backup.remote)).toStrictEqual([MAIN, SCRIPT, REMOTE_SITE_CONFIG]);
        expect(backups.find((backup) => backup.remote === SCRIPT)?.local).toBeNull();
        expect(shell.downloads.map(([, remote]) => remote)).toStrictEqual([MAIN, REMOTE_SITE_CONFIG]);
        expect(shell.downloads.every(([local]) => local.startsWith(absolutePath("app.backups")))).toBe(true);
    });
});

describe("restoreManaged", () => {
    const backups = [
        { local: "main.backup.conf", remote: MAIN },
        { local: null, remote: SCRIPT },
    ];

    it("puts every file back, removes one that did not exist, then tests and reloads", async () => {
        const shell = fakeShell(() => ok());
        const journal = fakeJournal();
        await restoreManaged(shell, journal, backups);
        expect(shell.uploads[0]?.[0]).toBe("main.backup.conf");
        expect(shell.commands).toContain(`${REMOVE_FILE_COMMAND} ${SCRIPT}`);
        expect(shell.commands.slice(-2)).toStrictEqual([TEST_COMMAND, RELOAD_COMMAND]);
        expect(journal.lines).toContain(RESTORED);
    });

    it("fails loudly when the restored configuration does not pass its test", async () => {
        const shell = fakeShell((command) => (command === TEST_COMMAND ? failing("bad") : ok()));
        await expect(restoreManaged(shell, fakeJournal(), backups)).rejects.toThrow(`${RESTORE_TEST_FAILED}bad`);
    });

    it("fails loudly when nginx refuses the reload", async () => {
        const shell = fakeShell((command) => (command === RELOAD_COMMAND ? failing("down") : ok()));
        await expect(restoreManaged(shell, fakeJournal(), backups)).rejects.toThrow(`${RELOAD_FAILED}down`);
    });
});
