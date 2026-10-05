export const blockHeading = function blockHeading(header: string): string {
    return `\n  ${header}`;
};

export const failedItem = function failedItem(text: string): string {
    return `  ✖ ${text}`;
};

export const listedItem = function listedItem(text: string): string {
    return `  · ${text}`;
};

export const moreItems = function moreItems(count: number): string {
    return `  … ${String(count)} more — run with --list.`;
};

export const BLOCK_HEADINGS = {
    aliasDefects:
        "alias defects (drop an alias a lookup derives already, and give two records one alias only when each lists the other in distinctFrom):",
    ambiguousReasonRefs: "ambiguous reason refs (qualify the ref with its kind: reasoning:<kind>:<id>):",
    asciiArrows: "ascii arrows (write → in place of -> in the field):",
    checkDeclarationDefects:
        "check declaration defects (an enforces entry names a principle, a term or an invariant, and a detects entry names an anti-pattern, each by its kind-qualified id):",
    deadResolutionSeeds:
        "dead resolution seeds (re-key to the real edge endpoints, or delete — no dead override data):",
    emptyRequiredFields: 'empty required fields (write the value, or "none: <reason>" when the record has none):',
    exemplarGaps: "algo exemplar gaps (author a medium-typed before/after; code for patterns, composite for meta):",
    idShapedEdgeLabels: 'id-shaped edge labels (move the id into "to", or write the label as prose):',
    invalidRecordDistincts:
        "invalid record distincts (point distinctFrom at a collection-prefixed record and state the difference):",
    invalidSeverities:
        "invalid severities (use mandatory, recommended, contextual or discouraged; a condition goes in mandatoryFor):",
    misspelledForces: "misspelled forces (spell each exactly as the canonical force it names):",
    reasonOntologyDefects:
        "reason ontology defects (fix the reasoning collection data — a reference resolves to no record):",
    relationKindViolations: "relation→kind violations (the relational-sanity worklist — relabel / re-point in data):",
    repairDefects:
        "repair defects (point refactored_by at a technique, pattern or mechanism and violated_by at an anti-pattern, each by its kind-qualified id; only an anti-pattern carries formed_by):",
    secondCheckHomes: "second check homes (move the check into the record's own check field):",
    tagExampleDefects:
        "tag example defects (write the file the tag places in its folder, or the rename onto a covering tag):",
    uncheckedRecords:
        "unchecked records (read the record, then write its check: what checks it, over what, when it goes stale, where it refuses, what observes it, the evidence as fires, fires-and-accepts, contradicted or none with where it was watched, and which side is authoritative):",
    uncoveredCollections: "uncovered collections (add the collection's records to checkedRecordsOf):",
    undeclaredAdjacentPairs:
        "undeclared adjacent pairs (read both definitions; merge a duplicate into one record with an alias, or add distinctFrom with the difference):",
    ungroundedGates:
        'ungrounded \'-gate\' records (add a "grounds":["reasoning:<node>"] to each process-grammar gate):',
    unknownRecordKeys:
        "unknown record keys (read the key in the collection's loader and schema, or remove it from the data):",
    unreachableAntiPatterns: "unreachable anti-patterns (wire each to the principle it opposes via conflicts_with):",
    unresolvedCheckRefs: "unresolved check refs (point the ref at a real record id, kind-qualified):",
    unresolvedExpressions:
        "unresolved expressions (write pag:keyword:<category>:<keyword>, pag:production:<lhs>, pag:template:<type> or pag:document-type:<type>, naming a construct the grammar declares):",
    unresolvedGrammarGrounds: "ungrounded grammar gates (point grounds at a real reason axis id):",
    unresolvedLensDetectors: "unresolved lens detectors (point detectedBy at a real algo/pag/arch/lex record):",
    unresolvedReasonEdges:
        "unresolved reason edges (reconcile the target to a real algo/pag/arch/lex ref, or make it a {label}):",
    unresolvedShapeInstances: "unresolved shape instances (point the instance at a real record, collection-prefixed):",
    unresolvedTensions: "unresolved tensions (map each endpoint to a layer, or author an explicit resolution):",
} as const;

export const lexDefectLine = function lexDefectLine(id: string, reason: string): string {
    return `lex ${id}: ${reason}`;
};

export const collisionLine = function collisionLine(id: string): string {
    return `id collision: "${id}" exists in both arch and lex`;
};

export const kindConflictLine = function kindConflictLine(
    id: string,
    declared: string,
    opening: string,
    signals: string,
): string {
    return `${id}: declared "${declared}" but its definition opens "${opening}…" — the signature of "${signals}"`;
};

export const unreachableLine = function unreachableLine(id: string): string {
    return `${id} — no principle references it via conflicts_with; unreachable by traversal`;
};

export const reasonedLine = function reasonedLine(id: string, reason: string): string {
    return `${id} — ${reason}`;
};

export const tensionLine = function tensionLine(from: string, target: string, reason: string): string {
    return `${from} tensions_with "${target}" — ${reason}`;
};

export const misspelledLine = function misspelledLine(record: string, token: string, canonical: string): string {
    return `${record} names "${token}" — the canonical force is "${canonical}"`;
};

export const deadSeedLine = function deadSeedLine(from: string, target: string, reason: string): string {
    return `resolution "${from}" vs "${target}" — ${reason}`;
};

export const ungroundedGateLine = function ungroundedGateLine(gate: string): string {
    return `${gate} — a *-gate record with no reason grounding`;
};

export const fieldLine = function fieldLine(collection: string, id: string, field: string): string {
    return `${collection} ${id} ${field}`;
};

export const expressionLine = function expressionLine(from: string, target: string): string {
    return `${from} expressedBy "${target}"`;
};

export const pairLine = function pairLine(kind: string, a: string, b: string, basis: string): string {
    return `${kind}: ${a} ↔ ${b} (${basis})`;
};

export const distinctLine = function distinctLine(from: string, target: string, reason: string): string {
    return `${from} distinctFrom "${target}" — ${reason}`;
};

export const repairLine = function repairLine(ref: string, field: string, target: string, reason: string): string {
    return target.length === 0 ? `${ref} ${field} — ${reason}` : `${ref} ${field} "${target}" — ${reason}`;
};

export const aliasLine = function aliasLine(ref: string, alias: string, reason: string): string {
    return `${ref} alias "${alias}" — ${reason}`;
};

export const shapeInstanceLine = function shapeInstanceLine(shape: string, instance: string): string {
    return `failure shape ${shape} instance "${instance}"`;
};

export const ambiguousLine = function ambiguousLine(from: string, target: string, kinds: readonly string[]): string {
    return `${from} grounds "${target}" — held by ${kinds.join(", ")}`;
};

export const edgeLabelLine = function edgeLabelLine(from: string, label: string): string {
    return `edge from ${from} label "${label}"`;
};

export const checkRefLine = function checkRefLine(collection: string, id: string, field: string, ref: string): string {
    return `${collection} ${id} ${field} "${ref}"`;
};

export const declarationLine = function declarationLine(
    check: string,
    field: string,
    ref: string,
    resolved: boolean,
): string {
    return `${check} ${field} "${ref}" ${resolved ? "names a record of the wrong kind" : "names no record"}`;
};

export const uncheckedLine = function uncheckedLine(
    collection: string,
    id: string,
    missing: readonly string[],
): string {
    return `${collection} ${id} — missing ${missing.join(", ")}`;
};

export const unknownKeyLine = function unknownKeyLine(
    collection: string,
    record: string,
    key: string,
    reason: string,
): string {
    return `${collection} ${record} "${key}" — ${reason}`;
};

export const reasonEdgeLine = function reasonEdgeLine(target: string): string {
    return `reason edge → "${target}" — resolves to nothing`;
};

export const lensLine = function lensLine(lens: string, target: string): string {
    return `lens ${lens} detectedBy "${target}" — resolves to nothing`;
};

export const groundLine = function groundLine(from: string, target: string): string {
    return `${from} grounds "${target}" — no such reason id`;
};

export const relationLine = function relationLine(
    from: string,
    relation: string,
    target: string,
    kind: string,
    allowed: readonly string[],
): string {
    return `${from} ${relation} "${target}" — target is a ${kind}; ${relation} admits {${allowed.join(", ")}}`;
};
