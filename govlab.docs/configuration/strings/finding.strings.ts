export const barePathFix = function barePathFix(token: string): string {
    return `path in prose must be a code span — expected: \`${token}\``;
};

export const UNTAGGED_FENCE_FIX =
    "code fence must declare a language — expected: ```<lang>  (code fences add an intent label: ```<lang> API:|EXAMPLE:|CODE:|CONFIG: <detail>)";

export const unlabeledFenceFix = function unlabeledFenceFix(token: string): string {
    return `a ${token} fence needs an intent label — expected: \`\`\`${token} <API|EXAMPLE|CODE|CONFIG>: <detail>`;
};

export const findingLine = function findingLine(
    rel: string,
    line: number,
    col: number,
    code: string,
    text: string,
): string {
    return `✖ ${rel}:${line}:${col} [${code}] ${text}`;
};

export const brokenPathText = function brokenPathText(path: string): string {
    return `"${path}" does not exist`;
};

export const pathCollision = function pathCollision(path: string, count: number, sources: string): string {
    return `✖ ${path}:1:1 [path-collision] ${count} documents route here: ${sources}`;
};

export const deadScriptPath = function deadScriptPath(rel: string, script: string, path: string): string {
    return `✖ ${rel} [dead-script-path] script "${script}" runs "${path}" — does not exist`;
};

export const scriptSummary = function scriptSummary(dead: number, manifests: number): string {
    return `package scripts: ${dead} dead path(s) across ${manifests} manifest(s)`;
};

export const fixedDocument = function fixedDocument(rel: string): string {
    return `✓ ${rel}`;
};

export const fixSummary = function fixSummary(count: number): string {
    return `govlab.docs fix: backticked bare paths in ${count} document(s)`;
};

export const deadScriptsFailure = function deadScriptsFailure(count: number): string {
    return `govlab.docs: ${count} dead package-script path(s) — failing`;
};

export const strictFailure = function strictFailure(count: number): string {
    return `govlab.docs: ${count} doc finding(s) — failing (--strict)`;
};

export const validateSummary = function validateSummary(scanned: number, withFindings: number, parts: string): string {
    return `govlab.docs validate: scanned ${scanned} document(s) — ${parts} across ${withFindings} doc(s)`;
};

export const tallyPart = function tallyPart(count: number, label: string): string {
    return `${count} ${label}`;
};

export const SUMMARY_LABELS = {
    agentSchema: "agent-schema",
    broken: "broken path",
    collision: "path-collision",
    conventions: "convention",
    deadEdge: "dead-edge",
    docStatus: "doc-status",
    location: "doc-location",
    mermaid: "mermaid-hardening",
    name: "doc-name",
    ontologyRefs: "ontology-ref",
    refs: "ref-construct",
    refsResolved: "ref",
    sections: "section-spine",
    slotRefs: "slot-ref",
    smell: "history-smell",
    spine: "spine",
    syntax: "mermaid-syntax",
} as const;
