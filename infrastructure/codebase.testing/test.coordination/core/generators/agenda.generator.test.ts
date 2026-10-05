import { describe, it } from "vitest";
import { dirname, join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { AGENDA } from "coordination-surface/tools/core/constants/blocking.constants.ts";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { writeAgendaIfUnmoved } from "coordination-surface/tools/core/generators/agenda.generator.ts";
import { writeVerbatim } from "@govlab/canonical-write";

const WITNESSED = "# Agenda\n- planned invariant\n";

const seeded = function seeded(): string {
    const root = mkdtempSync(join(tmpdir(), "coordination-agenda-"));
    mkdirSync(dirname(resolve(root, AGENDA)), { recursive: true });
    writeVerbatim(resolve(root, AGENDA), WITNESSED);
    return root;
};

describe("writeAgendaIfUnmoved", () => {
    it("writes the rendered agenda when the file still holds what was read", () => {
        const root = seeded();
        assert.equal(writeAgendaIfUnmoved(root, WITNESSED, "# Agenda\n- rendered\n"), true);
        assert.equal(readFileSync(resolve(root, AGENDA), "utf8"), "# Agenda\n- rendered\n");
    });

    it("refuses and leaves the file alone when it moved since it was read", () => {
        const root = seeded();
        assert.equal(writeAgendaIfUnmoved(root, "an older read", "# Agenda\n- rendered\n"), false);
        assert.equal(readFileSync(resolve(root, AGENDA), "utf8"), WITNESSED);
    });
});
