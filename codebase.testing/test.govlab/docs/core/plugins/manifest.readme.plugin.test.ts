import { describe, expect, it } from "vitest";
import { plugin } from "@govlab/docs/core/plugins/manifest.readme.plugin.ts";
import { validateManifest } from "@govlab/docs/core/validators/manifest.validator.ts";

const BASE = { label: "X", maturity: "experimental", summary: "does x", visibility: { hidden: false, private: false } };
const COMPLETE = {
    aiContext: ["invariant: X holds"],
    configuration: [{ default: "x", note: "tunes it", option: "opt" }],
    disposal: ["remove it"],
    overview: "Does a thing well.",
    quickStart: [{ code: "doThing()", intent: "use it" }],
    whenNotToUse: ["not B"],
    whenToUse: ["when A"],
};

const errorsOf = function errorsOf(docs?: Record<string, unknown>): string[] {
    return validateManifest(docs === undefined ? BASE : { ...BASE, docs }, [plugin]);
};

describe("the readme manifest plugin", () => {
    it("accepts no docs block and a complete one", () => {
        expect(errorsOf()).toStrictEqual([]);
        expect(errorsOf(COMPLETE)).toStrictEqual([]);
    });

    it("reports a missing field and a field of the wrong shape", () => {
        const partial = Object.fromEntries(Object.entries(COMPLETE).filter(([key]) => key !== "whenToUse"));
        expect(errorsOf(partial).some((error) => error.includes("missing required field 'whenToUse'"))).toBe(true);
        expect(errorsOf({ ...COMPLETE, whenToUse: "an array" }).some((error) => error.includes("docs.whenToUse"))).toBe(
            true,
        );
    });

    it("accepts a renderable custom field and rejects one that is not renderable", () => {
        expect(errorsOf({ ...COMPLETE, benchmarks: ["10k ops/s"], caveats: "single-threaded" })).toStrictEqual([]);
        expect(
            errorsOf({ ...COMPLETE, weird: { nested: { too: "deep" } } }).some((error) =>
                error.includes("custom docs field 'weird'"),
            ),
        ).toBe(true);
    });

    it("validates the optional install, api and apiNotes fields by shape", () => {
        expect(errorsOf({ ...COMPLETE, install: "" })).toStrictEqual([]);
        expect(errorsOf({ ...COMPLETE, install: "npm i @scope/pkg" })).toStrictEqual([]);
        expect(errorsOf({ ...COMPLETE, install: 5 }).some((error) => error.includes("docs.install"))).toBe(true);
        expect(
            errorsOf({ ...COMPLETE, api: "See the barrel.", apiNotes: [{ name: "createX", note: "the factory" }] }),
        ).toStrictEqual([]);
        expect(
            errorsOf({ ...COMPLETE, apiNotes: [{ name: "createX" }] }).some((error) => error.includes("docs.apiNotes")),
        ).toBe(true);
    });

    it("marks a documented module on its catalog entry", () => {
        const entry = { category: null, value: "x" };
        plugin.contribute?.({ docs: COMPLETE }, entry);
        expect(entry).toHaveProperty("documented", true);
    });
});
