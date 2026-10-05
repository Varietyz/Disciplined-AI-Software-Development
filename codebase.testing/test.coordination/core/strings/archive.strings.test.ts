import { describe, it } from "vitest";
import {
    extendContended,
    historyContended,
    repairContended,
} from "coordination-surface/tools/core/strings/archive.strings.ts";
import assert from "node:assert/strict";

const HISTORY = "history.txt";

describe("the archive contention messages", () => {
    it("name the history that moved, and say which write was held back", () => {
        const messages = [historyContended(HISTORY), repairContended(HISTORY), extendContended(HISTORY)];
        assert.ok(messages.every((message) => message.includes(HISTORY)));
        assert.equal(new Set(messages).size, 3);
    });
});
