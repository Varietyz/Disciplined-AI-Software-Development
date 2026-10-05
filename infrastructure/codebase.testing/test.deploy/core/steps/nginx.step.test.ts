import {
    ACTIVE_STATUS,
    CONFIG_BACKUP_SUFFIX,
    RELOAD_COMMAND,
    REMOTE_SCRIPTS,
    REMOTE_SITE_CONFIG,
    STATUS_COMMAND,
    TEST_COMMAND,
} from "@banes-lab/deploy/configuration/constants/nginx.constants.ts";
import { describe, expect, it, vi } from "vitest";
import { fakeJournal, fakeShell, ok } from "./shell.fixture.ts";
import {
    installConfig,
    localSiteConfig,
    pullConfig,
    pullEverything,
    pushConfigs,
    verifyNginx,
} from "@banes-lab/deploy/core/steps/nginx.step.ts";
import { ARCHIVE_SUFFIX } from "@banes-lab/deploy/configuration/constants/deployment.constants.ts";
import { NOT_RUNNING } from "@banes-lab/deploy/configuration/strings/nginx.strings.ts";
import { absolutePath } from "@ssot/paths";

vi.mock("node:fs", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    mkdirSync: vi.fn(),
}));

describe("installConfig", () => {
    it("stages the file, then moves it into place with root ownership", async () => {
        const shell = fakeShell(() => ok());
        await installConfig(shell, fakeJournal(), "local.conf", REMOTE_SITE_CONFIG);
        expect(shell.uploads).toHaveLength(1);
        expect(shell.uploads[0]?.[0]).toBe("local.conf");
        expect(shell.commands.at(-1)).toContain(`sudo mv `);
        expect(shell.commands.at(-1)).toContain(REMOTE_SITE_CONFIG);
    });
});

describe("localSiteConfig", () => {
    it("points at the managed site file", () => {
        expect(localSiteConfig()).toBe(absolutePath("app.nginxSite"));
    });
});

describe("pullConfig", () => {
    it("downloads the live site config into the local backup folder", async () => {
        const shell = fakeShell(() => ok());
        const local = await pullConfig(shell, fakeJournal());
        expect(local.startsWith(absolutePath("app.backups"))).toBe(true);
        expect(local.endsWith(CONFIG_BACKUP_SUFFIX)).toBe(true);
        expect(shell.downloads[0]?.[1]).toBe(REMOTE_SITE_CONFIG);
    });
});

describe("pullEverything", () => {
    it("archives the remote nginx tree, downloads it and removes the remote archive", async () => {
        const shell = fakeShell(() => ok());
        const archive = await pullEverything(shell, fakeJournal());
        expect(archive.startsWith(absolutePath("app.backups"))).toBe(true);
        expect(archive.endsWith(ARCHIVE_SUFFIX)).toBe(true);
        expect(shell.commands).toHaveLength(2);
        expect(shell.downloads).toHaveLength(1);
    });
});

describe("pushConfigs", () => {
    it("stages and installs every managed file", async () => {
        const shell = fakeShell(() => ok());
        await pushConfigs(shell, fakeJournal());
        expect(shell.uploads.length).toBeGreaterThan(0);
        expect(shell.commands.some((command) => command.includes(REMOTE_SITE_CONFIG))).toBe(true);
        expect(shell.commands).toContain(`sudo mkdir -p ${REMOTE_SCRIPTS}`);
        expect(shell.commands.some((command) => command.includes(`${REMOTE_SCRIPTS}/catalog.js`))).toBe(true);
    });
});

describe("verifyNginx", () => {
    it("tests, reloads and confirms the service is active", async () => {
        const shell = fakeShell((command) => ok(command === STATUS_COMMAND ? ACTIVE_STATUS : ""));
        await verifyNginx(shell, fakeJournal());
        expect(shell.commands).toStrictEqual([TEST_COMMAND, RELOAD_COMMAND, STATUS_COMMAND]);
    });

    it("fails when the service is not active after the reload", async () => {
        const shell = fakeShell(() => ok());
        await expect(verifyNginx(shell, fakeJournal())).rejects.toThrow(NOT_RUNNING);
    });
});
