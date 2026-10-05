import {
    AUTHOR_LABEL,
    BRANCH_LABEL,
    COMMIT_LABEL,
    DIRTY_VALUE,
    MESSAGE_LABEL,
    NO_VCS,
    REASON_SEPARATOR,
    STATUS_LABEL,
} from "#configuration/strings/notification.strings";
import { COMMIT_MESSAGE_LIMIT, ELLIPSIS } from "#configuration/constants/deployment.constants";
import { bullet, code, lines } from "#core/converters/markdown.converter";
import { ROOT } from "@ssot/paths";
import { execFileSync } from "node:child_process";
import { messageOf } from "#core/converters/failure.converter";
import { truncate } from "#core/converters/text.converter";

const VCS_BINARY = "git";

const query = function query(args: readonly string[]): string {
    return execFileSync(VCS_BINARY, [...args], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] })
        .toString()
        .trim();
};

const branchOf = function branchOf(): { branch: string } | { reason: string } {
    try {
        return { branch: query(["rev-parse", "--abbrev-ref", "HEAD"]) };
    } catch (error) {
        return { reason: messageOf(error) };
    }
};

export const describeCheckout = function describeCheckout(): string {
    const head = branchOf();
    if ("reason" in head) {
        return NO_VCS + REASON_SEPARATOR + head.reason;
    }
    const entries = [
        bullet(BRANCH_LABEL, code(head.branch)),
        bullet(COMMIT_LABEL, code(query(["rev-parse", "--short", "HEAD"]))),
        bullet(MESSAGE_LABEL, truncate(query(["log", "-1", "--pretty=%s"]), COMMIT_MESSAGE_LIMIT, ELLIPSIS)),
        bullet(AUTHOR_LABEL, query(["log", "-1", "--pretty=%an"])),
    ];
    if (query(["status", "--porcelain"]).length > 0) {
        entries.push(bullet(STATUS_LABEL, DIRTY_VALUE));
    }
    return lines(entries);
};
