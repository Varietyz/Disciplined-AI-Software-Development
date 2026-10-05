import { describe, it } from "vitest";
import {
    generatorFailed,
    generatorRunning,
    generatorsRan,
} from "coordination-surface/tools/core/strings/document.strings.ts";
import assert from "node:assert/strict";

const COMMAND = "npm run readme";

describe("the document generator messages", () => {
    it("name the generator command, its exit status and how many ran", () => {
        assert.equal(generatorRunning(COMMAND), `RUNNING  ${COMMAND}\n`);
        const failed = generatorFailed(COMMAND, 2);
        assert.ok(failed.includes(COMMAND) && failed.includes("exited with 2"));
        assert.ok(generatorsRan(3).includes("3 document generator(s)"));
    });
});
