import {
    BACKUP_MARKER,
    CONFIG_BACKUP_SUFFIX,
    FILE_TEST_COMMAND,
    MAIN_CONFIG,
    NAME_SEPARATOR,
    NGINX_ROOT,
    RELOAD_COMMAND,
    REMOTE_SCRIPTS,
    REMOTE_SITE_CONFIG,
    REMOVE_FILE_COMMAND,
    TEST_COMMAND,
} from "#configuration/constants/nginx.constants";
import {
    CONFIG_DOWNLOADING,
    CONFIG_SAVED,
    RELOAD_FAILED,
    RESTORED,
    RESTORE_TEST_FAILED,
    RESTORING,
} from "#configuration/strings/nginx.strings";
import type { Journal, ManagedBackup, Shell } from "#types/deployment.types";
import { PATH_SEPARATOR, STAMP_SEPARATOR } from "#configuration/constants/deployment.constants";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { installConfig } from "#core/steps/nginx.step";
import { join } from "node:path";
import { scriptNameOf } from "#core/converters/nginx.converter";
import { stamp } from "#core/converters/text.converter";

const scriptTargets = function scriptTargets(): string[] {
    const scripts = absolutePath("app.nginxScripts");
    if (!existsSync(scripts)) {
        return [];
    }
    return readdirSync(scripts)
        .filter((name) => statSync(join(scripts, name)).isFile())
        .map((name) => REMOTE_SCRIPTS + PATH_SEPARATOR + scriptNameOf(name));
};

export const managedTargets = function managedTargets(): string[] {
    const main = existsSync(absolutePath("app.nginxMain")) ? [NGINX_ROOT + PATH_SEPARATOR + MAIN_CONFIG] : [];
    const site = existsSync(absolutePath("app.nginxSite")) ? [REMOTE_SITE_CONFIG] : [];
    return [...main, ...scriptTargets(), ...site];
};

export const backupNameOf = function backupNameOf(remote: string, at: string): string {
    const base = remote.slice(remote.lastIndexOf(PATH_SEPARATOR) + 1);
    const dot = base.lastIndexOf(NAME_SEPARATOR);
    if (dot === -1) {
        return base + STAMP_SEPARATOR + at + CONFIG_BACKUP_SUFFIX;
    }
    return base.slice(0, dot) + STAMP_SEPARATOR + at + BACKUP_MARKER + base.slice(dot);
};

const pullOne = async function pullOne(
    shell: Shell,
    journal: Journal,
    remote: string,
    at: string,
): Promise<ManagedBackup> {
    const present = await shell.run(`${FILE_TEST_COMMAND} ${remote}`);
    if (present.code !== 0) {
        return { local: null, remote };
    }
    const folder = absolutePath("app.backups");
    mkdirSync(folder, { recursive: true });
    const local = join(folder, backupNameOf(remote, at));
    await shell.download(local, remote);
    journal.log(CONFIG_SAVED + local);
    return { local, remote };
};

const pullEach = async function pullEach(
    shell: Shell,
    journal: Journal,
    remotes: readonly string[],
    at: string,
): Promise<ManagedBackup[]> {
    const [remote, ...rest] = remotes;
    if (remote === undefined) {
        return [];
    }
    const backup = await pullOne(shell, journal, remote, at);
    return [backup, ...(await pullEach(shell, journal, rest, at))];
};

export const pullManaged = async function pullManaged(shell: Shell, journal: Journal): Promise<ManagedBackup[]> {
    journal.log(CONFIG_DOWNLOADING);
    return pullEach(shell, journal, managedTargets(), stamp());
};

const restoreEach = async function restoreEach(
    shell: Shell,
    journal: Journal,
    backups: readonly ManagedBackup[],
): Promise<void> {
    const [backup, ...rest] = backups;
    if (backup === undefined) {
        return;
    }
    await (backup.local === null
        ? shell.run(`${REMOVE_FILE_COMMAND} ${backup.remote}`)
        : installConfig(shell, journal, backup.local, backup.remote));
    await restoreEach(shell, journal, rest);
};

export const restoreManaged = async function restoreManaged(
    shell: Shell,
    journal: Journal,
    backups: readonly ManagedBackup[],
): Promise<void> {
    journal.log(RESTORING);
    await restoreEach(shell, journal, backups);
    const test = await shell.run(TEST_COMMAND);
    if (test.code !== 0) {
        throw new Error(RESTORE_TEST_FAILED + test.stderr);
    }
    const reload = await shell.run(RELOAD_COMMAND);
    if (reload.code !== 0) {
        throw new Error(RELOAD_FAILED + reload.stderr);
    }
    journal.log(RESTORED);
};
