import {
    CART,
    CART_PATH,
    CODE_MEDIUM,
    MANAGER_PATH,
    PATH_LANG,
    STORES,
    STORE_ID,
    STORE_NAME,
    marker,
    placedCategory,
    rename,
    tag,
} from "../selectors/lexicon.fixture.ts";
import type { TermCategory, TermRecord } from "@govlab/context/types/lexicon.types.ts";
import { createGovlabContext, createLexicon } from "@govlab/context";
import assert from "node:assert/strict";
import { tagExampleDefectsOf } from "@govlab/context/core/validators/lexicon.validator.ts";
import { test } from "vitest";

interface Defect {
    readonly id: string;
    readonly reason: string;
}

const defectsOf = (categories: TermCategory[]): Defect[] => tagExampleDefectsOf(createLexicon({ data: categories }));

const placedDefectsOf = (records: TermRecord[]): Defect[] => defectsOf([placedCategory(records)]);

const renameDefectsOf = (record: TermRecord): Defect[] =>
    defectsOf([
        placedCategory([CART]),
        { category: "planted-renamed", exampleShape: "renamed-file", records: [record] },
    ]);

const firstRenameReason = (before: string, after: string): string =>
    renameDefectsOf(rename(before, after))[0]?.reason ?? "";

test("a placed category passes an example that agrees with its tag and its folder", () => {
    const entity = tag("Entity Tag", "entities", { example: "entities/customer.entity.ts" });
    assert.deepEqual(placedDefectsOf([CART, entity]), []);
});

test("a placed category refuses a missing example, a wrong tag, a wrong folder and a malformed path", () => {
    const defects = placedDefectsOf([
        tag(STORE_NAME, STORES),
        tag("Queue Tag", "queues", { example: "queues/email.store.ts" }),
        tag("Timer Tag", "timers", { example: "clocks/autosave.timer.ts" }),
        tag("Heap Tag", "heaps", { example: "heap.ts" }),
    ]);
    assert.deepEqual(
        defects.map((entry) => entry.id),
        [STORE_ID, "queue-tag", "timer-tag", "heap-tag"],
    );
    const reasons = defects.map((entry) => entry.reason);
    assert.ok(reasons[0]?.includes("carries no example") === true);
    assert.ok(reasons[1]?.includes('tags its file "store"') === true);
    assert.ok(reasons[2]?.includes('sits in "clocks"') === true);
    assert.ok(reasons[3]?.includes("is not <folder>/<subject>.<tag>.<ext>") === true);
});

test("a compound marker sits in the folder of the tag its variant names", () => {
    assert.deepEqual(placedDefectsOf([CART, marker("stores/cart.store.test.ts")]), []);
    assert.deepEqual(
        placedDefectsOf([CART, marker("tests/cart.store.test.ts")]).map((entry) => entry.id),
        ["test-tag"],
    );
});

test("a term outside a declared category may carry no example, and a placed term no rename", () => {
    const renamedPlaced: TermRecord = {
        ...CART,
        exemplar: { after: CART_PATH, before: MANAGER_PATH, lang: PATH_LANG, medium: CODE_MEDIUM },
        name: "Queue Tag",
    };
    const defects = defectsOf([{ category: "planted-plain", records: [CART] }, placedCategory([renamedPlaced])]);
    assert.ok(defects.some((entry) => entry.id === STORE_ID && entry.reason.includes("declares no shape")));
    assert.ok(defects.some((entry) => entry.id === "queue-tag" && entry.reason.includes("declares no shape")));
});

test("a rename keeps its subject, starts from a refused word and lands in a covering tag's folder", () => {
    assert.deepEqual(renameDefectsOf(rename(MANAGER_PATH, CART_PATH)), []);
    assert.ok(firstRenameReason(MANAGER_PATH, "stores/basket.store.ts").includes("changes the subject"));
    assert.ok(firstRenameReason(CART_PATH, CART_PATH).includes("a declared tag"));
    assert.ok(firstRenameReason(MANAGER_PATH, "caches/cart.store.ts").includes("no tag in its seeAlso"));
    const bare: TermRecord = {
        definition: "Tagging a file with a planted refused word.",
        kind: "anti-pattern",
        name: "Bare Refusal",
    };
    assert.ok(renameDefectsOf(bare)[0]?.reason.includes("carries no rename") === true);
});

test("a tag or a refusal outside a category that declares its example shape is refused", () => {
    const defects = defectsOf([
        { category: "planted-plain", records: [tag(STORE_NAME, STORES), rename(MANAGER_PATH, CART_PATH)] },
    ]);
    assert.ok(
        defects.some((entry) => entry.id === STORE_ID && entry.reason.includes('no "placed-file" example shape')),
    );
    assert.ok(
        defects.some(
            (entry) => entry.id === "planted-refusal" && entry.reason.includes('no "renamed-file" example shape'),
        ),
    );
});

test("every bundled tag term carries an example that agrees with its tag and its folder", () => {
    assert.deepEqual(createGovlabContext().validateResolution().tagExampleDefects, []);
});
