import { describe, expect, it } from "vitest";
import { machinePathLine, privateTermLine } from "@banes-lab/content/configuration/strings/coverage.strings.ts";
import { validatePayload, validatePublished } from "@banes-lab/content/core/validators/leak.validator.ts";
import type { LeakSet } from "@banes-lab/content/types/leak.types.ts";

const LEAKS: LeakSet = { sources: [{ name: "fixture", tokens: 1 }], tokens: ["claims_are_lies"] };
const ROOTS = new Set(["engine.root"]);

const payload = function payload(strings: string[]): Parameters<typeof validatePayload>[0] {
    return { file: "json/page.json", label: "Page", page: "page", sections: [], strings, tabs: [], title: "Page" };
};

describe("validatePayload", () => {
    it("reports each leaking token once with the reason it leaked by", () => {
        const findings = validatePayload(payload(["`claims_are_lies`", "again `claims_are_lies`"]), LEAKS, ROOTS);
        expect(findings).toHaveLength(1);
        expect(findings[0]?.file).toBe("json/page.json");
        expect(findings[0]?.message).toContain("claims_are_lies");
    });

    it("passes a payload whose strings carry no internal token", () => {
        expect(validatePayload(payload(["Plain copy about the method."]), LEAKS, ROOTS)).toStrictEqual([]);
    });
});

const scan = function scan(text: string): { digest: string; line: number }[] {
    return text.includes("hidden") ? [{ digest: "a".repeat(64), line: 3 }] : [];
};

describe("validatePublished", () => {
    it("reports a private term and an absolute workspace path with their lines", () => {
        const text = "one\n/home/ws/member/file.ts\nhidden";
        const findings = validatePublished({ file: "web/page.html", text }, scan, ["/home/ws"]);
        expect(findings.map((finding) => finding.file)).toStrictEqual(["web/page.html", "web/page.html"]);
        expect(findings[0]?.message).toContain("line 3");
        expect(findings[1]?.message).toContain("line 2");
    });

    it("names the line in both finding messages, and a short digest for the private term", () => {
        expect(privateTermLine(3, "b".repeat(64))).toContain(`line 3, digest ${"b".repeat(12)}.`);
        expect(machinePathLine(2)).toContain("line 2.");
    });

    it("passes a published file that carries neither", () => {
        expect(validatePublished({ file: "web/page.html", text: "plain" }, scan, ["/home/ws"])).toStrictEqual([]);
    });
});
