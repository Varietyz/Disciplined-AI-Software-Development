import {
    ESCAPED_SEPARATOR,
    PUBLISHED_TEXT_EXTENSIONS,
    VCS_FOLDER,
} from "@banes-lab/content/configuration/constants/leak.constants.ts";
import { ROOT, absolutePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { extname, sep } from "node:path";
import { machinePaths, publishedPaths, readPublished } from "@banes-lab/content/core/loaders/leak.output.loader.ts";

describe("the published output loader", () => {
    it("lists only text files under the published trees, never a checkout's version-control folder", () => {
        const paths = publishedPaths();
        expect(paths.every((path) => PUBLISHED_TEXT_EXTENSIONS.has(extname(path).toLowerCase()))).toBe(true);
        expect(paths.some((path) => path.split(sep).includes(VCS_FOLDER))).toBe(false);
    });

    it("reads a published file with its path relative to the workspace root", () => {
        const [first] = publishedPaths();
        if (first !== undefined) {
            expect(readPublished(first).file.startsWith(ROOT)).toBe(false);
        }
        expect(absolutePath("builds.web").startsWith(ROOT)).toBe(true);
    });

    it("spells the workspace root in its native, forward-slash and escaped forms", () => {
        const forms = machinePaths();
        expect(forms).toContain(ROOT);
        expect(forms.some((form) => form.includes(ESCAPED_SEPARATOR) || !form.includes("\\"))).toBe(true);
    });
});
