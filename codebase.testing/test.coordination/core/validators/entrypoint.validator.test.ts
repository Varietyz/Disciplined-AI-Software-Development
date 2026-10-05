import { describe, it } from "vitest";
import {
    unknownArguments,
    unshareableOperations,
    unsuppliedOperands,
    unwitnessedWrites,
    writesNothing,
} from "coordination-surface/tools/core/validators/entrypoint.validator.ts";
import assert from "node:assert/strict";

const POST = "--post";
const REHEARSE = "--rehearse";
const COMPRESS = "--compress";

describe("the argument checks", () => {
    it("name a requested operation without its operand, a rehearsal, an unknown flag and an exclusive form combined", () => {
        assert.deepEqual(
            unsuppliedOperands([
                { operation: POST, refusal: "post needs a body", requested: true, supplied: false },
                { operation: "--mark", refusal: "mark needs an item", requested: true, supplied: true },
                { operation: "--field", refusal: "unused", requested: false, supplied: false },
            ]),
            ["post needs a body"],
        );
        assert.equal(writesNothing([REHEARSE, POST], REHEARSE, ["--index"]), true);
        assert.equal(writesNothing([REHEARSE, "--index"], REHEARSE, ["--index"]), false);
        assert.equal(writesNothing([POST], REHEARSE, []), false);
        assert.deepEqual(unknownArguments([POST, "--color=red", "--color", "--", "x"], [POST]), ["--color"]);
        assert.deepEqual(unshareableOperations([COMPRESS, POST], [COMPRESS]), [COMPRESS]);
        assert.deepEqual(unshareableOperations([COMPRESS], [COMPRESS]), []);
    });
});

describe("unwitnessedWrites", () => {
    it("reports a write derived from an earlier read with no re-read compared before it", () => {
        const unwitnessed = [
            "const before = readFileSync(board, 'utf8');",
            "writeFileSync(board, changed(before));",
        ].join("\n");
        assert.deepEqual(unwitnessedWrites(unwitnessed), [{ line: 2, reads: 1, target: "board", witnessed: false }]);
        const witnessed = [
            "const before = readFileSync(board, 'utf8');",
            "const witness = readFileSync(board, 'utf8');",
            "if (witness !== before) { return; }",
            "writeFileSync(board, changed(before));",
        ].join("\n");
        assert.deepEqual(unwitnessedWrites(witnessed), []);
        assert.deepEqual(unwitnessedWrites("writeFileSync(fresh, text);\nconst s = 'readFileSync(fresh)';"), []);
    });
});
