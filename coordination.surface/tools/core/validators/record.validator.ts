import type { Finding } from "../types/segment.types.ts";
import type { RecordEntry } from "../types/record.types.ts";

export const REQUIRED = ["type", "statement", "confidence", "source"];

export const TENSION_REQUIRED = [
    "kind",
    "conflicts",
    "with",
    "axis",
    "cause",
    "resolution",
    "remediate",
    "compatible",
    "incompatible",
];

export const KINDS = ["apparent", "real"];

export const CONFIDENCE_TIERS = ["verified-local", "vendor-doc", "community", "inferred"];

export const DERIVATIONS = ["original", "adapted", "quoted"];

export const DISPUTED = "disputed";

export const recordFinding = function recordFinding(
    kind: string,
    path: string,
    line: number,
    locus: string,
    actual: string,
    decide: string,
): Finding {
    return {
        actual,
        expected: null,
        healed: false,
        line,
        locus,
        path,
        remediation: { action: "declare", decide, deterministic: false, from: locus, target: path, to: null },
        rule: `record/${kind}`,
        stack: [
            { check: "record", resolved: locus },
            { check: kind, resolved: "failed" },
        ],
    };
};

const NO_INCOMPATIBILITY = "none";

const outsideVocabulary = function outsideVocabulary(
    value: string | undefined,
    vocabulary: readonly string[],
): value is string {
    return value !== undefined && !vocabulary.includes(value);
};

const missingKeys = function missingKeys(
    path: string,
    record: RecordEntry,
    required: readonly string[],
    kind: string,
    explain: (key: string) => readonly [string, string],
): Finding[] {
    return required
        .filter((key) => record.keys[key] === undefined)
        .map((key) => {
            const [actual, decide] = explain(key);
            return recordFinding(kind, path, record.line, record.id, actual, decide);
        });
};

const tierFindings = function tierFindings(path: string, record: RecordEntry): Finding[] {
    const { confidence } = record.keys;
    return outsideVocabulary(confidence, CONFIDENCE_TIERS)
        ? [
              recordFinding(
                  "unknownTier",
                  path,
                  record.line,
                  record.id,
                  `${record.id} declares confidence "${confidence}"`,
                  `use a declared tier — ${CONFIDENCE_TIERS.join(", ")} — because precedence between evidence is decided by the tier, and a tier outside the vocabulary cannot be ranked against another. HOW a record came to be is a DIFFERENT axis and belongs in derivation — ${DERIVATIONS.join(", ")} — since material adapted from another source can be strong or weak evidence independently, so a word describing provenance cannot be ranked against one describing strength and pushing it into this vocabulary would leave the whole set unrankable`,
              ),
          ]
        : [];
};

const derivationFindings = function derivationFindings(path: string, record: RecordEntry): Finding[] {
    const { derivation } = record.keys;
    return outsideVocabulary(derivation, DERIVATIONS)
        ? [
              recordFinding(
                  "unknownDerivation",
                  path,
                  record.line,
                  record.id,
                  `${record.id} declares derivation "${derivation}"`,
                  `use a declared derivation — ${DERIVATIONS.join(", ")} — because an open provenance vocabulary reads as governed while resolving to nothing, exactly as an open tier would. The field is OPTIONAL and states how the record came to be; its strength stays in confidence`,
              ),
          ]
        : [];
};

const disputedFindings = function disputedFindings(path: string, record: RecordEntry): Finding[] {
    const surfaced = record.keys["see"] !== undefined || record.keys["detect"] !== undefined;
    return record.keys["status"] === DISPUTED && !surfaced
        ? [
              recordFinding(
                  "disputedNotSurfaced",
                  path,
                  record.line,
                  record.id,
                  `${record.id} is disputed but neither links a counterpart nor says how to resolve it`,
                  "a conflict is surfaced rather than silently resolved — either see the record that disagrees, or state in detect how a reader settles it; a disputed record carrying neither says something disagrees without saying what or how",
              ),
          ]
        : [];
};

export const checkSchema = function checkSchema(path: string, record: RecordEntry): Finding[] {
    return [
        ...missingKeys(path, record, REQUIRED, "missingKey", (key) => [
            `${record.id} has no ${key}`,
            `add ${key} — the contract requires it on every typed record, and a record missing one cannot be evaluated`,
        ]),
        ...tierFindings(path, record),
        ...derivationFindings(path, record),
        ...disputedFindings(path, record),
    ];
};

const kindFindings = function kindFindings(path: string, record: RecordEntry): Finding[] {
    const { kind } = record.keys;
    return outsideVocabulary(kind, KINDS)
        ? [
              recordFinding(
                  "unknownKind",
                  path,
                  record.line,
                  record.id,
                  `kind is "${kind}"`,
                  "kind is apparent or real — apparent means both principles survive once their domains separate, real means one must be chosen",
              ),
          ]
        : [];
};

const contradictionFindings = function contradictionFindings(path: string, record: RecordEntry): Finding[] {
    const { incompatible, kind } = record.keys;
    const namesIncompatibility = incompatible !== undefined && incompatible !== NO_INCOMPATIBILITY;

    if (kind === "apparent" && namesIncompatibility) {
        return [
            recordFinding(
                "kindContradiction",
                path,
                record.line,
                record.id,
                `kind is apparent while incompatible names "${incompatible}"`,
                "an apparent tension resolves by separating domains, so nothing is incompatible; set incompatible to none, or the tension is real",
            ),
        ];
    }

    return kind === "real" && incompatible === NO_INCOMPATIBILITY
        ? [
              recordFinding(
                  "kindContradiction",
                  path,
                  record.line,
                  record.id,
                  "kind is real while incompatible is none",
                  "a real tension is a genuine trade-off, so name what cannot hold together; if nothing cannot, the tension is apparent",
              ),
          ]
        : [];
};

export const checkTension = function checkTension(path: string, record: RecordEntry): Finding[] {
    return [
        ...missingKeys(path, record, TENSION_REQUIRED, "missingTensionKey", (key) => [
            `${record.id} is a tension and has no ${key}`,
            `add ${key} — a tension is a typed relation, and without every key it degrades to prose that cannot be resolved`,
        ]),
        ...kindFindings(path, record),
        ...contradictionFindings(path, record),
    ];
};
