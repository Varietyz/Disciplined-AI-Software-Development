import { RECORD_FIELD_REFUSAL, SEEDED_MANDATES } from "coordination-surface/tools/core/constants/surface.constants.ts";
import { describe, it } from "vitest";
import { dirname, join } from "node:path";
import {
    flagsIn,
    isDeclaredSlot,
    mandateRoute,
    namedOf,
    regionsWith,
    slotMandates,
    suffixMandates,
    surfaceTarget,
    toolWritable,
    venueMandates,
} from "coordination-surface/tools/core/resolvers/surface.resolver.ts";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { ASSESSED_FORMS } from "coordination-surface/tools/core/registries/surface.registry.ts";
import { BLOCKING_SUFFIX } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import { BOARD_PATH } from "coordination-surface/tools/core/constants/board.constants.ts";
import assert from "node:assert/strict";
import { surfacePrefix } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { venueFieldsFrom } from "coordination-surface/tools/core/validators/venue.validator.ts";
import { writeVerbatim } from "@govlab/canonical-write";

const MANDATE = { from: "x", member: "Status", operand: "field" as const, refusal: "r", target: BOARD_PATH };
const VENUE = `probe${BLOCKING_SUFFIX}`;
const ROOT_FILE = "root.md";

describe("venueMandates", () => {
    it("adds a field mandate for every field the venue template's record declares to the seeded mandates", () => {
        const template = "┌─── AGENT X\n  Status: —\n  Owns: —\n└─── END AGENT X";
        const fields = venueFieldsFrom(template);
        assert.deepEqual(venueMandates(template), [
            ...SEEDED_MANDATES,
            ...fields.map((field) => ({ member: field, operand: "field", refusal: RECORD_FIELD_REFUSAL })),
        ]);
    });
});

describe("flagsIn and namedOf", () => {
    it("list each quoted flag a source offers once, and name a mandate by its operand and member", () => {
        assert.deepEqual(flagsIn('["--post", "--mark", "--post", "--"]'), ["--post", "--mark"]);
        assert.equal(namedOf(MANDATE), "field Status");
        assert.equal(namedOf({ ...MANDATE, member: null }), "field");
    });
});

describe("toolWritable and mandateRoute", () => {
    it("reach a mandate a tool writes, and name one out of scope or unwritable", () => {
        const writable = toolWritable();
        assert.ok(writable.length > 0);
        const reachable = writable.find((pair) => pair.path === BOARD_PATH);
        assert.ok(reachable !== undefined);
        const mandate = { ...MANDATE, member: reachable.member, operand: reachable.operand };
        assert.equal(mandateRoute(mandate, [BOARD_PATH], writable), "reached");
        assert.equal(mandateRoute(mandate, ["elsewhere.md"], writable), "outOfScope");
        assert.equal(
            mandateRoute({ ...mandate, member: "never", operand: "document" }, [BOARD_PATH], []),
            "unwritable",
        );
    });
});

describe("surfaceTarget", () => {
    it("keeps a name found at the root, takes the surface-prefixed name where only it exists, and keeps a missing name", () => {
        const root = mkdtempSync(join(tmpdir(), "surface-target-"));
        try {
            const prefix = surfacePrefix();
            const prefixed = prefix.length === 0 ? VENUE : `${prefix}/${VENUE}`;
            mkdirSync(dirname(join(root, prefixed)), { recursive: true });
            writeVerbatim(join(root, prefixed), "");
            writeVerbatim(join(root, ROOT_FILE), "");
            assert.equal(surfaceTarget(root, ROOT_FILE), ROOT_FILE);
            assert.equal(surfaceTarget(root, VENUE), prefixed);
            assert.equal(surfaceTarget(root, "absent.md"), "absent.md");
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});

describe("suffixMandates, slotMandates, isDeclaredSlot and regionsWith", () => {
    it("fan each mandate out over every venue, resolve party mandates to declared slots, and group regions by effect", () => {
        const members = [{ member: "Status", operand: "field" as const, refusal: "r" }];
        assert.deepEqual(suffixMandates([`a${BLOCKING_SUFFIX}`, "b.md"], members), [
            {
                from: `a${BLOCKING_SUFFIX}`,
                member: "Status",
                operand: "field",
                refusal: "r",
                target: `a${BLOCKING_SUFFIX}`,
            },
        ]);
        assert.equal(isDeclaredSlot("board"), true);
        assert.equal(isDeclaredSlot("no_such_slot"), false);
        assert.ok(slotMandates().every((mandate) => isDeclaredSlot(mandate.from)));
        const effect = Object.values(ASSESSED_FORMS).find((assessment) => assessment.region !== null);
        assert.ok(effect === undefined || regionsWith(effect.effect).has(effect.region ?? ""));
        assert.equal(regionsWith("no-such-effect").size, 0);
    });
});
