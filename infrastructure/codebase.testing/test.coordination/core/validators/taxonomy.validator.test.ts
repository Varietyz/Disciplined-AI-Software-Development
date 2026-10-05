import {
    checkNaming,
    checkPlacement,
    parseFilename,
} from "coordination-surface/tools/core/validators/taxonomy.validator.ts";
import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { loadTaxonomy } from "coordination-surface/tools/core/resolvers/taxonomy.resolver.ts";

type Data = Parameters<typeof parseFilename>[1];

const ROOT = "tools";

const DATA: Data = {
    ...loadTaxonomy(),
    agentLetters: ["a"],
    compoundMarkers: ["fixture"],
    concernFolders: ["runners", "validators"],
    concernTags: ["runner", "validator"],
    containers: { [ROOT]: ["core"] },
    folderToTag: { runners: "runner", validators: "validator" },
    foreignContainers: { [ROOT]: ["vendor"] },
    maxDepthFromRoot: 3,
    specialContainers: { [ROOT]: ["fixtures"] },
    subjects: ["board", "venue"],
    variants: ["draft"],
};

describe("parseFilename", () => {
    it("reads subject, variant, concern and extension, a compound marker, and refuses a short name or a subject named as its concern", () => {
        assert.deepEqual(parseFilename("board.runner.ts", DATA).parsed, {
            concern: "runner",
            ext: "ts",
            marker: null,
            subject: "board",
            variant: null,
        });
        assert.equal(parseFilename("board.draft.runner.ts", DATA).parsed?.variant, "draft");
        assert.deepEqual(parseFilename("board.runner.fixture.ts", DATA).parsed, {
            concern: "runner",
            ext: "ts",
            marker: "fixture",
            subject: "board",
            variant: null,
        });
        assert.equal(parseFilename("a.fixture.ts", DATA).code, "unparsable");
        assert.equal(parseFilename("board.ts", DATA).code, "unparsable");
        assert.equal(parseFilename("runner.runner.ts", DATA).code, "subjectEqualsConcern");
    });
});

describe("checkNaming", () => {
    it("passes a declared name in its concern folder, and names an undeclared slot or a folder that expects another concern", () => {
        assert.deepEqual(checkNaming("board.runner.ts", "runners", DATA), { code: null, evidence: "", ok: true });
        assert.equal(checkNaming("board.a.runner.ts", "runners", DATA).ok, true);
        assert.equal(checkNaming("ghost.runner.ts", "runners", DATA).evidence, 'subject "ghost"');
        assert.equal(checkNaming("board.odd.runner.ts", "runners", DATA).evidence, 'variant "odd"');
        assert.equal(checkNaming("board.helper.ts", "runners", DATA).evidence, 'concern "helper"');
        assert.equal(checkNaming("board.runner.ts", "validators", DATA).code, "concernMismatch");
        assert.equal(checkNaming("board.runner.ts", "misc", DATA).code, "concernMismatch");
        assert.equal(checkNaming("board.ts", "runners", DATA).code, "unparsable");
    });
});

describe("checkPlacement", () => {
    it("places a file under a declared container and concern, and names each shape the grammar refuses", () => {
        const codeOf = (segments: readonly string[], fileName = ""): string | null =>
            checkPlacement(ROOT, segments, DATA, fileName).code;
        assert.equal(checkPlacement(ROOT, ["core", "runners"], DATA).concernFolder, "runners");
        assert.equal(checkPlacement(ROOT, ["core", "board", "runners"], DATA).ok, true);
        assert.equal(checkPlacement(ROOT, [], DATA, "README.md").foreign, true);
        assert.equal(checkPlacement(ROOT, ["vendor", "x"], DATA).foreign, true);
        assert.equal(checkPlacement(ROOT, ["fixtures"], DATA).concernFolder, "fixtures");
        assert.equal(codeOf([], "loose.ts"), "looseFileAtRoot");
        assert.equal(codeOf(["elsewhere"]), "undeclaredContainer");
        assert.equal(codeOf(["fixtures", "deeper"]), "nestedInSpecial");
        assert.equal(codeOf(["core"]), "looseFileAtRoot");
        assert.equal(codeOf(["core", "a.b"]), "dottedFolder");
        assert.equal(codeOf(["core", "board", "venue", "runners"]), "tooDeep");
        assert.equal(codeOf(["core", "misc"]), "badShape");
        assert.equal(codeOf(["core", "runners", "board"]), "roleOutOfOrder");
        assert.equal(codeOf(["core", "board"]), "parentNotConcern");
    });
});
