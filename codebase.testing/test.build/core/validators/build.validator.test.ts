import { checkFile, isServedUrl } from "@banes-lab/build-scripts/core/validators/build.validator.ts";
import { describe, expect, it } from "vitest";
import type { Finding } from "@banes-lab/build-scripts/types/validation.types.ts";
import { MISSING_BUILD_FILE } from "@banes-lab/build-scripts/configuration/strings/validation.strings.ts";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";
import { readOrNull } from "@banes-lab/build-scripts/core/loaders/build.loader.ts";

const ROBOTS_FILE = "robots.txt";

describe("isServedUrl", () => {
    it("serves an address on the site whose file the build wrote, and refuses a foreign or missing one", () => {
        expect(isServedUrl(`https://example.test/${ROBOTS_FILE}`)).toBe(false);
        expect(isServedUrl(`${SITE_URL}/no/such/file.txt`)).toBe(false);
        expect(isServedUrl(`${SITE_URL}/${ROBOTS_FILE}`)).toBe(readOrNull(ROBOTS_FILE) !== null);
    });
});

describe("checkFile", () => {
    it("names a file the build did not write and hands a written one's text to its check", () => {
        const seen: string[] = [];
        const record = (text: string): Finding[] => {
            seen.push(text);
            return [];
        };
        expect(checkFile("no/such/file.txt", record)).toStrictEqual([
            { file: "no/such/file.txt", message: MISSING_BUILD_FILE },
        ]);
        expect(seen).toStrictEqual([]);
        const robots = readOrNull(ROBOTS_FILE);
        expect(checkFile(ROBOTS_FILE, record)).toStrictEqual(
            robots === null ? [{ file: ROBOTS_FILE, message: MISSING_BUILD_FILE }] : [],
        );
        expect(seen).toStrictEqual(robots === null ? [] : [robots]);
    });
});
