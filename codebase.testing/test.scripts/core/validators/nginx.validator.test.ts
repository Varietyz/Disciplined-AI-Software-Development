import {
    COMMENT_REMEDY,
    ENGINE_MISSING,
    commentsHeading,
    commentsHeld,
    engineHeading,
    engineHeld,
    otherEngine,
} from "@project/scripts/configuration/strings/nginx.strings.ts";
import { commentVerdict, engineVerdict } from "@project/scripts/core/validators/nginx.validator.ts";
import { describe, expect, it } from "vitest";
import { serverConfigFiles } from "@project/scripts/core/loaders/nginx.loader.ts";

const CLEAN = { path: "site", text: 'add_header X-A "a#b";\njs_import q from query.js;\njs_engine qjs;\n' };

describe("commentVerdict", () => {
    it("passes a hash inside quotes, and names each line that opens a comment", () => {
        expect(commentVerdict([CLEAN])).toStrictEqual({ held: true, text: commentsHeld(1) });
        const verdict = commentVerdict([{ path: "site", text: "listen 443;\n# a note\nroot /x; # trailing\n" }]);
        expect(verdict.held).toBe(false);
        expect(verdict.text).toContain(commentsHeading(2));
        expect(verdict.text).toContain("  site:2");
        expect(verdict.text).toContain("  site:3");
        expect(verdict.text).toContain(COMMENT_REMEDY);
    });
});

describe("engineVerdict", () => {
    it("requires the declared engine beside every njs import", () => {
        expect(engineVerdict([CLEAN])).toStrictEqual({ held: true, text: engineHeld(1) });
        const missing = engineVerdict([{ path: "a", text: "js_import q from query.js;\n" }]);
        expect(missing.text).toContain(engineHeading(1));
        expect(missing.text).toContain(`  a ${ENGINE_MISSING}`);
        const other = engineVerdict([{ path: "b", text: "js_import q from query.js;\njs_engine njs;\n" }]);
        expect(other.text).toContain(`  b ${otherEngine("njs")}`);
    });
});

describe("serverConfigFiles", () => {
    it("reads the server member's configuration files with their workspace paths", () => {
        const files = serverConfigFiles();
        expect(files.length).toBeGreaterThan(0);
        expect(files.every((file) => !file.path.includes("\\") && file.text.length > 0)).toBe(true);
    });
});
