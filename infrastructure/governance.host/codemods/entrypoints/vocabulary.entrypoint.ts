import { EXTENSION_REQUIRED, ROOT_REQUIRED, VOCABULARY_SUMMARY } from "../strings/codemod.strings.ts";
import { applyCodemod, refuse } from "../selectors/codemod.selector.ts";
import { flagValues, resolveArgv } from "@govlab/argv";
import type { ArgvSpec } from "@govlab/argv";
import type { Edit } from "../../types/codemod.types.ts";
import type { LiteralFinding } from "../../types/analyzer.types.ts";
import { ROOT } from "@ssot/paths";
import { collectVocabularyFindings } from "../analyzers/vocabulary.analyzer.ts";
import { defineCheck } from "@govlab/context/check";
import { excludeMatcher } from "@govlab/quality/config";

const RULE_ID = "renamed-vocabulary";

const SPEC: ArgvSpec = {
    command: "node .govlab/codemods/entrypoints/vocabulary.entrypoint.ts",
    flags: [
        {
            describe: "a file or directory to rewrite, relative to the repository root",
            name: "--root",
            repeatable: true,
            takesValue: true,
        },
        {
            describe: "a file or directory where a literal that is exactly a renamed collection id is rewritten too",
            name: "--whole-id-root",
            repeatable: true,
            takesValue: true,
        },
        {
            describe: "a file or directory under a root that the run leaves as written",
            name: "--skip",
            repeatable: true,
            takesValue: true,
        },
        {
            describe: "a file extension to include: .ts, .json or .md",
            name: "--ext",
            repeatable: true,
            takesValue: true,
        },
        { describe: "list every replacement without writing", name: "--map", takesValue: false },
    ],
    summary: VOCABULARY_SUMMARY,
};

const argv = resolveArgv(SPEC);
const roots = flagValues(argv, "--root");
const extensions = flagValues(argv, "--ext");

if (roots.length === 0) {
    refuse(ROOT_REQUIRED);
}
if (extensions.length === 0) {
    refuse(EXTENSION_REQUIRED);
}

const buildEdits = function buildEdits(findings: readonly LiteralFinding[]): Map<string, Edit[]> {
    const byFile = new Map<string, Edit[]>();
    for (const finding of findings) {
        byFile.set(finding.fileName, [
            ...(byFile.get(finding.fileName) ?? []),
            { end: finding.end, replacement: finding.to, start: finding.start },
        ]);
    }
    return byFile;
};

applyCodemod({
    appliedNoun: "name(s) replaced",
    blockedMessage: (finding) => finding.reason ?? "",
    checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
    editsByFile: buildEdits,
    findings: collectVocabularyFindings({
        extensions,
        roots,
        skipped: await excludeMatcher(ROOT),
        skippedPaths: flagValues(argv, "--skip"),
        wholeIdRoots: flagValues(argv, "--whole-id-root"),
    }),
    gateOnBlocked: true,
    label: (finding) => `"${finding.from}" → "${finding.to}"`,
    programCount: roots.length,
    ruleId: RULE_ID,
    scopeNoun: "root(s)",
});
