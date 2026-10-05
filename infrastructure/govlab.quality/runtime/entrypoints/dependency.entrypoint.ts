import { recordAt, recordsAt, stringArrayField, stringField } from "#core/selectors/record.selector";
import { absolutePath } from "@ssot/paths";
import { defineCheck } from "@govlab/context/check";
import { jsonRecord } from "#core/parsers/record.parser";
import { readFileSync } from "node:fs";
import { validationFailed } from "#configuration/strings/validation.strings";

defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] });

const VALIDATOR = "install-registry";
const JSON_LOG_INDENT = 2;
const TOOLS_FILE = "tools.generated.json";

const rawTools = jsonRecord(readFileSync(absolutePath("govlab.quality.generated", TOOLS_FILE), "utf8"));
const tools = recordsAt(rawTools, "records").map((r) => ({
    ecosystem: stringField(r, "ecosystem"),
    name: stringField(r, "name"),
}));

const rawRegistry = jsonRecord(readFileSync(absolutePath("govlab.quality.data.registry"), "utf8"));
const registryRecords = recordsAt(rawRegistry, "records");
const noNativeDescriptor = stringArrayField(recordAt(rawRegistry, "coverage"), "noNativeDescriptor");

const toolIds = new Set(tools.map((t) => t.name));
const errors: string[] = [];

const checkPluginFields = function checkPluginFields(record: Record<string, unknown>, at: string): void {
    for (const field of ["pluginNamespace", "ruleIdPrefix", "npm"]) {
        const fieldValue = record[field];
        if (typeof fieldValue !== "string" || fieldValue === "") {
            errors.push(`${at}: isPlugin requires "${field}"`);
        }
    }
};

for (const record of registryRecords) {
    const tool = stringField(record, "tool");
    const at = `install-registry[tool=${tool}]`;
    const catalogRules = record["catalogRules"] !== false;
    if (catalogRules && !toolIds.has(tool)) {
        errors.push(
            `${at}: unknown tool id — not in tools.generated.json (mark catalogRules:false for a governing tool with no catalog rules)`,
        );
    }
    if (!catalogRules && toolIds.has(tool)) {
        errors.push(
            `${at}: catalogRules:false but the tool IS in tools.generated.json — it contributes rules, remove the flag`,
        );
    }
    const hasNpm = typeof record["npm"] === "string" && record["npm"].length > 0;
    const hasSystem = typeof record["system"] === "string" && record["system"].length > 0;
    const installable = record["installable"] !== false;

    if (!installable) {
        if (typeof record["reason"] !== "string" || record["reason"].length === 0) {
            errors.push(`${at}: installable:false requires a "reason"`);
        }
        if (hasNpm || hasSystem) {
            errors.push(`${at}: installable:false must not carry npm/system`);
        }
    }
    if (installable && hasNpm === hasSystem) {
        errors.push(`${at}: exactly one of npm | system required (got npm=${hasNpm}, system=${hasSystem})`);
    }

    if (record["isPlugin"] === true) {
        checkPluginFields(record, at);
    }
    if (
        record["emitter"] === "native" &&
        (typeof record["configTarget"] !== "string" || record["configTarget"] === "")
    ) {
        errors.push(`${at}: emitter "native" requires a configTarget`);
    }
}

const recorded = new Set(registryRecords.map((r) => stringField(r, "tool")));
for (const tool of tools) {
    if (!recorded.has(tool.name)) {
        errors.push(
            `coverage: catalog tool "${tool.name}" (${tool.ecosystem}) has NO install-registry record — every catalogued tool must have one (installable:false + reason if it cannot be installed as a standalone package)`,
        );
    }
}

const noneTools = new Set(registryRecords.filter((r) => r["emitter"] === "none").map((r) => stringField(r, "tool")));
for (const tool of noNativeDescriptor) {
    if (!noneTools.has(tool)) {
        errors.push(`coverage.noNativeDescriptor[${tool}]: not an emitter:"none" record`);
    }
}

if (errors.length > 0) {
    process.stderr.write(validationFailed(VALIDATOR));
    for (const error of errors) {
        process.stderr.write(`  - ${error}\n`);
    }
    process.exit(1);
}

process.stdout.write(
    `${JSON.stringify(
        {
            governingNonRuleTools: registryRecords
                .filter((r) => r["catalogRules"] === false)
                .map((r) => stringField(r, "tool")),
            installable: registryRecords.filter((r) => r["installable"] !== false).length,
            notInstallable: registryRecords.filter((r) => r["installable"] === false).length,
            plugins: registryRecords.filter((r) => r["isPlugin"] === true).length,
            records: registryRecords.length,
            ruleToolCoverage: `${[...toolIds].filter((t) => recorded.has(t)).length}/${toolIds.size} catalog rule-tools have an install record`,
            tool: VALIDATOR,
        },
        null,
        JSON_LOG_INDENT,
    )}\n`,
);
