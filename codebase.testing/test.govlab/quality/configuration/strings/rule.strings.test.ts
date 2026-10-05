import { SECRET_LABELS, notARule } from "@govlab/quality/configuration/strings/rule.strings.ts";
import { expect, test } from "vitest";

test("SECRET_LABELS names each kind of secret the secret check reports", () => {
    expect(Object.values(SECRET_LABELS).every((label) => label.length > 0)).toBe(true);
    expect(SECRET_LABELS.privateKey).toBe("Private key");
});

test("notARule names the file and the shape it failed to export", () => {
    const message = notARule("a.eslint.rule.ts", "default eslint rule module");
    expect(message).toContain("a.eslint.rule.ts");
    expect(message).toContain("default eslint rule module");
});
