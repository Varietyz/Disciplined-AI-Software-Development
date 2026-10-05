import {
    CONNECTED,
    CONNECTING,
    DEPLOY_DONE,
    DEPLOY_FAILED,
    DEPLOY_START,
    FATAL,
    ROLLBACK_FAILED,
    SECONDS_SUFFIX,
    SUMMARY_BACKUP,
    SUMMARY_DURATION,
    SUMMARY_FILES,
    SUMMARY_SIZE,
    SUMMARY_TITLE,
    UPLOAD_OF,
} from "#configuration/strings/deployment.strings";
import type { Journal, ManagedBackup, Outcome, Secrets, Shell, UploadStats } from "#types/deployment.types";
import { archiveSite, pruneArchives, restoreSite } from "#core/steps/backup.step";
import { buildSite, validateSite } from "#core/steps/site.step";
import { formatBytes, formatDuration } from "#core/converters/text.converter";
import { pullManaged, restoreManaged } from "#core/steps/recovery.step";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";
import { createJournal } from "#core/reporters/journal.reporter";
import { createShell } from "#core/adapters/shell.adapter";
import { fetchIndex } from "#core/adapters/package.adapter";
import { loadSecrets } from "#core/loaders/environment.loader";
import { messageOf } from "#core/converters/failure.converter";
import { prepareServer } from "#core/steps/setup.step";
import { probeSite } from "#core/steps/probe.step";
import { pruneRemoteRoot } from "#core/steps/remote.step";
import { reportDeployment } from "#core/reporters/deployment.reporter";
import { uploadSite } from "#core/steps/release.step";
import { verifyNginx } from "#core/steps/nginx.step";

const summarize = function summarize(journal: Journal, stats: UploadStats, outcome: Outcome): void {
    journal.log(SUMMARY_TITLE);
    journal.log(SUMMARY_FILES + String(stats.uploadedCount) + UPLOAD_OF + String(stats.totalFileCount));
    journal.log(SUMMARY_SIZE + formatBytes(stats.totalBytes));
    journal.log(SUMMARY_DURATION + formatDuration(outcome.span.finishedAt - outcome.span.startedAt) + SECONDS_SUFFIX);
    journal.log(SUMMARY_BACKUP + outcome.backup);
    journal.log(DEPLOY_DONE);
    journal.log(SITE_URL);
};

const ship = async function ship(
    shell: Shell,
    journal: Journal,
    secrets: Secrets,
    startedAt: number,
): Promise<boolean> {
    journal.log(DEPLOY_START);
    await buildSite(journal);
    await validateSite(journal);
    journal.log(CONNECTING);
    await shell.connect();
    journal.mark(CONNECTED);
    const backup = await archiveSite(shell, journal);
    let managed: readonly ManagedBackup[] = [];
    try {
        pruneArchives(journal);
        const stats = await uploadSite(shell, journal);
        await pruneRemoteRoot(shell, journal);
        managed = await pullManaged(shell, journal);
        await prepareServer(shell, journal, fetchIndex);
        await verifyNginx(shell, journal);
        await probeSite(journal, SITE_URL, shell);
        const outcome: Outcome = { backup, failure: "", span: { finishedAt: Date.now(), startedAt }, stats };
        const reported = await reportDeployment(journal, secrets.deployWebhook, outcome);
        summarize(journal, stats, outcome);
        return reported;
    } catch (error: unknown) {
        journal.error(DEPLOY_FAILED + messageOf(error));
        try {
            if (managed.length > 0) {
                await restoreManaged(shell, journal, managed);
            }
            await restoreSite(shell, journal, backup);
        } catch (rollbackError: unknown) {
            journal.error(ROLLBACK_FAILED + messageOf(rollbackError));
        }
        throw error;
    }
};

const run = async function run(): Promise<number> {
    const secrets = loadSecrets();
    const journal = createJournal();
    const shell = createShell(secrets);
    const startedAt = Date.now();
    try {
        return (await ship(shell, journal, secrets, startedAt)) ? 0 : 1;
    } catch (error: unknown) {
        const failure = messageOf(error);
        journal.error(DEPLOY_FAILED + failure);
        const span = { finishedAt: Date.now(), startedAt };
        await reportDeployment(journal, secrets.deployWebhook, { backup: "", failure, span, stats: null });
        return 1;
    } finally {
        shell.dispose();
    }
};

run()
    .then((status) => {
        process.exitCode = status;
    })
    .catch((error: unknown) => {
        console.error(FATAL + messageOf(error));
        process.exitCode = 1;
    });
