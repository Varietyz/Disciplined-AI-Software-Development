import type { PhaseSpan, ProtocolFinding } from "../types/checklist.types.ts";
import { MANDATORY_GATES } from "../constants/template.constants.ts";
import { TASK_MARKER } from "../constants/checklist.constants.ts";
import type { TemplateContract } from "../types/template.types.ts";
import { phaseSpans } from "../analyzers/checklist.analyzer.ts";

const CHECKED = "- [x]";

const GENESIS_LABEL = "genesis:";

const RIPPLE_LABEL = "ripple";

const RETIRED_FIELD = "RETIRED:";

const DISTRIBUTES = "DISTRIBUTES:";

const LOCUS_EXCERPT = 60;

const absent = function absent(haystack: string, needles: readonly string[]): string[] {
    return needles.filter((needle) => !haystack.includes(needle.toLowerCase()));
};

const opensWith = function opensWith(lines: readonly string[], marker: string): boolean {
    return lines.some((line) => line.trim().startsWith(marker));
};

const checkDocument = function checkDocument(lines: readonly string[], spans: readonly PhaseSpan[]): ProtocolFinding[] {
    if (!opensWith(lines, TASK_MARKER) && spans.length === 0) {
        return opensWith(lines, RETIRED_FIELD)
            ? []
            : [
                  {
                      actual: "the file carries the checklist concern and declares no task and no phase",
                      expected:
                          "a checklist declares tasks under phases, or carries the concern its content answers to",
                      kind: "notAChecklist",
                      line: 1,
                      locus: "document",
                  },
              ];
    }

    const gates = absent(lines.join("\n").toLowerCase(), MANDATORY_GATES);
    return gates.length === 0
        ? []
        : [
              {
                  actual: `the artifact names no result for ${gates.join(", ")}`,
                  expected: `every mandatory-always gate carries a result: ${MANDATORY_GATES.join(", ")}`,
                  kind: "gateUnnamed",
                  line: 1,
                  locus: gates.join(", "),
              },
          ];
};

const axisLabels = function axisLabels(keys: readonly string[]): string[] {
    return keys
        .map((key) => key.slice(key.lastIndexOf("_") + 1))
        .filter((letter) => letter.length > 0)
        .map((letter) => `${letter.toUpperCase()}:`);
};

const rippleBlock = function rippleBlock(body: string, dimensions: readonly string[]): string | null {
    const lower = body.toLowerCase();
    return lower.includes(RIPPLE_LABEL) || dimensions.length === 0 ? lower : null;
};

const isLetter = function isLetter(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
};

const namesStage = function namesStage(tail: string, stage: string): boolean {
    let from = tail.indexOf(stage);

    while (from !== -1) {
        const before = from === 0 ? "" : tail.charAt(from - 1);
        const after = tail.charAt(from + stage.length);
        if (!isLetter(before) && !isLetter(after)) {
            return true;
        }
        from = tail.indexOf(stage, from + 1);
    }

    return false;
};

const declaredStage = function declaredStage(text: string, stages: readonly string[]): boolean {
    return text
        .toLowerCase()
        .split("\n")
        .filter((line) => line.includes(GENESIS_LABEL))
        .map((line) => line.slice(line.indexOf(GENESIS_LABEL) + GENESIS_LABEL.length))
        .some((tail) => stages.some((stage) => namesStage(tail, stage)));
};

const phaseFindings = function phaseFindings(
    span: PhaseSpan,
    contract: TemplateContract,
    labels: readonly string[],
): ProtocolFinding[] {
    const body = span.text.toUpperCase();
    const axes = labels.filter((label) => !body.includes(label));
    const block = rippleBlock(span.text, contract.rippleDimensions);
    const ripple = block === null ? [...contract.rippleDimensions] : absent(block, contract.rippleDimensions);
    const staged = declaredStage(`${span.title}\n${span.text}\n${span.band}`, contract.genesisStages);
    const at = { line: span.line, locus: span.title };

    return [
        ...(axes.length === 0
            ? []
            : [
                  {
                      ...at,
                      actual: `the phase declares no ${axes.join(" ")} edge`,
                      expected: `every phase carries all ${String(labels.length)} dependency axes as labels: ${labels.join(" ")}`,
                      kind: "axesMissing",
                  },
              ]),
        ...(ripple.length === 0
            ? []
            : [
                  {
                      ...at,
                      actual: `the phase carries no ripple entry for ${ripple.join(", ")}`,
                      expected: `every phase carries all ${String(contract.rippleDimensions.length)} ripple dimensions, by name`,
                      kind: "rippleMissing",
                  },
              ]),
        ...(staged
            ? []
            : [
                  {
                      ...at,
                      actual: `the phase declares no ${GENESIS_LABEL} stage`,
                      expected: `${GENESIS_LABEL} naming a stage of the substrate cycle: ${contract.genesisStages.join(" → ")}`,
                      kind: "genesisMissing",
                  },
              ]),
    ];
};

const checkPhases = function checkPhases(spans: readonly PhaseSpan[], contract: TemplateContract): ProtocolFinding[] {
    const labels = axisLabels(contract.dependencyAxes);
    return spans.flatMap((span) => phaseFindings(span, contract, labels));
};

const checkCheckboxes = function checkCheckboxes(lines: readonly string[]): ProtocolFinding[] {
    return lines.flatMap((raw, index) => {
        const line = raw.trim();
        return line.startsWith(CHECKED)
            ? [
                  {
                      actual: "a future execution checkbox is pre-checked at generation",
                      expected: "generation gates are separate from execution gates, which ship unchecked",
                      kind: "precheckedGate",
                      line: index + 1,
                      locus: line.slice(0, LOCUS_EXCERPT),
                  },
              ]
            : [];
    });
};

export const scaffoldLabels = function scaffoldLabels(contract: TemplateContract): string[] {
    return [
        ...axisLabels(contract.dependencyAxes),
        ...contract.rippleDimensions.map((name) => name.toUpperCase()),
        ...contract.genesisStages.map((name) => name.toUpperCase()),
    ];
};

export const putToWork = function putToWork(lines: readonly string[]): boolean {
    return lines
        .map((line) => line.trim())
        .some((trimmed) => trimmed.startsWith(DISTRIBUTES) && trimmed.slice(DISTRIBUTES.length).trim().length > 0);
};

export const inspectProtocol = function inspectProtocol(
    lines: readonly string[],
    contract: TemplateContract,
): ProtocolFinding[] {
    const spans = phaseSpans(lines);

    return [
        ...checkDocument(lines, spans),
        ...(putToWork(lines) ? checkPhases(spans, contract) : []),
        ...checkCheckboxes(lines),
    ];
};
