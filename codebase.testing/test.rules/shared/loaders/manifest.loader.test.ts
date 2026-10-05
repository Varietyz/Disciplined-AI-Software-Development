import {
    WORKSPACE_POSIX,
    isManifestRecord,
    jsonRecordAt,
    manifestAt,
    memberDirs,
    memberRels,
} from "@ssot/govlab/shared/loaders/manifest.loader.ts";
import { absolutePath, relativePath } from "@ssot/paths";
import { describe, expect, it } from "vitest";
import { notJsonObject, notValidJson } from "@ssot/govlab/shared/strings/manifest.strings.ts";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("manifestAt, memberRels and memberDirs", () => {
    it("reads a member manifest and expands the workspace globs to every member that has one", () => {
        const members = memberDirs();
        const build = absolutePath("app.build").split("\\").join("/");
        expect(members).toContain(build);
        expect(members.every((dir) => dir.startsWith(`${WORKSPACE_POSIX}/`))).toBe(true);
        expect(memberRels()).toContain(relativePath("app.build"));
        expect(manifestAt(build)["name"]).toBe("@banes-lab/build-scripts");
    });
});

describe("jsonRecordAt", () => {
    it("refuses a file that does not parse and one that holds no object", () => {
        const folder = mkdtempSync(join(tmpdir(), "govlab-manifest-"));
        const broken = join(folder, "broken.manifest");
        const listed = join(folder, "listed.manifest");
        writeVerbatim(broken, "{");
        writeVerbatim(listed, "[]");
        expect(() => jsonRecordAt(broken)).toThrow(notValidJson(broken));
        expect(() => jsonRecordAt(listed)).toThrow(notJsonObject(listed));
    });
});

describe("isManifestRecord", () => {
    it("accepts an object and refuses anything else", () => {
        expect(isManifestRecord({})).toBe(true);
        expect(isManifestRecord(null)).toBe(false);
        expect(isManifestRecord([])).toBe(false);
        expect(isManifestRecord("x")).toBe(false);
    });
});
