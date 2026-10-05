import {
    ARCHIVE_FAILED,
    ARCHIVE_UNIT,
    BACKED_UP,
    BACKING_UP,
    BACKUP_REMOVED,
    BACKUP_SAVED,
    DOWNLOADING_BACKUP,
    DOWNLOAD_LABEL,
    EXTRACTING,
    PRUNED,
    PRUNING,
    REMOTE_BACKUP_REMOVED,
    REUPLOADING,
    REUPLOAD_LABEL,
    ROLLED_BACK,
    ROLLING_BACK,
} from "#configuration/strings/deployment.strings";
import {
    ARCHIVE_SUFFIX,
    BACKUP_PREFIX,
    BACKUP_RETENTION,
    PATH_SEPARATOR,
    REMOTE_SITE,
    REMOTE_STAGING,
} from "#configuration/constants/deployment.constants";
import type { Journal, Shell } from "#types/deployment.types";
import { mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { createByteProgress } from "#core/reporters/journal.reporter";
import { join } from "node:path";
import { stamp } from "#core/converters/text.converter";

const backupDirectory = function backupDirectory(): string {
    const directory = absolutePath("app.backups");
    mkdirSync(directory, { recursive: true });
    return directory;
};

const staged = function staged(name: string): string {
    return REMOTE_STAGING + PATH_SEPARATOR + name;
};

export const archiveSite = async function archiveSite(shell: Shell, journal: Journal): Promise<string> {
    journal.log(BACKING_UP);
    const name = BACKUP_PREFIX + stamp() + ARCHIVE_SUFFIX;
    const remote = staged(name);
    const result = await shell.run(
        `mkdir -p ${REMOTE_SITE} ${REMOTE_STAGING} && tar -czf ${remote} -C ${REMOTE_SITE} .`,
    );
    if (result.code !== 0) {
        throw new Error(ARCHIVE_FAILED + result.stderr);
    }
    if (result.stderr.length > 0) {
        journal.log(result.stderr);
    }
    journal.mark(BACKED_UP);
    journal.log(DOWNLOADING_BACKUP);
    const local = join(backupDirectory(), name);
    const download = createByteProgress(journal, DOWNLOAD_LABEL, ARCHIVE_UNIT);
    await shell.download(local, remote, download.step);
    download.finish();
    journal.mark(BACKUP_SAVED + local);
    await shell.run(`rm -f ${remote}`);
    journal.log(REMOTE_BACKUP_REMOVED);
    return name;
};

const isArchive = function isArchive(name: string): boolean {
    return name.startsWith(BACKUP_PREFIX) && name.endsWith(ARCHIVE_SUFFIX);
};

export const pruneArchives = function pruneArchives(journal: Journal): void {
    journal.log(PRUNING + String(BACKUP_RETENTION));
    const directory = backupDirectory();
    const archives = readdirSync(directory)
        .filter(isArchive)
        .toSorted((a, b) => statSync(join(directory, b)).mtimeMs - statSync(join(directory, a)).mtimeMs);
    for (const stale of archives.slice(BACKUP_RETENTION)) {
        unlinkSync(join(directory, stale));
        journal.log(BACKUP_REMOVED + stale);
    }
    journal.mark(PRUNED);
};

export const restoreSite = async function restoreSite(shell: Shell, journal: Journal, name: string): Promise<void> {
    journal.log(ROLLING_BACK);
    const remote = staged(name);
    journal.log(REUPLOADING + name);
    await shell.run(`mkdir -p ${REMOTE_STAGING}`);
    const upload = createByteProgress(journal, REUPLOAD_LABEL, ARCHIVE_UNIT);
    await shell.upload(join(backupDirectory(), name), remote, upload.step);
    upload.finish();
    journal.log(EXTRACTING);
    await shell.run(`mkdir -p ${REMOTE_SITE} && cd ${REMOTE_SITE} && tar -xzf ${remote} && rm -f ${remote}`);
    journal.log(ROLLED_BACK);
};
