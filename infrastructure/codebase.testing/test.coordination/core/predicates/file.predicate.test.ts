import { describe, it } from "vitest";
import {
    hasErrorCode,
    isFilesystemRefusal,
    isUnreadableJson,
} from "coordination-surface/tools/core/predicates/file.predicate.ts";
import assert from "node:assert/strict";

const coded = function coded(code: unknown): Error {
    return Object.assign(new Error("probe"), { code });
};

describe("hasErrorCode", () => {
    it("answers true only for an error whose string code is in the set", () => {
        const codes = new Set(["ENOENT"]);
        assert.equal(hasErrorCode(coded("ENOENT"), codes), true);
        assert.equal(hasErrorCode(coded("EPERM"), codes), false);
        assert.equal(hasErrorCode(coded(2), codes), false);
        assert.equal(hasErrorCode(new Error("no code"), codes), false);
        assert.equal(hasErrorCode({ code: "ENOENT" }, codes), false);
    });
});

describe("isFilesystemRefusal and isUnreadableJson", () => {
    it("accepts a filesystem refusal and, for JSON, a parse failure, and rejects any other error", () => {
        assert.equal(isFilesystemRefusal(coded("ENOENT")), true);
        assert.equal(isFilesystemRefusal(new TypeError("bug")), false);
        assert.equal(isUnreadableJson(new SyntaxError("bad json")), true);
        assert.equal(isUnreadableJson(coded("EACCES")), true);
        assert.equal(isUnreadableJson(new TypeError("bug")), false);
    });
});
