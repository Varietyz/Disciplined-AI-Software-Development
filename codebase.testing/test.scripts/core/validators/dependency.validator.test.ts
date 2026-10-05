import {
    EVERY_SCRIPT_DECIDED,
    HOIST_REMEDY,
    ONE_HOIST_HELD,
    REVIEW_REMEDY,
    hoistBreachHeading,
    listingFailed,
    missingAllowScripts,
    undecidedHeading,
} from "@project/scripts/configuration/strings/dependency.strings.ts";
import { describe, expect, it } from "vitest";
import { hoistVerdict, installScriptVerdict } from "@project/scripts/core/validators/dependency.validator.ts";
import { installScriptListing } from "@project/scripts/core/adapters/dependency.adapter.ts";

describe("installScriptVerdict", () => {
    it("holds when npm lists no pending script, and names each pending one by its changed keys", () => {
        expect(installScriptVerdict('{"allowScripts":[]}')).toStrictEqual({ held: true, text: EVERY_SCRIPT_DECIDED });
        const pending = JSON.stringify({ allowScripts: [{ changes: [{ key: "esbuild@0.25.0" }] }, { name: "x" }] });
        const verdict = installScriptVerdict(pending);
        expect(verdict.held).toBe(false);
        expect(verdict.text).toContain(undecidedHeading(2));
        expect(verdict.text).toContain("  esbuild@0.25.0");
        expect(verdict.text).toContain('  {"name":"x"}');
        expect(verdict.text).toContain(REVIEW_REMEDY);
    });

    it("refuses an answer with no allowScripts list", () => {
        expect(() => installScriptVerdict("{}")).toThrow(missingAllowScripts("{}"));
        expect(listingFailed(1, "boom")).toContain("exited 1: boom");
    });
});

describe("hoistVerdict", () => {
    it("holds with no breach, and lists each breach under a counted heading with its remedy", () => {
        expect(hoistVerdict([])).toStrictEqual({ held: true, text: ONE_HOIST_HELD });
        const verdict = hoistVerdict(["member/node_modules"]);
        expect(verdict.held).toBe(false);
        expect(verdict.text).toContain(hoistBreachHeading(1));
        expect(verdict.text).toContain("  member/node_modules");
        expect(verdict.text).toContain(HOIST_REMEDY);
    });
});

describe("installScriptListing", () => {
    it("answers with the json npm prints for the workspace", () => {
        expect(() => installScriptVerdict(installScriptListing())).not.toThrow();
    }, 60_000);
});
