export const REPORT_HEADING = "ontology resolution — govlab.context validating its own cross-references\n";

export const SUMMARY_ROWS = {
    aliasDefects: ["alias defects:", "an alias that repeats a name, folds to it, or collides with another record"],
    ambiguousReasonRefs: ["ambiguous reason refs:", "a bare reasoning ref that two kinds hold"],
    asciiArrows: ["ascii arrows:", "a field writing -> where the ontology writes →"],
    checkDeclarationDefects: [
        "check declaration defects:",
        "a check's declared ref that names no record or a record of the wrong kind",
    ],
    crossFaceIdCollisions: ["cross-face id collisions:", "arch id also a lex id"],
    danglingPrincipleRefs: ["algo→arch dangling refs:", ""],
    deadResolutionSeeds: ["dead resolution seeds:", "explicit resolution matching no live tensions_with edge"],
    doctypeModelAxis: [
        "doc-types without model/axis:",
        "a pag doc-type missing a resolvable reason model or dominant axis",
    ],
    duplicateIds: ["duplicate ids:", ""],
    emptyRequiredFields: ["empty required fields:", 'a required field with no value and no "none: <reason>"'],
    exemplarGaps: ["algo exemplar gaps:", "non-meta contract missing a before/after exemplar"],
    idShapedEdgeLabels: ["id-shaped edge labels:", "an edge label shaped like an id that resolves to no record"],
    invalidRecordDistincts: [
        "invalid record distincts:",
        "a distinctFrom that names no record, names the record itself, or gives no reason",
    ],
    invalidSeverities: ["invalid severities:", "a severity outside the closed levels"],
    kindConsistencyViolations: ["KIND↔definition conflicts:", "definition opens as a different kind"],
    lexDefects: ["lexicon term defects:", "bad kind / empty definition"],
    misspelledForces: [
        "misspelled forces:",
        "a force or scope that folds to a canonical force but is spelled differently",
    ],
    reasonOntologyDefects: [
        "reason ontology defects:",
        "reasoning collection internal integrity: dangling axis/mathType/stage/transition/edge",
    ],
    relationKindViolations: ["RELATION→KIND violations:", "resolved target whose kind is out of range"],
    repairDefects: [
        "repair defects:",
        "a repair ref that names no record or a record of a kind the field does not admit",
    ],
    secondCheckHomes: ["second check homes:", "a check named in the facet where the record already has a check field"],
    tagExampleDefects: [
        "tag example defects:",
        "a tag term whose example is missing, malformed or disagrees with its tag or folder",
    ],
    uncheckedRecords: [
        "unchecked records:",
        "a record with no check, or no population, freshness, refusal, observation, evidence sign or authority",
    ],
    uncoveredCollections: ["uncovered collections:", "a registered collection with no record in the check measurement"],
    undeclaredAdjacentPairs: [
        "undeclared adjacent pairs:",
        "two records of one kind, joined by an edge or listed under one relation, with no distinctFrom on either",
    ],
    ungroundedGates: ["ungrounded '-gate' records:", "a process-grammar *-gate record carrying no reason grounding"],
    ungroundedPagConstructs: [
        "ungrounded pag constructs:",
        "non-exempt pag keyword/production carrying no reason grounding — --list for the backlog",
    ],
    unknownForces: ["algo unknown forces:", ""],
    unknownRecordKeys: ["unknown record keys:", "a data key no loader reads, or an entry a loader drops"],
    unreachableAntiPatterns: ["unreachable anti-patterns:", "arch anti-pattern with no inbound conflicts_with"],
    unresolvedAlgoComposes: ["UNRESOLVED algo composes:", ""],
    unresolvedCheckRefs: ["unresolved check refs:", "a check or dependency ref that resolves to no record"],
    unresolvedExpressions: [
        "unresolved expressions:",
        "an expressedBy entry that is not a pag: reference, or names no PAG construct",
    ],
    unresolvedGrammarGrounds: ["ungrounded grammar gates:", "algo grounds ref that resolves to no reason axis"],
    unresolvedLensDetectors: [
        "unresolved lens detectors:",
        "reason lens detectedBy ref that resolves to no algo/pag/arch/lex record",
    ],
    unresolvedPagGrounds: [
        "unresolved pag grounds:",
        "pag grounds ref whose reasoning:<kind>:<id> is unknown or not in that kind",
    ],
    unresolvedReasonEdges: ["unresolved reason edges:", "reason cross-face edge target that resolves to nothing"],
    unresolvedShapeInstances: ["unresolved shape instances:", "a failure shape instance that resolves to no record"],
    unresolvedTensions: ["unresolved tensions:", "tensions_with edge with no derived/explicit resolution"],
} as const;

const noteSuffix = function noteSuffix(note: string): string {
    return note === "" ? "" : `  (${note})`;
};

export const summaryRow = function summaryRow(label: string, count: number, note: string): string {
    return `  ${label.padEnd(30)}${String(count)}${noteSuffix(note)}`;
};

export const lexiconTermsRow = function lexiconTermsRow(count: number): string {
    return summaryRow("lexicon terms:", count, "");
};

export const archEdgesRow = function archEdgesRow(count: number, targets: number): string {
    return summaryRow("UNRESOLVED arch edges:", count, `${String(targets)} distinct targets`);
};

export const pagTemplateRow = function pagTemplateRow(counts: readonly number[]): string {
    const [keywords = 0, slots = 0, verbless = 0, unknown = 0] = counts;
    return `  pag template/keyword defects: ${String(keywords)} dup-keyword, ${String(slots)} dangling-slot, ${String(verbless)} verbless-doctype, ${String(unknown)} unknown-template-type`;
};

export const pagRecognitionRow = function pagRecognitionRow(types: number, verbs: number): string {
    return `  pag recognition gaps:         ${String(types)} doc-type(s), ${String(verbs)} verb(s) declared but absent from the keyword vocabulary`;
};

export const pagBnfRow = function pagBnfRow(dangling: number, unused: number): string {
    return `  pag BNF integrity:            ${String(dangling)} dangling nonterminal(s), ${String(unused)} unused terminal(s) — every rhs <ref> resolves to a production or declared terminal`;
};

export const COVERAGE_HEADING = "\n  — check coverage (answered / records; declared absent in brackets) —";

export const coverageRow = function coverageRow(collection: string, records: number, cells: string): string {
    return `  ${collection} (${String(records)}): ${cells}`;
};

export const coverageCell = function coverageCell(question: string, answered: number, absent: number): string {
    const declaredAbsent = absent > 0 ? `[${String(absent)}]` : "";
    return `${question} ${String(answered)}${declaredAbsent}`;
};

export const unreachedRow = function unreachedRow(count: number): string {
    return `  arch records no edge reaches: ${String(count)}  (change propagation cannot arrive at them; coverage fact, not a defect)`;
};

export const NATIVE_HEADING = "\n  — reason-native + data-integrity (ZERO-TOLERANCE — counted in TOTAL) —";

export const nativeBacklogRow = function nativeBacklogRow(untyped: number, unstaged: number): string {
    return `  reason-native coverage backlog:   ${String(untyped)} untyped (no mathType/yields), ${String(unstaged)} unstaged process records`;
};

export const NATIVE_ROWS = {
    coherence: [
        "reason-native coherence defects:",
        "invalid stage/axis/mathType, stage↔axis, yields⊄shape, derivationMap",
    ],
    crossCatalog: [
        "duplicate concept candidates:",
        "two records in the two architecture catalogs whose titles share words; merge them or declare distinctFrom with a reason",
    ],
    divergent: ["intra-grammar symbol divergence:", "one nonterminal defined 2+ ways within ONE grammar"],
    duplicateLoops: ["duplicate loop groundings:", "a grammar with >1 record grounding reasoning:derivation-loop"],
    invalidDistincts: ["invalid distinct declarations:", "a distinctFrom that names no record or gives no reason"],
    metaKernels: ["meta records named -kernel:", "a meta composing-root should be named -concern, not -kernel"],
    metaLoops: ["meta loop groundings:", "a meta record grounding reasoning:derivation-loop; kernel must be non-meta"],
} as const;

export const nativeRow = function nativeRow(label: string, count: number, note: string): string {
    return `  ${label.padEnd(34)}${String(count)}  (${note})`;
};

export const symbolStalenessRow = function symbolStalenessRow(stale: boolean, indexed: number, live: number): string {
    return `  _symbols index staleness:         ${stale ? "STALE" : "current"}  (indexed ${String(indexed)} vs live ${String(live)} per-grammar symbols)`;
};

export const nativeSubtotalRow = function nativeSubtotalRow(subtotal: number): string {
    return `  reason-native + integrity subtotal: ${String(subtotal)}  (all counted in TOTAL)`;
};

export const totalRow = function totalRow(total: number): string {
    return `\n  TOTAL defects:                ${String(total)}`;
};

export const TARGETS_HEADING = "\n  distinct arch targets needing a home (the lex schema worklist):";

export const targetLine = function targetLine(target: string, count: number, trail: string): string {
    return `\n  ✖ "${target}"  ×${String(count)}${trail}`;
};

export const targetTrail = function targetTrail(sites: readonly string[], more: boolean): string {
    return `  [${sites.join(", ")}${more ? ", …" : ""}]`;
};

export const remediationLines = function remediationLines(target: string, id: string, lexDir: string): string[] {
    return [
        "      fix ONE (every reference must resolve to something):",
        `        RESOLVE — author a lexicon Term with id "${id}" under ${lexDir}.`,
        `        LINK    — if "${target}" is an existing principle under another spelling,`,
        "                  reference it by its canonical id so it resolves in the arch id space.",
        `        FREE    — if descriptive rather than a concept, change the edge entry to the`,
        `                  typed form { "label": "${target}" }.`,
    ];
};

export const moreTargets = function moreTargets(count: number): string {
    return `\n  … ${String(count)} more — run with --list for the full worklist + remediation.`;
};

export const COMPOSES_HEADING = "\n  algo composes with no target contract:";

export const composesLine = function composesLine(from: string, target: string): string {
    return `  ✖ ${from} composes "${target}" — no such contract id.`;
};

export const DIVERGENT_HEADING =
    "\n  intra-grammar divergent symbols (reconcile the two definitions within the grammar):";

export const divergentLine = function divergentLine(
    grammar: string,
    name: string,
    definedIn: readonly string[],
): string {
    return `[${grammar}] ${name} — defined differently by [${definedIn.join(", ")}]`;
};

export const CANDIDATES_HEADING =
    "\n  duplicate concept candidates (merge the pair, or declare distinctFrom with a reason):";

export const candidateLine = function candidateLine(a: string, b: string): string {
    return `${a} ↔ ${b}`;
};

export const BACKLOG_HEADING =
    "\n  reason-native coverage backlog (records lacking mathType/yields — the re-derivation worklist):";

export const NATIVE_LINES = {
    duplicateLoop: (domain: string, records: readonly string[]): string =>
        `grammar "${domain}" grounds reasoning:derivation-loop on ${String(records.length)} records [${records.join(", ")}] — one canonical whole-loop root per grammar`,
    invalidAxis: (id: string, axis: string): string => `${id} — axis "${axis}" resolves to no reason axis`,
    invalidMathType: (id: string, mathType: string): string =>
        `${id} — mathType "${mathType}" resolves to no reason math-type`,
    invalidStage: (id: string, stage: string): string => `${id} — stage "${stage}" is not a derivation-loop stage`,
    metaKernel: (id: string): string =>
        `${id} — a meta composing-root named "-kernel"; the meta root is named "-concern" (kernel is the non-meta realizer)`,
    metaLoop: (id: string): string =>
        `${id} — a meta record grounds reasoning:derivation-loop; the loop-realizing kernel must be non-meta`,
    stageAxis: (id: string, stage: string, expected: string, axis: string): string =>
        `${id} — stage "${stage}" expects axis "${expected}", carries "${axis}"`,
    yieldsShape: (id: string, yields: string, mathType: string, allowed: string): string =>
        `${id} — yields "${yields}" not within ${mathType} yieldsShape "${allowed}"`,
} as const;

export const PAG_LINES = {
    danglingNonterminal: (production: string, ref: string): string =>
        `pag production "${production}" references <${ref}> — not a defined production nor a declared terminal`,
    danglingSlot: (type: string, slot: string): string =>
        `pag template "${type}" declares slot "${slot}" absent from its body`,
    doctypeModelAxis: (type: string): string =>
        `pag doc-type "${type}" — missing a resolvable reason model or dominant axis`,
    duplicateKeyword: (id: string): string => `pag duplicate keyword id "${id}"`,
    ungroundedConstruct: (id: string): string => `pag construct "${id}" — non-exempt, carries no reason grounding`,
    unknownTemplateType: (type: string): string => `pag template type "${type}" resolves to no document-type`,
    unrecognizedType: (type: string): string =>
        `pag document-type "${type}" declared but has no document_type keyword (grammar can't recognize it)`,
    unrecognizedVerb: (type: string, verb: string): string =>
        `pag document-type "${type}" verb "${verb}" has no document_verb keyword`,
    unresolvedGround: (from: string, target: string): string =>
        `pag ${from} grounds "${target}" — unknown kind or id not in that reasoning collection`,
    unusedTerminal: (terminal: string): string =>
        `pag terminal "${terminal}" declared but referenced by no production rhs`,
    verbless: (type: string): string => `pag document-type "${type}" has no default verb / no verbs`,
} as const;

export const missingCheckIndex = function missingCheckIndex(file: string): string {
    return `✖ ontology resolution cannot check the check declarations: ${file} is missing. Run the rule indexer, which writes it before every gate run.`;
};

export const resolutionFailed = function resolutionFailed(total: number): string {
    return `\n✖ ontology resolution FAILED — ${String(total)} unresolved/untyped/stale defect(s) — zero tolerance`;
};

export const RESOLUTION_CLEAN = "\n✓ ontology resolution clean";

export const RESOLUTION_REPORT_ONLY = "\n(report-only — pass --strict to gate, --list for the full worklist)";

export const commandOf = function commandOf(entrypoint: string): string {
    return `node ${entrypoint}`;
};

export const RESOLUTION_SUMMARY =
    "Validate the ontology collections' cross-references and report every unresolved, untyped or stale record.";

export const DEBUG_FLAG = "write each collection's load notes to stderr";

export const LIST_FLAG = "print the full worklist with remediation";

export const STRICT_FLAG = "exit non-zero on any defect";

export const PAG_SUMMARY =
    "Validate every executable PAG document in the tree, the agents and the templates, against the grammar.";

export const PAG_HEADING = "pag documents — every agent and template validated against the grammar\n";

export const documentRow = function documentRow(clean: boolean, relative: string, count: number): string {
    return `  ${clean ? "✓" : "✖"} ${relative}: ${String(count)} defect(s)`;
};

export const defectRow = function defectRow(relative: string, line: number, code: string, token: string): string {
    return `      ${relative}:${String(line)} ${code} ${token}`;
};

export const documentsTotal = function documentsTotal(documents: number, total: number): string {
    return `\n  documents: ${String(documents)}   TOTAL defects: ${String(total)}`;
};

export const pagFailed = function pagFailed(total: number): string {
    return `\n✖ pag documents FAILED — ${String(total)} defect(s) — zero tolerance`;
};

export const PAG_CLEAN = "\n✓ pag documents clean";

export const PAG_REPORT_ONLY = "\n(report-only — pass --strict to gate)";

export const SYMBOLS_SUMMARY = "Regenerate the per-grammar symbol index the resolution gate compares against.";

export const symbolsGenerated = function symbolsGenerated(symbols: number, grammars: number): string {
    return `generated the symbol index: ${String(symbols)} per-grammar symbols across ${String(grammars)} grammars`;
};
