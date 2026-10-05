import {
    BACKUP_FIELD,
    DEPLOY_FAILURE_TITLE,
    DEPLOY_SUCCESS_TITLE,
    FILES_LABEL,
    MONITORING_FIELD,
    SITE_FIELD,
    SIZE_LABEL,
    STEPS_FIELD,
    SUMMARY_FIELD,
    SYSTEM_FIELD,
    VCS_FIELD,
} from "#configuration/strings/notification.strings";
import { ERROR_COLOR, SUCCESS_COLOR, UPDATES_ROLE } from "#configuration/constants/discord.constants";
import type { Journal, Outcome, UploadStats } from "#types/deployment.types";
import {
    NOT_AVAILABLE,
    NO_STATS,
    UPLOADED_SUFFIX,
    UPLOAD_FAILURES,
    UPLOAD_OF,
} from "#configuration/strings/deployment.strings";
import { bullet, code, fenced, lines, link } from "#core/converters/markdown.converter";
import { embed, failureAttachment, failureField, field, notify, timing } from "#core/reporters/notification.reporter";
import type { EmbedField } from "#types/discord.types";
import { MONITORING } from "#configuration/constants/deployment.constants";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";
import { describeCheckout } from "#core/probes/vcs.probe";
import { describeSystem } from "#core/probes/system.probe";
import { formatBytes } from "#core/converters/text.converter";

const summaryOf = function summaryOf(stats: UploadStats | null): string {
    if (stats === null) {
        return NO_STATS;
    }
    const files =
        String(stats.uploadedCount) +
        UPLOAD_OF +
        String(stats.totalFileCount) +
        UPLOADED_SUFFIX +
        String(stats.failedCount) +
        UPLOAD_FAILURES;
    const size = formatBytes(stats.totalBytes);
    return lines([bullet(FILES_LABEL, code(files)), bullet(SIZE_LABEL, code(size))]);
};

const sharedFields = function sharedFields(journal: Journal, outcome: Outcome): readonly EmbedField[] {
    return [
        field(BACKUP_FIELD, outcome.backup.length > 0 ? code(outcome.backup) : NOT_AVAILABLE, true),
        ...timing(outcome.span, outcome.failure.length === 0),
        field(SUMMARY_FIELD, summaryOf(outcome.stats)),
        field(STEPS_FIELD, fenced(journal.summary())),
        field(VCS_FIELD, describeCheckout()),
        field(SYSTEM_FIELD, describeSystem()),
    ];
};

const monitoringLinks = function monitoringLinks(): string {
    return lines(MONITORING.map(([label, url]) => link(label, url)));
};

export const reportDeployment = async function reportDeployment(
    journal: Journal,
    url: string,
    outcome: Outcome,
): Promise<boolean> {
    if (outcome.failure.length === 0) {
        const fields = [
            field(SITE_FIELD, link(SITE_URL, SITE_URL), true),
            ...sharedFields(journal, outcome),
            field(MONITORING_FIELD, monitoringLinks()),
        ];
        return notify(journal, url, "", embed(DEPLOY_SUCCESS_TITLE, SUCCESS_COLOR, fields));
    }
    const fields = [failureField(outcome.failure), ...sharedFields(journal, outcome)];
    return notify(
        journal,
        url,
        UPDATES_ROLE,
        embed(DEPLOY_FAILURE_TITLE, ERROR_COLOR, fields),
        failureAttachment(outcome.failure),
    );
};
