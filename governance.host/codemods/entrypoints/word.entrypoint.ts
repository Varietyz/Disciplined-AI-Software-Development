import { EXTENSION_REQUIRED, ROOT_REQUIRED, WORD_SUMMARY, spellingHit } from "../strings/codemod.strings.ts";
import { applyCodemod, refuse } from "../selectors/codemod.selector.ts";
import { flagValues, hasFlag, resolveArgv } from "@govlab/argv";
import type { ArgvSpec } from "@govlab/argv";
import type { Edit } from "../../types/codemod.types.ts";
import type { LiteralFinding } from "../../types/analyzer.types.ts";
import { ROOT } from "@ssot/paths";
import { collectSpellingFindings } from "../analyzers/word.analyzer.ts";
import { defineCheck } from "@govlab/context/check";
import { excludeMatcher } from "@govlab/quality/config";

const RULE_ID = "american-spelling";

const SPEC: ArgvSpec = {
    command: "node .govlab/codemods/entrypoints/word.entrypoint.ts",
    flags: [
        {
            describe: "a file or directory to rewrite, relative to the repository root",
            name: "--root",
            repeatable: true,
            takesValue: true,
        },
        {
            describe: "a file extension to include, such as .md; Markdown code spans and fenced blocks are skipped",
            name: "--ext",
            repeatable: true,
            takesValue: true,
        },
        { describe: "list every replacement without writing", name: "--map", takesValue: false },
        {
            describe: "report every British spelling as a finding and fail, without writing",
            name: "--check",
            takesValue: false,
        },
    ],
    summary: WORD_SUMMARY,
};

const argv = resolveArgv(SPEC);
const roots = flagValues(argv, "--root");
const extensions = flagValues(argv, "--ext");
const checking = hasFlag(argv, "--check");

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

const found = collectSpellingFindings({ extensions, roots, skipped: await excludeMatcher(ROOT, RULE_ID) });

applyCodemod({
    appliedNoun: "spelling(s) replaced",
    blockedMessage: (finding) => finding.reason ?? "",
    checks: defineCheck({ detects: [], enforces: ["architecture:semantic-consistency"] }),
    editsByFile: buildEdits,
    findings: checking ? found.map((finding) => ({ ...finding, reason: spellingHit(finding.to, RULE_ID) })) : found,
    gateOnBlocked: true,
    label: (finding) => `"${finding.from}" → "${finding.to}"`,
    programCount: roots.length,
    ruleId: RULE_ID,
    scopeNoun: "root(s)",
});
