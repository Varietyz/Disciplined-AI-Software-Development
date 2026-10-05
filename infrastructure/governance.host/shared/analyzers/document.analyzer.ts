import { BANNED_TERMS, KNOWN_VIOLATIONS, PROPER_NAMES } from "../manifests/vocabulary.manifest.ts";
import type { CanonCheckId, CompositionFinding, DocumentFinding } from "../../types/writing.types.ts";
import { DOCUMENT_CHANNEL, isCheckEnforced } from "../manifests/writing.canon.manifest.ts";
import { LONG_DASH, SEMICOLON } from "../manifests/punctuation.manifest.ts";
import { firstKnownIn, firstTermIn } from "../matchers/vocabulary.matcher.ts";
import { sentencesOf, shapeOf } from "./sentence.analyzer.ts";
import { CHECK_BY_KIND } from "../manifests/composition.manifest.ts";
import { SENTENCE_CAP } from "../manifests/sentence.manifest.ts";
import { compositionFindingsOf } from "./composition.analyzer.ts";

const KNOWN_TERMS: readonly string[] = [...KNOWN_VIOLATIONS.keys()];

const isEnforced = function isEnforced(finding: DocumentFinding): boolean {
    return isCheckEnforced(finding.check, DOCUMENT_CHANNEL);
};

const found = function found(check: CanonCheckId, evidence: string | null, sentence: string): DocumentFinding[] {
    return evidence === null ? [] : [{ check, evidence, sentence }];
};

const sentenceFindings = function sentenceFindings(sentence: string): DocumentFinding[] {
    const { words } = shapeOf(sentence);
    return [
        ...found("no-semicolon", sentence.includes(SEMICOLON) ? SEMICOLON : null, sentence),
        ...found("no-long-dash", sentence.includes(LONG_DASH) ? LONG_DASH : null, sentence),
        ...found("named-party", firstKnownIn(sentence, KNOWN_TERMS, PROPER_NAMES), sentence),
        ...found("no-praise-vocabulary", firstTermIn(sentence, BANNED_TERMS), sentence),
        ...found("sentence-cap", words > SENTENCE_CAP ? `${String(words)} words` : null, sentence),
    ];
};

const composedFinding = function composedFinding(finding: CompositionFinding): DocumentFinding[] {
    const check = CHECK_BY_KIND.get(finding.kind);
    return check === undefined ? [] : found(check, finding.evidence, finding.sentence);
};

export const documentFindingsOf = function documentFindingsOf(text: string): DocumentFinding[] {
    return [
        ...compositionFindingsOf(text).flatMap(composedFinding),
        ...sentencesOf(text).flatMap(sentenceFindings),
    ].filter(isEnforced);
};
