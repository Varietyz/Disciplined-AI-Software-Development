import { CANON_PRECEDENCE, WRITING_CANON } from "../../shared/manifests/writing.canon.manifest.ts";
import type { CanonCheckId, CanonLayer, CanonRule, DocumentText } from "../../types/writing.types.ts";
import {
    REGISTER_HEADER,
    REGISTER_MATCHES,
    documentFinding,
    findingsLine,
    recordFinding,
    registerDrift,
    renderedLine,
} from "../../shared/strings/writing.strings.ts";
import { existsSync, readFileSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { canonMarkdown } from "../../shared/formatters/writing.formatter.ts";
import { defineCheck } from "@govlab/context/check";
import { documentFindingsOf } from "../../shared/analyzers/document.analyzer.ts";
import { governedDocumentTexts } from "../../shared/loaders/document.loader.ts";
import process from "node:process";
import { writeVerbatim } from "@govlab/canonical-write";

defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth", "architecture:standardization"] });

const FAILURE = 1;
const CHECK_FLAG = "--check";
const TARGET = absolutePath("claude.register");
const EXCERPT_LENGTH = 100;
const ELLIPSIS = "…";

const ruleTexts = function ruleTexts(rule: CanonRule): readonly DocumentText[] {
    const texts = [
        rule.rule,
        rule.why,
        ...rule.conditions,
        ...rule.examples.flatMap((example) => [example.why, ...(example.repaired === null ? [] : [example.repaired])]),
    ];
    return texts.map((text) => ({ at: rule.id, text }));
};

const layerTexts = function layerTexts(layer: CanonLayer): readonly DocumentText[] {
    return [
        { at: layer.id, text: layer.intro },
        ...layer.covers.map((text) => ({ at: layer.id, text })),
        ...layer.rules.flatMap(ruleTexts),
    ];
};

const ruleOf = function ruleOf(check: CanonCheckId): string {
    const rule = WRITING_CANON.flatMap((layer) => layer.rules).find((candidate) =>
        candidate.checks.some((owned) => owned.id === check),
    );
    return rule?.id ?? check;
};

const excerpt = function excerpt(text: string): string {
    return text.length <= EXCERPT_LENGTH ? text : text.slice(0, EXCERPT_LENGTH) + ELLIPSIS;
};

const canonFindings = WRITING_CANON.flatMap(layerTexts).flatMap((own) =>
    documentFindingsOf(own.text).map((finding) => ({ at: own.at, finding })),
);
for (const { at, finding } of canonFindings) {
    process.stderr.write(
        recordFinding(at, ruleOf(finding.check), finding.check, finding.evidence, excerpt(finding.sentence)),
    );
}

const documentFindings = governedDocumentTexts().flatMap((own) =>
    documentFindingsOf(own.text).map((finding) => ({ at: own.at, finding })),
);
for (const { at, finding } of documentFindings) {
    process.stderr.write(
        documentFinding(at, ruleOf(finding.check), finding.check, finding.evidence, excerpt(finding.sentence)),
    );
}

const rendered = canonMarkdown(WRITING_CANON, REGISTER_HEADER, CANON_PRECEDENCE);

if (process.argv.includes(CHECK_FLAG)) {
    const current = existsSync(TARGET) ? readFileSync(TARGET, "utf8") : "";
    if (current !== rendered) {
        process.stderr.write(registerDrift(TARGET));
        process.exit(FAILURE);
    }
    process.stdout.write(REGISTER_MATCHES);
} else {
    writeVerbatim(TARGET, rendered);
    const rules = WRITING_CANON.reduce((sum, layer) => sum + layer.rules.length, 0);
    process.stdout.write(renderedLine(WRITING_CANON.length, rules, TARGET));
}
process.stdout.write(findingsLine(canonFindings.length, documentFindings.length));
if (canonFindings.length + documentFindings.length > 0) {
    process.exit(FAILURE);
}
