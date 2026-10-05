import {
    ACKNOWLEDGED,
    EMPTY_EXTRACTION,
    EXTRACTION_KIND,
    closureRefusal,
    extractionRefusal,
} from "coordination-surface/tools/core/validators/archive.validator.ts";
import {
    CLOSES_NEEDS_AGENT,
    artifactNeedsRef,
    compressNeedsExtracted,
    extractedUnresolved,
    fenceMalformed,
    judgmentWithRef,
    notReader,
    refKindWrong,
} from "coordination-surface/tools/core/strings/archive.strings.ts";
import { describe, it } from "vitest";
import { JUDGMENT_KIND } from "coordination-surface/tools/core/constants/board.constants.ts";
import assert from "node:assert/strict";
import { citationUnresolved } from "coordination-surface/tools/core/strings/reference.strings.ts";

const CLOSES = "A-3";

const HISTORY = "history.md";

describe("closureRefusal", () => {
    it("refuses a closure without an agent, a judgment with a reference, an artifact without one, and a malformed fence", () => {
        assert.equal(closureRefusal(CLOSES, null, null, "text", ""), CLOSES_NEEDS_AGENT);
        assert.equal(closureRefusal(CLOSES, "changelog:x", "B", "text", "x", JUDGMENT_KIND), judgmentWithRef(CLOSES));
        assert.equal(closureRefusal(CLOSES, null, "B", "text", ""), artifactNeedsRef(CLOSES, EMPTY_EXTRACTION));
        assert.equal(closureRefusal(CLOSES, EMPTY_EXTRACTION, "B", null, ""), fenceMalformed(CLOSES));
        assert.equal(closureRefusal(CLOSES, EMPTY_EXTRACTION, "B", "NOTREADER B", ""), notReader("NOTREADER B"));
    });

    it("refuses a reference of the wrong kind or one that does not resolve, and passes one the archive carries", () => {
        assert.equal(
            closureRefusal(CLOSES, "gate:board", "B", "text", ""),
            refKindWrong(CLOSES, "gate", EXTRACTION_KIND, EMPTY_EXTRACTION),
        );
        assert.equal(
            closureRefusal(CLOSES, `${EXTRACTION_KIND}:entry 12`, "B", "text", ""),
            citationUnresolved(EXTRACTION_KIND, "entry 12"),
        );
        assert.equal(closureRefusal(CLOSES, `${EXTRACTION_KIND}:entry 12`, "B", "text", "see entry 12"), null);
        assert.equal(closureRefusal(CLOSES, null, "B", "text", "", JUDGMENT_KIND), null);
    });
});

describe("extractionRefusal", () => {
    it("passes an acknowledgement, the empty mark or text the archive carries, and refuses a missing or unresolved extraction", () => {
        assert.equal(extractionRefusal(HISTORY, ACKNOWLEDGED, ""), null);
        assert.equal(extractionRefusal(HISTORY, EMPTY_EXTRACTION, ""), null);
        assert.equal(extractionRefusal(HISTORY, null, ""), compressNeedsExtracted(HISTORY));
        assert.equal(extractionRefusal(HISTORY, "the lost update", "## the lost update"), null);
        assert.equal(
            extractionRefusal(HISTORY, "an invented class", ""),
            extractedUnresolved(HISTORY, "an invented class"),
        );
        assert.equal(extractionRefusal(HISTORY, `${EXTRACTION_KIND}:entry 3`, "entry 3"), null);
        assert.equal(
            extractionRefusal(HISTORY, `${EXTRACTION_KIND}:entry 4`, "entry 3"),
            citationUnresolved(EXTRACTION_KIND, "entry 4"),
        );
    });
});
