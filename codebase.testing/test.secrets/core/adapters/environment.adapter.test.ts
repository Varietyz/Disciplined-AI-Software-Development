import { answerMalformed, vaultRefused } from "@ssot/secrets/configuration/strings/environment.strings.ts";
import { describe, expect, it, vi } from "vitest";
import { fieldLabels, revealField } from "@ssot/secrets/core/adapters/environment.adapter.ts";
import { execFileSync } from "node:child_process";

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));

const ENTRY = "banes-lab.com/Runtime";

const answering = function answering(answer: unknown): void {
    vi.mocked(execFileSync).mockReturnValueOnce(JSON.stringify(answer));
};

describe("fieldLabels", () => {
    it("lists the labels of the entry's fields without revealing a value", () => {
        answering({ answer: "entry", entry: { fields: [{ label: "SITE_DEV_PORT", value: null }] } });
        expect([...fieldLabels(ENTRY)]).toStrictEqual(["SITE_DEV_PORT"]);
        expect(vi.mocked(execFileSync).mock.lastCall?.[1]).toStrictEqual(["entry", "show", ENTRY, "--json"]);
    });

    it("refuses an answer that is not an entry", () => {
        answering({ answer: "done" });
        expect(() => fieldLabels(ENTRY)).toThrow(answerMalformed(ENTRY));
    });
});

describe("revealField", () => {
    it("returns the revealed value of one field", () => {
        answering({ answer: "value", value: "4202" });
        expect(revealField(ENTRY, "SITE_DEV_PORT")).toBe("4202");
        expect(vi.mocked(execFileSync).mock.lastCall?.[1]).toStrictEqual([
            "field",
            "reveal",
            ENTRY,
            "SITE_DEV_PORT",
            "--json",
        ]);
    });

    it("names the vault's own reason when it refuses, such as a locked vault", () => {
        vi.mocked(execFileSync).mockImplementationOnce(() => {
            throw Object.assign(new Error("exit 1"), { stderr: "the vault is locked" });
        });
        expect(() => revealField(ENTRY, "SITE_DEV_PORT")).toThrow(vaultRefused(ENTRY, "the vault is locked"));
    });
});
