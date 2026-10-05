import { expect, test } from "vitest";
import { RuleTester } from "eslint";
import requireWindowPostMessageTargetOrigin from "@govlab/quality/core/quality/eslint/require-window-post-message-target-origin.eslint.rule.ts";

const runCases = function runCases(
    name: string,
    ruleModule: Parameters<RuleTester["run"]>[1],
    cases: Parameters<RuleTester["run"]>[2],
): number {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 2025, sourceType: "module" } });
    tester.run(name, ruleModule, cases);
    return cases.valid.length + cases.invalid.length;
};

test("require-window-post-message-target-origin flags origin-agnostic cross-window posts and ignores same-realm channels", () => {
    expect(
        runCases("require-window-post-message-target-origin", requireWindowPostMessageTargetOrigin, {
            invalid: [
                { code: "window.postMessage(payload);", errors: [{ messageId: "missingTargetOrigin" }] },
                { code: "parent.postMessage(payload);", errors: [{ messageId: "missingTargetOrigin" }] },
                { code: "top.postMessage(payload);", errors: [{ messageId: "missingTargetOrigin" }] },
                { code: "opener.postMessage(payload);", errors: [{ messageId: "missingTargetOrigin" }] },
                { code: "globalThis.postMessage(payload);", errors: [{ messageId: "missingTargetOrigin" }] },
                { code: "iframe.contentWindow.postMessage(payload);", errors: [{ messageId: "missingTargetOrigin" }] },
                { code: "frames[0].postMessage(payload);", errors: [{ messageId: "missingTargetOrigin" }] },
                { code: 'window.postMessage(payload, "*");', errors: [{ messageId: "wildcardTargetOrigin" }] },
            ],
            valid: [
                { code: 'window.postMessage(payload, "https://app.example.com");' },
                { code: "node.port.postMessage(payload);" },
                { code: "port.postMessage(payload);" },
                { code: "worker.postMessage(payload);" },
                { code: "channel.postMessage(payload);" },
                { code: "messagePort.postMessage(payload, transferList);" },
                { code: "socket.emit(payload);" },
            ],
        }),
    ).toBeGreaterThan(0);
});
