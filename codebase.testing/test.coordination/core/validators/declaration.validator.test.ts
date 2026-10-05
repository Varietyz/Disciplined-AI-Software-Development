import { axisConsumers, silentOnItsOwnAxis } from "coordination-surface/tools/core/validators/declaration.validator.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";

const SOURCE = [
    "const isFrozen = function isFrozen(path) {",
    "    const held = lifetimeOf(path);",
    "    return held.retention === 'kept';",
    "};",
    "const isRemovable = function isRemovable(path) {",
    "    return lifetimeOf(path).removal !== 'none';",
    "};",
    "const describeFrozen = function describeFrozen(text) {",
    "    return text.length;",
    "};",
    'const label = "function isFrozen(x)";',
].join("\n");

describe("axisConsumers and silentOnItsOwnAxis", () => {
    it("find each predicate named for an axis that reaches the lifetime, and whether it reads that axis", () => {
        const consumers = axisConsumers(SOURCE, ["lifetimeOf"]);
        assert.deepEqual(consumers, [
            { asserted: "mutability", line: 1, name: "isFrozen", read: ["retention"] },
            { asserted: "removal", line: 5, name: "isRemovable", read: ["removal"] },
        ]);
        assert.deepEqual(consumers.map(silentOnItsOwnAxis), [true, false]);
    });
});
