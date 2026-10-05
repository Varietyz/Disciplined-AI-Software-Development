import assert from "node:assert/strict";
import { test } from "vitest";
import { valuesOf } from "@govlab/context/core/selectors/vocabulary.selector.ts";

test("valuesOf lists each entry's value in order", () => {
    assert.deepEqual(
        valuesOf([
            { definition: "d", value: "low" },
            { definition: "d", value: "high" },
        ]),
        ["low", "high"],
    );
});
