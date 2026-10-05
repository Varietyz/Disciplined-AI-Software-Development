import {
    ARCHIVE_TEMPORARY_PREFIX,
    PATH_SEPARATOR,
    REMOTE_SITE,
    REMOTE_STAGING,
    SITE_ARCHIVE,
} from "#configuration/constants/deployment.constants";
import {
    ARCHIVE_UNIT,
    FILES_FOUND,
    PACKED,
    PACKING,
    UNPACKING,
    UPLOADED_SUFFIX,
    UPLOADING,
    UPLOAD_DONE,
    UPLOAD_FAILURES,
    UPLOAD_INCOMPLETE,
    UPLOAD_LABEL,
    UPLOAD_OF,
    unpackFailed,
} from "#configuration/strings/deployment.strings";
import type { Journal, Shell, UploadStats } from "#types/deployment.types";
import { mkdtempSync, readdirSync, rmSync, statSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { createByteProgress } from "#core/reporters/journal.reporter";
import { join } from "node:path";
import { packFolder } from "#core/adapters/release.adapter";
import { tmpdir } from "node:os";

const tally = function tally(directory: string): { readonly bytes: number; readonly files: number } {
    let files = 0;
    let bytes = 0;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        const inner = entry.isDirectory() ? tally(path) : { bytes: statSync(path).size, files: 1 };
        files += inner.files;
        bytes += inner.bytes;
    }
    return { bytes, files };
};

const outcomeLine = function outcomeLine(prefix: string, uploaded: number, total: number): string {
    return (
        prefix +
        String(uploaded) +
        UPLOAD_OF +
        String(total) +
        UPLOADED_SUFFIX +
        String(total - uploaded) +
        UPLOAD_FAILURES
    );
};

const remoteFileCount = async function remoteFileCount(shell: Shell): Promise<number> {
    const counted = await shell.run(`find ${REMOTE_SITE} -type f | wc -l`);
    return Math.trunc(Number(counted.stdout.trim()));
};

export const uploadSite = async function uploadSite(shell: Shell, journal: Journal): Promise<UploadStats> {
    journal.log(UPLOADING);
    const source = absolutePath("builds.web");
    const planned = tally(source);
    journal.log(String(planned.files) + FILES_FOUND);
    journal.log(PACKING);
    const folder = mkdtempSync(join(tmpdir(), ARCHIVE_TEMPORARY_PREFIX));
    const archive = join(folder, SITE_ARCHIVE);
    const remote = REMOTE_STAGING + PATH_SEPARATOR + SITE_ARCHIVE;
    try {
        await packFolder(source, archive);
        journal.mark(PACKED);
        await shell.run(`mkdir -p ${REMOTE_STAGING}`);
        const upload = createByteProgress(journal, UPLOAD_LABEL, ARCHIVE_UNIT);
        await shell.upload(archive, remote, upload.step);
        upload.finish();
    } finally {
        rmSync(folder, { force: true, recursive: true });
    }
    journal.log(UNPACKING);
    const unpacked = await shell.run(
        `mkdir -p ${REMOTE_SITE} && find ${REMOTE_SITE} -mindepth 1 -delete && tar -xzf ${remote} -C ${REMOTE_SITE} && rm -f ${remote}`,
    );
    if (unpacked.code !== 0) {
        throw new Error(unpackFailed(unpacked.stderr));
    }
    const uploadedCount = await remoteFileCount(shell);
    if (uploadedCount !== planned.files) {
        throw new Error(outcomeLine(UPLOAD_INCOMPLETE, uploadedCount, planned.files));
    }
    journal.mark(outcomeLine(UPLOAD_DONE, uploadedCount, planned.files));
    return { failedCount: 0, totalBytes: planned.bytes, totalFileCount: planned.files, uploadedCount };
};
