import {
    CLOSES_NEEDS_AGENT,
    artifactNeedsRef,
    compressNeedsExtracted,
    extractedUnresolved,
    fenceMalformed,
    judgementWithRef,
    notReader,
    refKindWrong,
} from "../strings/archive.strings.ts";
import { citationRefusal, parseCitation, resolvesCitation } from "../resolvers/reference.resolver.ts";
import { JUDGEMENT_KIND } from "../constants/board.constants.ts";
import { projectRoot } from "../../../config/surface.config.ts";

export const EMPTY_EXTRACTION = "none:carries-nothing-durable";

export const EXTRACTION_KIND = "changelog";

const NOT_READER = "NOTREADER";

const shapeRefusal = function shapeRefusal(closes: string, ref: string | null, kind: string): string | null {
    const judgement = kind === JUDGEMENT_KIND;
    if (judgement && ref !== null) {
        return judgementWithRef(closes);
    }
    return !judgement && ref === null ? artifactNeedsRef(closes, EMPTY_EXTRACTION) : null;
};

const extractionCitationRefusal = function extractionCitationRefusal(
    closes: string,
    ref: string,
    carried: string,
): string | null {
    const citation = parseCitation(ref);
    if (citation !== null && citation.kind !== EXTRACTION_KIND) {
        return refKindWrong(closes, citation.kind, EXTRACTION_KIND, EMPTY_EXTRACTION);
    }
    return citationRefusal(ref, (cited) => resolvesCitation(projectRoot(), carried, cited));
};

const textRefusal = function textRefusal(closes: string, text: string | null): string | null {
    if (text === null) {
        return fenceMalformed(closes);
    }
    return text.startsWith(NOT_READER) ? notReader(text) : null;
};

export const closureRefusal = function closureRefusal(
    closes: string,
    ref: string | null,
    agent: string | null,
    text: string | null,
    carried: string,
    kind = "",
): string | null {
    if (agent === null) {
        return CLOSES_NEEDS_AGENT;
    }

    const cited = ref === null || ref === EMPTY_EXTRACTION ? null : extractionCitationRefusal(closes, ref, carried);
    return shapeRefusal(closes, ref, kind) ?? cited ?? textRefusal(closes, text);
};

export const ACKNOWLEDGED = "acknowledged";

export const extractionRefusal = function extractionRefusal(
    changelog: string,
    extracted: string | null,
    carried: string,
    repoRoot = projectRoot(),
): string | null {
    if (extracted === ACKNOWLEDGED) {
        return null;
    }
    if (extracted === EMPTY_EXTRACTION) {
        return null;
    }

    if (extracted !== null && parseCitation(extracted) !== null) {
        return citationRefusal(extracted, (citation) => resolvesCitation(repoRoot, carried, citation));
    }

    if (extracted === null) {
        return compressNeedsExtracted(changelog);
    }

    if (carried.includes(extracted)) {
        return null;
    }

    return extractedUnresolved(changelog, extracted);
};
