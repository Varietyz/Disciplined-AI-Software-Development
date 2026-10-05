import { existsSync, readFileSync } from "node:fs";
import { isRecord, recordAt, stringField } from "#core/selectors/record.selector";
import { ADAPTER_SUFFIX } from "#configuration/constants/tool.constants";
import { CONCERNS } from "#configuration/constants/concern.constants";
import type { InstallRecord } from "#types/dependency.types";
import { absolutePath } from "@ssot/paths";
import { defineCheck } from "@govlab/context/check";
import { join } from "node:path";
import { jsonRecord } from "#core/parsers/record.parser";
import { loadDescriptors } from "#core/loaders/emitter.loader";
import { loadEcosystems } from "#core/loaders/ecosystem.loader";
import { loadInstallRegistry } from "#core/loaders/dependency.loader";
import { loadTools } from "#core/loaders/tool.loader";
import { validationFailed } from "#configuration/strings/validation.strings";

defineCheck({ detects: [], enforces: ["architecture:extension-points"] });

const JSON_LOG_INDENT = 2;
const INDEX_FILE = "index.generated.json";
const VALIDATOR = "polyglot-coverage";

const registryRecords: InstallRecord[] = loadInstallRegistry().records;
const descriptorTools = new Set(loadDescriptors().descriptors.map((descriptor) => descriptor.tool));

const runners = (await loadTools()).map((runner) => ({ ecosystems: [...runner.ecosystems], tool: runner.tool }));
const runnerTools = new Set(runners.map((r) => r.tool));
const runnerEcosystems = new Map<string, string[]>(runners.map((r) => [r.tool, r.ecosystems]));
const lintEcosystems = new Set(CONCERNS.lint.ecosystems);

const coversEcosystem = (tool: string, ecosystem: string): boolean =>
    (runnerEcosystems.get(tool) ?? []).includes(ecosystem);

const adaptersDir = absolutePath("govlab.quality.adapters");
const hasAdapter = (tool: string): boolean =>
    [`tool.${tool}${ADAPTER_SUFFIX}`, `${tool}${ADAPTER_SUFFIX}`].some((name) => existsSync(join(adaptersDir, name)));

const errors = [];
const unclassified = [];
let classified = 0;

const atOf = (record: InstallRecord): string => `polyglot-coverage[tool=${record.tool}]`;

const runnerErrors = function runnerErrors(record: InstallRecord, kind: string): string[] {
    const at = atOf(record);
    if (!runnerTools.has(record.tool)) {
        return [`${at}: ${kind} but "${record.tool}" registers no tool adapter`];
    }
    if (!coversEcosystem(record.tool, record.ecosystem)) {
        return [
            `${at}: ${kind} but the tool adapter for "${record.tool}" does not include its registry ecosystem "${record.ecosystem}" — the engine would never dispatch it`,
        ];
    }
    return [];
};

const adapterErrors = function adapterErrors(record: InstallRecord, kind: string): string[] {
    if (record.emitter === "none" && !hasAdapter(record.tool)) {
        return [
            `${atOf(record)}: ${kind} requires an emit-descriptor OR a tool adapter that builds its config — has neither`,
        ];
    }
    return [];
};

const checkFullGate = function checkFullGate(record: InstallRecord): string[] {
    const errs = [...adapterErrors(record, "full-gate"), ...runnerErrors(record, "full-gate")];
    if (!lintEcosystems.has(record.ecosystem)) {
        errs.push(
            `${atOf(record)}: full-gate but ecosystem "${record.ecosystem}" is not in CONCERNS.lint.ecosystems — govlab lint would silently skip it`,
        );
    }
    return errs;
};

const checkExcluded = function checkExcluded(record: InstallRecord): string[] {
    const at = atOf(record);
    if (typeof record.reason !== "string" || record.reason.length === 0) {
        return [`${at}: excluded requires a "reason"`];
    }
    const lowered = record.reason.toLowerCase();
    const banned = ["redundant", "subsumed by", "double-configure", "double-gate", "double-report"];
    const hit = banned.find((phrase) => lowered.includes(phrase));
    return typeof hit === "string"
        ? [
              `${at}: excluded reason claims redundancy ("${hit}") — an overlapping tool is a consumer CHOICE (disposition selectable | advisory), never excluded-as-redundant`,
          ]
        : [];
};

const CHECKERS: Record<string, (record: InstallRecord) => string[]> = {
    advisory: (record: InstallRecord) => runnerErrors(record, "advisory"),
    excluded: checkExcluded,
    "full-gate": checkFullGate,
    selectable: (record: InstallRecord) => [
        ...adapterErrors(record, "selectable"),
        ...runnerErrors(record, "selectable"),
    ],
};

for (const record of registryRecords) {
    if (!record.isPlugin) {
        const { disposition } = record;
        if (disposition === undefined) {
            unclassified.push(record.tool);
        } else {
            classified += 1;
            const checker = CHECKERS[disposition];
            errors.push(
                ...(checker
                    ? checker(record)
                    : [
                          `${atOf(record)}: unknown disposition "${disposition}" (expected ${Object.keys(CHECKERS).join(" | ")})`,
                      ]),
            );
        }
    }
}

for (const tool of unclassified) {
    errors.push(
        `polyglot-coverage[tool=${tool}]: no disposition — classify as ${Object.keys(CHECKERS).join(" | ")}, and give an excluded tool a reason`,
    );
}

if (descriptorTools.size > 0) {
    for (const record of registryRecords) {
        if (record.disposition === "full-gate" && record.emitter === "none" && descriptorTools.has(record.tool)) {
            errors.push(
                `polyglot-coverage[tool=${record.tool}]: emitter "none" yet an emit-descriptor exists — reconcile the registry emitter`,
            );
        }
    }
}

const classification = loadEcosystems();
const catalogIndex = jsonRecord(readFileSync(absolutePath("govlab.quality.generated", INDEX_FILE), "utf8"));
const catalogEcosystems = recordAt(catalogIndex, "byEcosystem");

const classificationErrors = function classificationErrors(ecosystem: string, entry: unknown): string[] {
    const at = `polyglot-coverage[ecosystem=${ecosystem}]`;
    if (!isRecord(entry)) {
        return [`${at}: the catalog lists this ecosystem, and the ecosystem classification has no entry for it`];
    }
    if (entry["kind"] === "exclude") {
        return stringField(entry, "reason").length > 0 ? [] : [`${at}: an excluded ecosystem requires a "reason"`];
    }
    const { markers } = entry;
    return Array.isArray(markers) && markers.length > 0
        ? []
        : [`${at}: a detectable ecosystem requires at least one root marker file`];
};

for (const ecosystem of Object.keys(catalogEcosystems)) {
    errors.push(...classificationErrors(ecosystem, classification[ecosystem]));
}
for (const ecosystem of Object.keys(classification).filter((name) => !(name in catalogEcosystems))) {
    errors.push(
        `polyglot-coverage[ecosystem=${ecosystem}]: the classification names an ecosystem the catalog does not list`,
    );
}

if (errors.length > 0) {
    process.stderr.write(validationFailed(VALIDATOR));
    for (const error of errors) {
        process.stderr.write(`  - ${error}\n`);
    }
    process.exit(1);
}

process.stdout.write(`${JSON.stringify({ classified, tool: VALIDATOR }, null, JSON_LOG_INDENT)}\n`);
