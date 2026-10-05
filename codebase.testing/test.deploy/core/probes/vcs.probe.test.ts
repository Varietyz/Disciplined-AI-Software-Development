import {
    BRANCH_LABEL,
    DIRTY_VALUE,
    NO_VCS,
    REASON_SEPARATOR,
} from "@banes-lab/deploy/configuration/strings/notification.strings.ts";
import { describe, expect, it, vi } from "vitest";
import { describeCheckout } from "@banes-lab/deploy/core/probes/vcs.probe.ts";

const child = vi.hoisted(() => ({ execFileSync: vi.fn<(binary: string, args: readonly string[]) => Buffer>() }));

vi.mock("node:child_process", async (importOriginal) => ({
    ...(await importOriginal<Record<string, unknown>>()),
    ...child,
}));

const answer = function answer(replies: Record<string, string>): void {
    child.execFileSync.mockImplementation((_binary, args) => {
        const key = args.join(" ");
        const reply = replies[key];
        if (reply === undefined) {
            throw new Error(key);
        }
        return Buffer.from(reply);
    });
};

describe("describeCheckout", () => {
    it("reports no checkout with the reason when the branch cannot be resolved", () => {
        answer({});
        expect(describeCheckout()).toBe(`${NO_VCS + REASON_SEPARATOR}rev-parse --abbrev-ref HEAD`);
    });

    it("throws when a checkout answers the branch and then fails a later query", () => {
        answer({ "rev-parse --abbrev-ref HEAD": "main" });
        expect(() => describeCheckout()).toThrow("rev-parse --short HEAD");
    });

    it("reports the branch and marks a dirty tree", () => {
        answer({
            "log -1 --pretty=%an": "someone",
            "log -1 --pretty=%s": "message",
            "rev-parse --abbrev-ref HEAD": "main",
            "rev-parse --short HEAD": "abc123",
            "status --porcelain": " M file",
        });
        const report = describeCheckout();
        expect(report).toContain(BRANCH_LABEL);
        expect(report).toContain("main");
        expect(report).toContain(DIRTY_VALUE);
    });
});
