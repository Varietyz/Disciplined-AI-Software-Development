import { CONNECTED, CONNECTING, FATAL, ROLLBACK_FAILED } from "#configuration/strings/deployment.strings";
import type { Journal, ManagedBackup, Secrets, Shell } from "#types/deployment.types";
import {
    LOCAL_BACKUP_LABEL,
    PULL_FULL_START,
    PULL_START,
    PUSH_START,
    SYNC_DONE,
    SYNC_FAILED,
    USAGE,
} from "#configuration/strings/nginx.strings";
import {
    PULL_COMMANDS,
    PULL_FULL_COMMANDS,
    PUSH_COMMANDS,
    REMOTE_SITE_CONFIG,
} from "#configuration/constants/nginx.constants";
import { localSiteConfig, pullConfig, pullEverything, verifyNginx } from "#core/steps/nginx.step";
import { pullManaged, restoreManaged } from "#core/steps/recovery.step";
import { reportPull, reportPullFailure, reportPush, reportPushFailure } from "#core/reporters/nginx.reporter";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";
import { createJournal } from "#core/reporters/journal.reporter";
import { createShell } from "#core/adapters/shell.adapter";
import { fetchIndex } from "#core/adapters/package.adapter";
import { loadSecrets } from "#core/loaders/environment.loader";
import { messageOf } from "#core/converters/failure.converter";
import { prepareServer } from "#core/steps/setup.step";
import { probeSite } from "#core/steps/probe.step";

const ARGUMENT_OFFSET = 2;

interface Session {
    readonly journal: Journal;
    readonly secrets: Secrets;
    readonly shell: Shell;
}

const open = async function open(session: Session): Promise<void> {
    session.journal.log(CONNECTING);
    await session.shell.connect();
    session.journal.log(CONNECTED);
};

const pull = async function pull(session: Session, everything: boolean): Promise<number> {
    const { journal, secrets, shell } = session;
    const startedAt = Date.now();
    try {
        journal.log(everything ? PULL_FULL_START : PULL_START);
        await open(session);
        const local = everything ? await pullEverything(shell, journal) : await pullConfig(shell, journal);
        journal.log(SYNC_DONE);
        const reported = await reportPull(journal, secrets.nginxWebhook, { finishedAt: Date.now(), startedAt }, local);
        return reported ? 0 : 1;
    } catch (error: unknown) {
        journal.error(SYNC_FAILED + messageOf(error));
        await reportPullFailure(journal, secrets.nginxWebhook, { finishedAt: Date.now(), startedAt }, messageOf(error));
        return 1;
    }
};

const push = async function push(session: Session): Promise<number> {
    const { journal, secrets, shell } = session;
    const startedAt = Date.now();
    let backups: readonly ManagedBackup[] = [];
    let localBackup = "";
    try {
        journal.log(PUSH_START);
        await open(session);
        backups = await pullManaged(shell, journal);
        localBackup = backups.find((backup) => backup.remote === REMOTE_SITE_CONFIG)?.local ?? "";
        await prepareServer(shell, journal, fetchIndex);
        await verifyNginx(shell, journal);
        await probeSite(journal, SITE_URL, shell);
        journal.log(SYNC_DONE);
        journal.log(LOCAL_BACKUP_LABEL + localBackup);
        const span = { finishedAt: Date.now(), startedAt };
        const reported = await reportPush(journal, secrets.nginxWebhook, span, localBackup, localSiteConfig());
        return reported ? 0 : 1;
    } catch (error: unknown) {
        journal.error(SYNC_FAILED + messageOf(error));
        if (backups.length > 0) {
            try {
                await restoreManaged(shell, journal, backups);
            } catch (rollbackError: unknown) {
                journal.error(ROLLBACK_FAILED + messageOf(rollbackError));
            }
        }
        const span = { finishedAt: Date.now(), startedAt };
        await reportPushFailure(journal, secrets.nginxWebhook, span, localBackup, messageOf(error));
        return 1;
    }
};

const run = async function run(): Promise<number> {
    const secrets = loadSecrets();
    const session: Session = { journal: createJournal(), secrets, shell: createShell(secrets) };
    const command = process.argv[ARGUMENT_OFFSET] ?? PUSH_COMMANDS[0] ?? "";
    try {
        if (PULL_COMMANDS.includes(command)) {
            return await pull(session, false);
        }
        if (PULL_FULL_COMMANDS.includes(command)) {
            return await pull(session, true);
        }
        if (PUSH_COMMANDS.includes(command)) {
            return await push(session);
        }
        session.journal.error(USAGE);
        return 1;
    } finally {
        session.shell.dispose();
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
