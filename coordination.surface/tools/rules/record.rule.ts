import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { checkSchema, checkTension, recordFinding as finding } from "../core/validators/record.validator.ts";
import { citedIds, readRecordDocument } from "../core/readers/record.reader.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { INTEL_ROOT } from "../core/constants/template.constants.ts";

const CITATION_KEYS = ["conflicts", "with", "compatible", "incompatible", "see"] as const;

type RecordDocument = ReturnType<typeof readRecordDocument>;

type IntelRecord = RecordDocument["records"][number];

const citationFindings = function citationFindings(
    path: string,
    record: IntelRecord,
    known: ReadonlySet<string>,
): Finding[] {
    return CITATION_KEYS.flatMap((key) => {
        const value = record.keys[key];
        const cited = value === undefined ? [] : citedIds(value);
        return cited
            .filter((id) => !known.has(id))
            .map((id) =>
                finding(
                    "unresolvedCitation",
                    path,
                    record.line,
                    `${record.id} ${key}`,
                    `${id} does not resolve to a record`,
                    "correct the id or drop the citation — a citation that resolves to nothing errors nowhere and disconnects the graph silently",
                ),
            );
    });
};

const typedFindings = function typedFindings(path: string, record: IntelRecord, document: RecordDocument): Finding[] {
    if (document.shape !== "typed") {
        return [];
    }
    return [...checkSchema(path, record), ...(record.keys["type"] === "tension" ? checkTension(path, record) : [])];
};

const documentFindings = function documentFindings(
    path: string,
    document: RecordDocument,
    known: ReadonlySet<string>,
): Finding[] {
    return document.records.flatMap((record, index) => {
        const repeated = document.records.slice(0, index).some((earlier) => earlier.id === record.id);
        const duplicate = repeated
            ? [
                  finding(
                      "duplicateId",
                      path,
                      record.line,
                      record.id,
                      `${record.id} is declared more than once`,
                      "record ids are stable and unique; renumber the later one rather than reusing an id another record already answers to",
                  ),
              ]
            : [];
        return [...duplicate, ...citationFindings(path, record, known), ...typedFindings(path, record, document)];
    });
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const paths = context.paths.filter((path) => path.startsWith(INTEL_ROOT));
        const parsed = paths.map((path) => ({ document: readRecordDocument(context.read(path)), path }));
        const known = new Set(parsed.flatMap(({ document }) => document.records.map((record) => record.id)));
        const findings = parsed.flatMap(({ document, path }) => documentFindings(path, document, known));

        return {
            derivations: {
                reached: paths,
                recordsWalked: [...known].toSorted((left, right) => left.localeCompare(right, "en")),
                skippedAsOutsideRecordRoot: context.paths.filter((path) => !path.startsWith(INTEL_ROOT)),
            },
            findings,
            healed: [],
        };
    },
    extensions: [".md"],
    heals: false,
    invariant: "every typed intel record carries its required keys and every cited record id resolves",
    jurisdiction: "taxonomy",
    kinds: [
        "disputedNotSurfaced",
        "duplicateId",
        "kindContradiction",
        "missingKey",
        "missingTensionKey",
        "unknownDerivation",
        "unknownKind",
        "unknownTier",
    ],

    stage: "content",
};
