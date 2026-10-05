import { POSITION_MARKER, UNREAD_MARKER } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import { describe, it } from "vitest";
import {
    unreadAuthors,
    unreadWhilePositionsStand,
} from "coordination-surface/tools/core/validators/blocking.validator.ts";
import assert from "node:assert/strict";

describe("unreadWhilePositionsStand and unreadAuthors", () => {
    it("list the seats still unread while a position stands, skipping a mention, and the authors among them", () => {
        const venue = [`${UNREAD_MARKER} D A B2 <C>`, `${POSITION_MARKER}A1: the lock is enough`].join("\n");
        assert.deepEqual(unreadWhilePositionsStand(venue), ["A", "B2", "D"]);
        assert.deepEqual(unreadAuthors(venue), ["A"]);
    });

    it("list nothing while no position or item stands", () => {
        assert.deepEqual(unreadWhilePositionsStand(`${UNREAD_MARKER} A B`), []);
        assert.deepEqual(unreadAuthors(`${UNREAD_MARKER} A B`), []);
    });
});
