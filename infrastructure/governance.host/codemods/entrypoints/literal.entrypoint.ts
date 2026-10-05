import { EMPTY_FROM, LITERAL_SUMMARY, ROOT_REQUIRED, UNPAIRED_FROM } from "../strings/codemod.strings.ts";
import { applyCodemod, refuse } from "../selectors/codemod.selector.ts";
import { flagValues, resolveArgv } from "@govlab/argv";
import type { ArgvSpec } from "@govlab/argv";
import type { Edit } from "../../types/codemod.types.ts";
import type { LiteralFinding } from "../../types/analyzer.types.ts";
import { collectLiteralFindings } from "../analyzers/literal.analyzer.ts";
import { defineCheck } from "@govlab/context/check";

const RULE_ID = "exact-literal-replace";

const SPEC: ArgvSpec = {
    command: "node .govlab/codemods/entrypoints/literal.entrypoint.ts",
    flags: [
        {
            describe: "the exact text to find, paired by position with --to",
            name: "--from",
            repeatable: true,
            takesValue: true,
        },
        {
            describe: "the exact text that replaces the --from at the same position",
            name: "--to",
            repeatable: true,
            takesValue: true,
        },
        {
            describe: "a file or directory to search, relative to the repository root",
            name: "--root",
            repeatable: true,
            takesValue: true,
        },
        {
            describe: "limit the search to files with this extension, such as .json",
            name: "--ext",
            repeatable: true,
            takesValue: true,
        },
        { describe: "list every match without writing", name: "--map", takesValue: false },
    ],
    summary: LITERAL_SUMMARY,
};

const argv = resolveArgv(SPEC);
const froms = flagValues(argv, "--from");
const tos = flagValues(argv, "--to");
const roots = flagValues(argv, "--root");

if (froms.length === 0 || froms.length !== tos.length) {
    refuse(UNPAIRED_FROM);
}
if (froms.some((from) => from.length === 0)) {
    refuse(EMPTY_FROM);
}
if (roots.length === 0) {
    refuse(ROOT_REQUIRED);
}

const pairs = froms.map((from, index) => ({ from, to: tos[index] ?? "" }));

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
    appliedNoun: "exact match(es) replaced",
    blockedMessage: (finding) => finding.reason ?? "",
    checks: defineCheck({ detects: [], enforces: [] }),
    editsByFile: buildEdits,
    findings: collectLiteralFindings(roots, pairs, flagValues(argv, "--ext")),
    gateOnBlocked: true,
    label: (finding) => `"${finding.from}" → "${finding.to}"`,
    programCount: roots.length,
    ruleId: RULE_ID,
    scopeNoun: "root(s)",
});
