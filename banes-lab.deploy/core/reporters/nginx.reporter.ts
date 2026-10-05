import {
    BACKUP_FIELD,
    ERROR_FIELD,
    LOCAL_FILE_FIELD,
    MONITORING_FIELD,
    NGINX_ATTACHMENT,
    OPERATION_FIELD,
    PREVIEW_FIELD,
    PULL_FAILURE_TITLE,
    PULL_SUCCESS_TITLE,
    PUSH_FAILURE_TITLE,
    PUSH_SUCCESS_TITLE,
    RELOADED_VALUE,
    RELOAD_FIELD,
    ROLLBACK_ATTEMPTED,
    ROLLBACK_FIELD,
    SITE_FIELD,
    SOURCE_FIELD,
    SYSTEM_FIELD,
    TEST_PASSED_VALUE,
    VALIDATION_FIELD,
} from "#configuration/strings/notification.strings";
import { ELLIPSIS, MONITORING } from "#configuration/constants/deployment.constants";
import { ERROR_COLOR, INFO_COLOR, NGINX_COLOR, UPDATES_ROLE } from "#configuration/constants/discord.constants";
import type { Journal, Span } from "#types/deployment.types";
import { NGINX_FOLDER, PREVIEW_LENGTH } from "#configuration/constants/nginx.constants";
import { code, fencedBlock, link } from "#core/converters/markdown.converter";
import { embed, field, notify, timing } from "#core/reporters/notification.reporter";
import type { EmbedField } from "#types/discord.types";
import { NOT_AVAILABLE } from "#configuration/strings/deployment.strings";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";
import { basename } from "node:path";
import { describeSystem } from "#core/probes/system.probe";
import { readFileSync } from "node:fs";
import { truncate } from "#core/converters/text.converter";

const PULL = "pull";
const PUSH = "push";

const tail = function tail(): EmbedField {
    return field(SYSTEM_FIELD, describeSystem());
};

const backupField = function backupField(backup: string): EmbedField {
    return field(BACKUP_FIELD, backup.length > 0 ? code(basename(backup)) : NOT_AVAILABLE, true);
};

export const reportPull = async function reportPull(
    journal: Journal,
    url: string,
    span: Span,
    local: string,
): Promise<boolean> {
    const fields = [
        field(OPERATION_FIELD, code(PULL), true),
        ...timing(span, true),
        field(LOCAL_FILE_FIELD, code(basename(local)), true),
        field(SOURCE_FIELD, code(SITE_URL), true),
        tail(),
    ];
    return notify(journal, url, UPDATES_ROLE, embed(PULL_SUCCESS_TITLE, INFO_COLOR, fields));
};

export const reportPullFailure = async function reportPullFailure(
    journal: Journal,
    url: string,
    span: Span,
    failure: string,
): Promise<boolean> {
    const fields = [
        field(ERROR_FIELD, fencedBlock("", failure)),
        field(OPERATION_FIELD, code(PULL), true),
        ...timing(span, false),
        tail(),
    ];
    return notify(journal, url, UPDATES_ROLE, embed(PULL_FAILURE_TITLE, ERROR_COLOR, fields));
};

export const reportPush = async function reportPush(
    journal: Journal,
    url: string,
    span: Span,
    backup: string,
    config: string,
): Promise<boolean> {
    const content = readFileSync(config, "utf8");
    const [security] = MONITORING;
    const preview = truncate(content, PREVIEW_LENGTH, ELLIPSIS);
    const fields = [
        field(OPERATION_FIELD, code(PUSH), true),
        ...timing(span, true),
        backupField(backup),
        field(VALIDATION_FIELD, code(TEST_PASSED_VALUE), true),
        field(RELOAD_FIELD, code(RELOADED_VALUE), true),
        field(SITE_FIELD, link(SITE_URL, SITE_URL), true),
        field(MONITORING_FIELD, security === undefined ? NOT_AVAILABLE : link(security[0], security[1])),
        field(PREVIEW_FIELD, fencedBlock(NGINX_FOLDER, preview)),
        tail(),
    ];
    const message = embed(PUSH_SUCCESS_TITLE, NGINX_COLOR, fields);
    return notify(journal, url, UPDATES_ROLE, message, { content, name: NGINX_ATTACHMENT });
};

export const reportPushFailure = async function reportPushFailure(
    journal: Journal,
    url: string,
    span: Span,
    backup: string,
    failure: string,
): Promise<boolean> {
    const fields = [
        field(ERROR_FIELD, fencedBlock("", failure)),
        field(OPERATION_FIELD, code(PUSH), true),
        ...timing(span, false),
        backupField(backup),
        field(ROLLBACK_FIELD, backup.length > 0 ? ROLLBACK_ATTEMPTED : NOT_AVAILABLE, true),
        tail(),
    ];
    return notify(journal, url, UPDATES_ROLE, embed(PUSH_FAILURE_TITLE, ERROR_COLOR, fields));
};
