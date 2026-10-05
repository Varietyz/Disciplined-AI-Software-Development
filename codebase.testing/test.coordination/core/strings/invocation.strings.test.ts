import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { waitHelp } from "coordination-surface/tools/core/strings/invocation.strings.ts";

describe("waitHelp", () => {
    it("opens with the wait command the host declares", () => {
        assert.ok(waitHelp("npm run await").startsWith("npm run await -- --agent <LETTER> [flags]"));
    });
});
