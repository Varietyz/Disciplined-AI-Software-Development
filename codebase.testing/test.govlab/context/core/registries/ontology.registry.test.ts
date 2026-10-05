import { ONTOLOGY_FACES, defineOntologyFace, foldFaces } from "@govlab/context";
import { NOOP_LOGGER } from "@govlab/context/core/reporters/ontology.reporter.ts";
import assert from "node:assert/strict";
import { test } from "vitest";

const CONTEXT = { logger: NOOP_LOGGER };

test("defineOntologyFace refuses a second collection under a name already registered", () => {
    const [first] = ONTOLOGY_FACES;
    assert.ok(first);
    assert.throws(() => defineOntologyFace({ build: () => ({}), name: first.name }), {
        message: `ontology collection "${first.name}" is already registered`,
    });
});

test("foldFaces builds each collection after the ones it depends on", () => {
    const order: string[] = [];
    const built = foldFaces(
        [
            {
                build: (_, deps) => {
                    order.push("planted-top");
                    return deps;
                },
                dependsOn: ["planted-base"],
                name: "planted-top",
            },
            {
                build: () => {
                    order.push("planted-base");
                    return "base";
                },
                name: "planted-base",
            },
        ],
        CONTEXT,
    );
    assert.deepEqual(order, ["planted-base", "planted-top"]);
    assert.deepEqual(built.get("planted-top"), { "planted-base": "base" });
});

test("foldFaces refuses a dependency cycle and a dependency no definition names", () => {
    assert.throws(
        () =>
            foldFaces(
                [
                    { build: () => 1, dependsOn: ["planted-b"], name: "planted-a" },
                    { build: () => 2, dependsOn: ["planted-a"], name: "planted-b" },
                ],
                CONTEXT,
            ),
        { message: 'ontology collection dependency cycle at "planted-a"' },
    );
    assert.throws(() => foldFaces([{ build: () => 1, dependsOn: ["planted-ghost"], name: "planted-a" }], CONTEXT), {
        message: 'ontology collection "planted-ghost" is not registered',
    });
});
