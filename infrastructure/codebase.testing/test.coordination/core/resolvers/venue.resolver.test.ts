import {
    addressesSuccessor,
    authorityRefusal,
    boundAuthority,
    receiverResolves,
    seatedLetters,
    strandedDeferrals,
    successorView,
    unarrivedDeferrals,
    unoriginatedInheritance,
    venueAuthority,
    venueInvariant,
} from "coordination-surface/tools/core/resolvers/venue.resolver.ts";
import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { slotText, surfacePath } from "coordination-surface/config/surface.config.ts";
import { AGENT_INDEX } from "coordination-surface/tools/core/constants/board.constants.ts";
import { BLOCKING_SUFFIX } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import assert from "node:assert/strict";
import { authorityHeld } from "coordination-surface/tools/core/strings/venue.strings.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

const CONCERN = slotText("convention", "venue_authority_concern");

const INVARIANT = "one-writer";

const put = function put(root: string, relative: string, text: string): void {
    const path = resolve(root, relative);
    mkdirSync(dirname(path), { recursive: true });
    writeVerbatim(path, text);
};

const withRoot = function withRoot(check: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), "coordination-venue-"));
    try {
        check(root);
    } finally {
        rmSync(root, { force: true, recursive: true });
    }
};

describe("venue authority", () => {
    it("binds authority to the seat the index names for the concern, and hands it to a seated letter when that seat is not seated", () => {
        withRoot((root) => {
            assert.equal(boundAuthority(root), null);
            put(root, AGENT_INDEX, `| C | ${CONCERN} | ACTIVE |\n| A | graph | ACTIVE |`);
            put(root, surfacePath("board"), "Agent A — ACTIVE\nAgent C — ACTIVE");
            assert.equal(boundAuthority(root), "C");
            assert.deepEqual(seatedLetters(root), ["A", "C"]);
            assert.equal(venueAuthority(root), "C");
            assert.equal(authorityRefusal(root, "C", "raise"), null);
            assert.equal(authorityRefusal(root, "A", "raise"), authorityHeld("raise", "C", "A", null));

            put(root, AGENT_INDEX, `| C | ${CONCERN} | INACTIVE |\n| A | graph | ACTIVE |`);
            assert.equal(venueAuthority(root), "A");
            assert.equal(authorityRefusal(root, "B", "raise"), authorityHeld("raise", "A", "B", "C"));
        });
    });
});

describe("venueInvariant and addressesSuccessor", () => {
    it("read a venue's invariant from its name, and match a receiver against the successor's invariant", () => {
        assert.equal(venueInvariant(`venues/one-writer.2${BLOCKING_SUFFIX}`), INVARIANT);
        assert.equal(venueInvariant("plain"), "plain");
        assert.equal(addressesSuccessor(INVARIANT, `one-writer.3${BLOCKING_SUFFIX}`), true);
        assert.equal(addressesSuccessor("", `one-writer.3${BLOCKING_SUFFIX}`), false);
    });
});

const VENUE = [
    "SUCCESSOR: one-writer",
    "## DEFERRED",
    "- the lock → one-writer",
    "- the index → B",
    "- the orphan → ghost",
    "- self → self",
].join("\n");

describe("deferral resolution", () => {
    it("names the deferrals the successor has not taken, the inherited clauses nobody deferred, and the stranded ones", () => {
        const successor = `one-writer.2${BLOCKING_SUFFIX}`;
        assert.deepEqual(
            unarrivedDeferrals(VENUE, "", successor).map((entry) => entry.clause),
            ["the lock"],
        );
        assert.deepEqual(unarrivedDeferrals(VENUE, "the lock", successor), []);
        const inherited = "## INHERITED\n- the lock → one-writer\n- invented → x";
        assert.deepEqual(unoriginatedInheritance(VENUE, inherited), ["invented"]);
        const board = "Agent B — ACTIVE";
        assert.equal(receiverResolves("B", board, "", []), true);
        assert.equal(receiverResolves(INVARIANT, board, "", [successor]), true);
        assert.equal(receiverResolves("planned-one", board, "", [], ["planned-one"]), true);
        assert.equal(receiverResolves("", board, "", []), false);
        assert.deepEqual(strandedDeferrals(VENUE, board, "", [successor]), [
            { clause: "the orphan", receiver: "ghost" },
            { clause: "self", receiver: "self" },
        ]);
    });
});

describe("successorView", () => {
    it("reads the declared successor, its text, and what it still owes", () => {
        withRoot((root) => {
            const target = `venues/one-writer.1${BLOCKING_SUFFIX}`;
            const successor = `venues/one-writer.2${BLOCKING_SUFFIX}`;
            put(root, successor, "## INHERITED\n- the lock → one-writer");
            const view = successorView(root, target, VENUE, [target, successor], [INVARIANT]);
            assert.equal(view.declared, INVARIANT);
            assert.equal(view.successor, successor);
            assert.equal(view.scheduled, true);
            assert.deepEqual(view.unarrived, []);
            assert.ok(view.elsewhere.includes("the index → B"));
        });
    });
});
