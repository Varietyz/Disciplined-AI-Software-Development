import { branchExercised, branchThrew } from "coordination-surface/tools/core/strings/gate.strings.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { judgeBranch } from "coordination-surface/tools/core/inspectors/gate.inspector.ts";

type Fixture = Parameters<typeof judgeBranch>[0];

const fixture = function fixture(expect: Fixture["expect"], exercise: Fixture["exercise"]): Fixture {
    return { branch: "seeded", exercise, expect, seed: [{ path: "a.txt", text: "x" }], subject: "probe" };
};

const seeded = (root: string): Fixture["expect"] => ({ present: existsSync(join(root, "a.txt")) });

describe("judgeBranch", () => {
    it("proves a branch whose effect matches, and reports one that disagrees or throws", () => {
        assert.deepEqual(judgeBranch(fixture({ present: true }, seeded)), {
            detail: branchExercised("present true"),
            rule: "probe · seeded",
            state: "proven",
        });
        const apart = judgeBranch(fixture({ present: false }, seeded));
        assert.equal(apart.state, "silent");
        assert.ok(apart.detail.includes("present true where false is declared"));
        const thrown = judgeBranch(
            fixture({}, () => {
                throw new Error("broke");
            }),
        );
        assert.deepEqual([thrown.state, thrown.detail], ["noisy", branchThrew("Error: broke")]);
    });
});
