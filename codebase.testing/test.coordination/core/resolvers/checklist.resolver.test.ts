import {
    agentBreaches,
    citedIds,
    closureBreaches,
    declaredId,
    idBreaches,
    isDigit,
} from "coordination-surface/tools/core/resolvers/checklist.resolver.ts";
import { describe, it } from "vitest";
import { TASK_MARKER } from "coordination-surface/tools/core/constants/checklist.constants.ts";
import assert from "node:assert/strict";

const task = function task(id: string, rest = ""): string {
    return `${TASK_MARKER} ${id} ${rest}`.trimEnd();
};

describe("isDigit, declaredId and citedIds", () => {
    it("read a three-part task id where a task opens, and every id cited in prose", () => {
        assert.equal(isDigit("7"), true);
        assert.equal(isDigit("x"), false);
        assert.equal(declaredId(task("1.2.3", "write it")), "1.2.3");
        assert.equal(declaredId(task("1.2", "two parts")), null);
        assert.equal(declaredId("prose 1.2.3"), null);
        assert.deepEqual(citedIds("after 1.2.3 and 4.5.6, not 7.8"), ["1.2.3", "4.5.6"]);
    });
});

describe("agentBreaches", () => {
    it("reports a verifier or owner naming a seat that is not active", () => {
        const lines = ["*verifier:* A", "*owner:* B", "*owner:* AB"];
        assert.deepEqual(
            agentBreaches(lines, new Set(["A"])).map((breach) => [breach.id, breach.line]),
            [["owner:B", 2]],
        );
    });
});

describe("closureBreaches", () => {
    it("reports open rows in a later phase than the closure row, and nothing without one", () => {
        const lines = ["CLOSES: 2.1.1", task("2.1.1"), task("3.1.1"), task("1.1.1")];
        const [breach] = closureBreaches(lines);
        assert.ok(breach !== undefined);
        assert.equal(breach.kind, "closureBeforeItsDependencies");
        assert.ok(breach.actual.includes("3.1.1"));
        assert.equal(breach.line, 1);
        assert.deepEqual(closureBreaches([task("3.1.1")]), []);
    });
});

describe("idBreaches", () => {
    it("reports an id declared twice and an id cited that no task declares", () => {
        const lines = [task("1.1.1"), task("1.1.1"), "depends on 1.1.1 and 9.9.9"];
        assert.deepEqual(
            idBreaches(lines).map((breach) => [breach.kind, breach.id, breach.line]),
            [
                ["duplicateId", "1.1.1", 2],
                ["danglingReference", "9.9.9", 3],
            ],
        );
    });
});
