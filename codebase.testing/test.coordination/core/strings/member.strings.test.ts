import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { memberContended } from "coordination-surface/tools/core/strings/member.strings.ts";

describe("memberContended", () => {
    it("names the member surface that moved between the read and the write", () => {
        assert.ok(memberContended("roles.md").startsWith("CONTENDED  roles.md changed"));
    });
});
