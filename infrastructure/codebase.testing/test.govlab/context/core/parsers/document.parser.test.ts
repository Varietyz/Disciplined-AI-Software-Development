import { ROOT, relativePath } from "@ssot/paths";
import { readFileSync, readdirSync } from "node:fs";
import { GOOD } from "./document.fixture.ts";
import assert from "node:assert/strict";
import { parse } from "@govlab/context/core/parsers/document.parser.ts";
import path from "node:path";
import { test } from "vitest";

test("parse reads the node form: tags, genesis, contract fields, populations, refusal, standing, result arms, invariants, report", () => {
    const doc = parse(GOOD);
    assert.equal(doc.declaration?.type, "TASK");
    assert.equal(doc.meta["jurisdiction"], "{project.source} | external: the host's build");
    const [first, second] = doc.nodes;
    assert.ok(first !== undefined && second !== undefined);
    assert.equal(doc.nodes.length, 2);
    assert.equal(first.number, "1");
    assert.equal(first.genesis, "existence");
    assert.equal(first.tag?.yields, "set");
    assert.equal(first.input, "{project.source}");
    const firstGate = first.gate;
    const secondGate = second.gate;
    assert.ok(firstGate !== null && secondGate !== null);
    assert.ok(firstGate.result !== null && secondGate.result !== null);
    assert.equal(firstGate.checks.length, 3);
    assert.deepEqual(firstGate.checks[0]?.population, { measured: "1", set: "{project.source}", whole: "1" });
    assert.equal(firstGate.result.unknown, "BLOCKED");
    assert.equal(second.freshness, "fingerprint(held) + fingerprint(this document)");
    assert.equal(secondGate.refusal, "{project.target} changed since it was read before PERSIST_ARTIFACT");
    assert.equal(secondGate.standing, "moved-set none");
    assert.deepEqual(secondGate.result.failures, [{ name: "mismatch", owner: "NODE 2" }]);
    assert.equal(secondGate.result.unknown, "BLOCKED", "a continuation arm reaches the result");
    assert.equal(doc.invariants.length, 2);
    assert.equal(doc.invariants[1]?.objector, "none");
    assert.equal(doc.report?.fields["verdict"], "pass");
    assert.deepEqual(doc.retired, []);
});

test("parse reads every agent document on disk without throwing", () => {
    const dir = path.join(ROOT, relativePath("claude.root"), "agents");
    const documents = readdirSync(dir).filter((name) => name.endsWith(".md"));
    for (const name of documents) {
        const text = readFileSync(path.join(dir, name), "utf8");
        assert.ok(Array.isArray(parse(text).nodes), name);
    }
    assert.ok(documents.length > 0, "found agent files");
});
