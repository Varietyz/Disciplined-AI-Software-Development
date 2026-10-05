import { describe, expect, it } from "vitest";
import { unreadCount, unsignedSections } from "@banes-lab/content/core/validators/writing.validator.ts";
import type { PageSection } from "@banes-lab/content/types/writing.types.ts";

const SECTIONS: PageSection[] = [
    { fingerprint: "new", key: "faq#origin", links: [], page: "faq" },
    { fingerprint: "same", key: "faq#practice", links: [], page: "faq" },
    { fingerprint: "none", key: "faq", links: [], page: "faq" },
    { fingerprint: "any", key: "home", links: [], page: "home" },
];

const SIGNOFFS = [
    { fingerprint: "old", key: "faq#origin", signed: "2026-09-24" },
    { fingerprint: "same", key: "faq#practice", signed: "2026-09-24" },
];

describe("unsignedSections", () => {
    it("passes a section whose sign-off matches its current text", () => {
        const findings = unsignedSections(["faq"], SIGNOFFS, SECTIONS);
        expect(findings.map((finding) => finding.file)).not.toContain("faq#practice");
    });

    it("fails a signed section whose text changed, and says it changed", () => {
        const findings = unsignedSections(["faq"], SIGNOFFS, SECTIONS);
        const changed = findings.find((finding) => finding.file === "faq#origin");
        expect(changed?.message).toContain("changed since it was signed off");
        expect(changed?.message).toContain("new");
    });

    it("fails a section in scope that was never signed off, and prints the fingerprint to sign", () => {
        const findings = unsignedSections(["faq"], SIGNOFFS, SECTIONS);
        const missing = findings.find((finding) => finding.file === "faq");
        expect(missing?.message).toContain("not signed off yet");
        expect(missing?.message).toContain("none");
    });

    it("never fails a section outside the scope", () => {
        expect(unsignedSections([], SIGNOFFS, SECTIONS)).toStrictEqual([]);
    });
});

describe("unreadCount", () => {
    it("counts the sections outside the scope as unread, not as passed", () => {
        expect(unreadCount(["faq"], SECTIONS)).toBe(1);
        expect(unreadCount([], SECTIONS)).toBe(4);
    });
});
