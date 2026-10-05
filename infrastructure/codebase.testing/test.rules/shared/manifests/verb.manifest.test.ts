import {
    LOOKUP_VERBS,
    REGISTER_VERBS,
    isVerbOrOpensWith,
    opensWith,
    suffixAfterVerb,
} from "@ssot/govlab/shared/manifests/verb.manifest.ts";
import { describe, expect, it } from "vitest";

describe("opensWith", () => {
    it("matches a verb only at a camel-case boundary", () => {
        expect(opensWith("getWidget", LOOKUP_VERBS)).toBe(true);
        expect(opensWith("resolveSession", LOOKUP_VERBS)).toBe(true);
    });

    it("refuses a name that merely begins with the verb's letters", () => {
        expect(opensWith("getter", LOOKUP_VERBS)).toBe(false);
        expect(opensWith("hash", LOOKUP_VERBS)).toBe(false);
        expect(opensWith("loader", LOOKUP_VERBS)).toBe(false);
    });

    it("refuses the bare verb, since a boundary requires a following upper-case letter", () => {
        expect(opensWith("get", LOOKUP_VERBS)).toBe(false);
    });

    it("refuses a name that does not open with any declared verb", () => {
        expect(opensWith("buildWidget", LOOKUP_VERBS)).toBe(false);
    });
});

describe("isVerbOrOpensWith", () => {
    it("accepts the bare verb as well as the prefixed form", () => {
        expect(isVerbOrOpensWith("register", REGISTER_VERBS)).toBe(true);
        expect(isVerbOrOpensWith("registerTicker", REGISTER_VERBS)).toBe(true);
        expect(isVerbOrOpensWith("registry", REGISTER_VERBS)).toBe(false);
    });
});

describe("suffixAfterVerb", () => {
    it("returns the remainder after a boundary match", () => {
        expect(suffixAfterVerb("registerTicker", "register")).toBe("Ticker");
    });

    it("returns null when the name does not match at a boundary", () => {
        expect(suffixAfterVerb("registry", "register")).toBeNull();
        expect(suffixAfterVerb("register", "register")).toBeNull();
    });
});

describe("the declared verb sets", () => {
    it("holds the lookup and registration vocabularies the rules derive from", () => {
        expect(LOOKUP_VERBS).toContain("get");
        expect(LOOKUP_VERBS).toContain("subscribe");
        expect(REGISTER_VERBS).toStrictEqual(["register", "unregister"]);
    });
});
