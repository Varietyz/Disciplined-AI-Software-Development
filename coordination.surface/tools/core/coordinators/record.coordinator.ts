import { FIELD_NEEDS_VALUE, kindRequired, operandsMissing } from "../strings/board.strings.ts";
import type { Invocation, Outcome } from "../types/invocation.types.ts";
import { argumentValue, finish, joinedValue, textOperand } from "../readers/invocation.reader.ts";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { historyPath, projectRoot, surfacePath, surfacePrefix } from "../../../config/surface.config.ts";
import { openVenueEcho, ownVenueEcho } from "../reporters/venue.reporter.ts";
import { ownClaimEcho, ownDischargeEcho } from "../reporters/claim.reporter.ts";
import { readSnapshot, writeFieldMark } from "../registries/snapshot.registry.ts";
import { runField, runItem } from "../runners/board.runner.ts";
import { runReadMark, runSignature } from "../runners/converge.runner.ts";
import { unreadEcho, unreadSince } from "../resolvers/snapshot.resolver.ts";
import { BLOCKING_SUFFIX } from "../constants/blocking.constants.ts";
import { ITEM_KINDS } from "../constants/board.constants.ts";
import { resolve } from "node:path";
import { unsuppliedOperands } from "../validators/entrypoint.validator.ts";

const REPO_ROOT = projectRoot();

const venueFiles = function venueFiles(root: string, excluding: string): string[] {
    if (!existsSync(root)) {
        return [];
    }

    return readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(BLOCKING_SUFFIX))
        .map((entry) => resolve(root, entry.name))
        .filter((venue) => venue !== excluding)
        .map((venue) => readFileSync(venue, "utf8"));
};

const siblingSurfaces = function siblingSurfaces(excluding: string): string[] {
    const board = resolve(REPO_ROOT, surfacePath("board"));
    const boards = board !== excluding && existsSync(board) ? [readFileSync(board, "utf8")] : [];

    return [
        ...boards,
        ...venueFiles(resolve(REPO_ROOT, surfacePrefix()), excluding),
        ...venueFiles(resolve(REPO_ROOT, surfacePath("venue_archive")), ""),
    ];
};

const postItem = function postItem({ absolute, caller, target }: Invocation, text: string, kind: string): void {
    const unread = existsSync(absolute)
        ? unreadSince(readFileSync(absolute, "utf8"), readSnapshot(REPO_ROOT, caller, target), caller)
        : null;

    const outcome = runItem({
        absolute,
        agent: caller,
        archive: resolve(REPO_ROOT, historyPath()),
        at: Date.now(),
        kind,
        repoRoot: REPO_ROOT,
        siblings: siblingSurfaces(absolute),
        target,
        text,
    });
    process.stdout.write(outcome.message);
    if (outcome.code !== 0) {
        process.exit(outcome.code);
    }

    const venueEcho = target.endsWith(BLOCKING_SUFFIX) ? ownVenueEcho(caller, absolute, target) : "";
    process.stdout.write(
        [
            unreadEcho(unread, target),
            ownClaimEcho(REPO_ROOT, caller),
            ownDischargeEcho(REPO_ROOT, caller),
            openVenueEcho(REPO_ROOT, caller, target),
            venueEcho,
        ].join(""),
    );
};

const writeOrExit = function writeOrExit(outcome: Outcome): void {
    process.stdout.write(outcome.message);
    if (outcome.code !== 0) {
        process.exit(outcome.code);
    }
};

export const postComposable = function postComposable(invocation: Invocation): string | null {
    const { absolute, caller, target } = invocation;
    const item = textOperand("--item", "--item-file");
    const kind = argumentValue("--kind");
    const field = argumentValue("--field");
    const value = joinedValue("--value");

    const unsupplied = unsuppliedOperands([
        {
            operation: "--item",
            refusal: kindRequired(ITEM_KINDS),
            requested: item !== null,
            supplied: kind !== null && ITEM_KINDS.includes(kind),
        },
        { operation: "--field", refusal: FIELD_NEEDS_VALUE, requested: field !== null, supplied: value !== null },
    ]);
    if (unsupplied.length > 0) {
        finish(operandsMissing(unsupplied), 2);
    }

    if (item !== null && kind !== null) {
        postItem(invocation, item, kind);
    }

    if (field !== null && value !== null) {
        writeOrExit(runField({ absolute, agent: caller, field, target, text: value }));
        writeFieldMark(REPO_ROOT, caller, Date.now());
    }

    if (process.argv.includes("--read")) {
        writeOrExit(runReadMark({ absolute, agent: caller, target, text: "" }));
    }

    const signature = joinedValue("--sign");
    if (signature !== null) {
        writeOrExit(runSignature({ absolute, agent: caller, target, text: signature }));
    }

    return item;
};
