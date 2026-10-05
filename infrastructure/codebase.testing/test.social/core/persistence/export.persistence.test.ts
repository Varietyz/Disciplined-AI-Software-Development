import { EXPORT_RUNNING, SUBJECT_SEPARATOR } from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import { describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import {
    holdCaptureLock,
    publishShares,
    strayShares,
    unpublishedShares,
} from "@banes-lab/social-share/core/persistence/export.persistence.ts";
import type { ShareEntry } from "@banes-lab/social-share/types/image.types.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const lockIn = function lockIn(): string {
    const folder = mkdtempSync(join(tmpdir(), "social-lock-"));
    return join(folder, "capture.lock");
};

const DEAD_PID = 2_147_483_000;

describe("holdCaptureLock", () => {
    it("takes a free lock, lets its own process take it again, and frees it on release", () => {
        const location = lockIn();
        const release = holdCaptureLock(location);
        expect(readFileSync(location, "utf8")).toBe(String(process.pid));
        holdCaptureLock(location)();
        expect(existsSync(location)).toBe(true);
        release();
        expect(existsSync(location)).toBe(false);
    });

    it("refuses loudly while another live process holds it, naming that process", () => {
        const location = lockIn();
        writeVerbatim(location, String(process.ppid));
        expect(() => holdCaptureLock(location)).toThrow(EXPORT_RUNNING + SUBJECT_SEPARATOR + String(process.ppid));
    });

    it("takes over a lock left by a process that has died", () => {
        const location = lockIn();
        writeVerbatim(location, String(DEAD_PID));
        const release = holdCaptureLock(location);
        expect(readFileSync(location, "utf8")).toBe(String(process.pid));
        release();
    });
});

describe("the published shares", () => {
    const entries: ShareEntry[] = [{ alt: "Card", page: "home", source: "/shares/home.gif" }];

    it("copies each named share from the renders, drops a stray one, and names what is left unpublished", () => {
        const renders = mkdtempSync(join(tmpdir(), "social-renders-"));
        const staging = mkdtempSync(join(tmpdir(), "social-served-"));
        const served = join(staging, "shares");
        writeVerbatim(join(renders, "home.gif"), "gif");
        expect(unpublishedShares(entries, served)).toStrictEqual(["home.gif"]);
        expect(strayShares(entries, served)).toStrictEqual([]);
        expect(publishShares(entries, renders, served)).toStrictEqual(["home.gif"]);
        expect(publishShares(entries, renders, served)).toStrictEqual([]);
        writeVerbatim(join(served, "old.gif"), "gif");
        expect(strayShares(entries, served)).toStrictEqual(["old.gif"]);
        publishShares(entries, renders, served);
        expect(existsSync(join(served, "old.gif"))).toBe(false);
        expect(unpublishedShares(entries, served)).toStrictEqual([]);
    });
});
