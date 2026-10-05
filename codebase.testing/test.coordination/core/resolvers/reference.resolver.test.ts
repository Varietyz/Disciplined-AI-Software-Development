import {
    CITATION_KINDS,
    citationRefusal,
    offeredForms,
    parseCitation,
    resolvesCitation,
    unknownKind,
} from "coordination-surface/tools/core/resolvers/reference.resolver.ts";
import {
    citationKindUnknown,
    citationUnresolved,
    citationUntyped,
} from "coordination-surface/tools/core/strings/reference.strings.ts";
import { describe, it } from "vitest";
import { join, resolve } from "node:path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import assert from "node:assert/strict";
import { surfacePath } from "coordination-surface/config/surface.config.ts";
import { tmpdir } from "node:os";
import { writeVerbatim } from "@govlab/canonical-write";

describe("parseCitation and unknownKind", () => {
    it("split a citation into kind and member, and know the kinds a citation may take", () => {
        assert.deepEqual(parseCitation(" gate : board/fence "), { kind: "gate", member: "board/fence" });
        assert.equal(parseCitation("no kind"), null);
        assert.equal(parseCitation("gate:"), null);
        assert.equal(unknownKind({ kind: "gate", member: "x" }), false);
        assert.equal(unknownKind({ kind: "rumor", member: "x" }), true);
    });
});

describe("citationRefusal", () => {
    it("refuses an untyped citation, an unknown kind and an unresolved member, and passes one that resolves", () => {
        assert.equal(
            citationRefusal("board", () => true),
            citationUntyped("board", CITATION_KINDS),
        );
        assert.equal(
            citationRefusal("rumor:x", () => true),
            citationKindUnknown("rumor", CITATION_KINDS),
        );
        assert.equal(
            citationRefusal("gate:ghost", () => false),
            citationUnresolved("gate", "ghost"),
        );
        assert.equal(
            citationRefusal("gate:board", () => true),
            null,
        );
    });
});

describe("resolvesCitation and offeredForms", () => {
    it("resolves a gate to a rule source, a form to a flag the write entry point offers, and a changelog to the archive", () => {
        const root = mkdtempSync(join(tmpdir(), "coordination-citations-"));
        try {
            const rules = resolve(root, surfacePath("rules"));
            const entrypoints = resolve(root, surfacePath("entrypoints"));
            mkdirSync(rules, { recursive: true });
            mkdirSync(entrypoints, { recursive: true });
            writeVerbatim(join(rules, "board.rule.ts"), "export {};");
            writeVerbatim(join(entrypoints, "board.entrypoint.ts"), 'const FORMS = ["--post", "--mark", "--post"];');
            assert.deepEqual(offeredForms(root), ["--post", "--mark"]);
            assert.equal(resolvesCitation(root, "", { kind: "gate", member: "board/fence" }), true);
            assert.equal(resolvesCitation(root, "", { kind: "gate", member: "ghost" }), false);
            assert.equal(resolvesCitation(root, "", { kind: "form", member: "--mark" }), true);
            assert.equal(resolvesCitation(root, "entry 12", { kind: "changelog", member: "entry 12" }), true);
            assert.equal(resolvesCitation(root, "", { kind: "rumor", member: "x" }), false);
            assert.deepEqual(offeredForms(join(root, "elsewhere")), []);
        } finally {
            rmSync(root, { force: true, recursive: true });
        }
    });
});
