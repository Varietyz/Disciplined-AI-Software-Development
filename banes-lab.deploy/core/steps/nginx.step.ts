import {
    ACTIVE_STATUS,
    CONFIG_BACKUP_SUFFIX,
    CONFIG_MODE,
    CONFIG_OWNER,
    FULL_BACKUP_PREFIX,
    MAIN_CONFIG,
    NGINX_FOLDER,
    NGINX_PARENT,
    NGINX_ROOT,
    RELOAD_COMMAND,
    REMOTE_FULL_ARCHIVE,
    REMOTE_SCRIPTS,
    REMOTE_SITE_CONFIG,
    SCRIPT_STAGING_PREFIX,
    SITE_NAME,
    STATUS_COMMAND,
    TEST_COMMAND,
} from "#configuration/constants/nginx.constants";
import {
    ARCHIVE_SUFFIX,
    PATH_SEPARATOR,
    REMOTE_STAGING,
    STAMP_SEPARATOR,
} from "#configuration/constants/deployment.constants";
import {
    CONFIG_DOWNLOADING,
    CONFIG_SAVED,
    CONFIG_UPLOADED,
    FULL_ARCHIVE_CLEANED,
    FULL_ARCHIVE_CREATED,
    FULL_ARCHIVE_SAVED,
    LOCAL_NGINX_MISSING,
    NOT_RUNNING,
    RELOADED,
    RELOADING,
    RELOAD_FAILED,
    RUNNING,
    TESTING,
    TEST_FAILED,
    TEST_PASSED,
    UPLOADING_CONFIGS,
    VERIFYING,
} from "#configuration/strings/nginx.strings";
import type { Journal, Shell } from "#types/deployment.types";
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    rmSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { scriptNameOf, scriptTextOf } from "#core/converters/nginx.converter";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";
import { stamp } from "#core/converters/text.converter";
import { tmpdir } from "node:os";

const nginxBackups = function nginxBackups(): string {
    const directory = absolutePath("app.backups");
    mkdirSync(directory, { recursive: true });
    return directory;
};

export const localSiteConfig = function localSiteConfig(): string {
    return absolutePath("app.nginxSite");
};

export const pullConfig = async function pullConfig(shell: Shell, journal: Journal): Promise<string> {
    journal.log(CONFIG_DOWNLOADING);
    const local = join(nginxBackups(), SITE_NAME + STAMP_SEPARATOR + stamp() + CONFIG_BACKUP_SUFFIX);
    await shell.download(local, REMOTE_SITE_CONFIG);
    journal.log(CONFIG_SAVED + local);
    return local;
};

export const pullEverything = async function pullEverything(shell: Shell, journal: Journal): Promise<string> {
    const local = join(nginxBackups(), FULL_BACKUP_PREFIX + stamp() + ARCHIVE_SUFFIX);
    await shell.run(`mkdir -p ${REMOTE_STAGING} && tar -czf ${REMOTE_FULL_ARCHIVE} -C ${NGINX_PARENT} ${NGINX_FOLDER}`);
    journal.log(FULL_ARCHIVE_CREATED);
    await shell.download(local, REMOTE_FULL_ARCHIVE);
    journal.log(FULL_ARCHIVE_SAVED + local);
    await shell.run(`rm -f ${REMOTE_FULL_ARCHIVE}`);
    journal.log(FULL_ARCHIVE_CLEANED);
    return local;
};

export const installConfig = async function installConfig(
    shell: Shell,
    journal: Journal,
    local: string,
    remote: string,
): Promise<void> {
    const staged = REMOTE_STAGING + remote.slice(remote.lastIndexOf(PATH_SEPARATOR));
    await shell.run(`mkdir -p ${REMOTE_STAGING}`);
    await shell.upload(local, staged);
    await shell.run(
        `sudo mv ${staged} ${remote} && sudo chown ${CONFIG_OWNER} ${remote} && sudo chmod ${CONFIG_MODE} ${remote}`,
    );
    journal.log(CONFIG_UPLOADED + remote);
};

const installEach = async function installEach(
    shell: Shell,
    journal: Journal,
    pairs: readonly (readonly [string, string])[],
): Promise<void> {
    const [first, ...rest] = pairs;
    if (first === undefined) {
        return;
    }
    await installConfig(shell, journal, first[0], first[1]);
    await installEach(shell, journal, rest);
};

const pushScripts = async function pushScripts(shell: Shell, journal: Journal): Promise<void> {
    const scripts = absolutePath("app.nginxScripts");
    if (!existsSync(scripts)) {
        return;
    }
    const names = readdirSync(scripts).filter((name) => statSync(join(scripts, name)).isFile());
    const staged = mkdtempSync(join(tmpdir(), SCRIPT_STAGING_PREFIX));
    const pairs = names.map((name): readonly [string, string] => {
        const target = scriptNameOf(name);
        const output = join(staged, target);
        const source = readFileSync(join(scripts, name), "utf8");
        writeFileSync(output, scriptTextOf(name, source));
        return [output, REMOTE_SCRIPTS + PATH_SEPARATOR + target];
    });
    await shell.run(`sudo mkdir -p ${REMOTE_SCRIPTS}`);
    await installEach(shell, journal, pairs);
    rmSync(staged, { force: true, recursive: true });
};

export const pushConfigs = async function pushConfigs(shell: Shell, journal: Journal): Promise<void> {
    journal.log(UPLOADING_CONFIGS);
    const local = absolutePath("app.nginx");
    if (!existsSync(local)) {
        throw new Error(LOCAL_NGINX_MISSING + local);
    }
    const main = absolutePath("app.nginxMain");
    if (existsSync(main)) {
        await installConfig(shell, journal, main, NGINX_ROOT + PATH_SEPARATOR + MAIN_CONFIG);
    }
    await pushScripts(shell, journal);
    const site = localSiteConfig();
    if (existsSync(site)) {
        await installConfig(shell, journal, site, REMOTE_SITE_CONFIG);
    }
};

export const verifyNginx = async function verifyNginx(shell: Shell, journal: Journal): Promise<void> {
    journal.log(TESTING);
    const test = await shell.run(TEST_COMMAND);
    if (test.code !== 0) {
        throw new Error(TEST_FAILED + test.stderr);
    }
    journal.log(TEST_PASSED);
    journal.log(RELOADING);
    const reload = await shell.run(RELOAD_COMMAND);
    if (reload.code !== 0) {
        throw new Error(RELOAD_FAILED + reload.stderr);
    }
    journal.log(RELOADED);
    journal.log(VERIFYING);
    const status = await shell.run(STATUS_COMMAND);
    if (status.stdout.trim() !== ACTIVE_STATUS) {
        throw new Error(NOT_RUNNING);
    }
    journal.log(RUNNING);
};
