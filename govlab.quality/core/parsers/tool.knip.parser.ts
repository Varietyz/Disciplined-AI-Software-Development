import { UNUSED_FILE, UNUSED_LABELS, unusedItem } from "#configuration/strings/tool.strings";
import { isRecord, numberField, stringField } from "#core/selectors/record.selector";
import type { Finding } from "#types/finding.types";
import { POSITION } from "#configuration/constants/tool.constants";
import { jsonRecordsAt } from "#core/parsers/record.parser";
import { toolFinding } from "#core/factories/finding.factory";

const TOOL = "knip";
const FILE_RULE_ID = "knip/files";
const CATEGORY_KEYS = [
    "exports",
    "types",
    "dependencies",
    "devDependencies",
    "unlisted",
    "unresolved",
    "duplicates",
    "binaries",
];

export const isUnusedFile = function isUnusedFile(files: unknown): boolean {
    return Array.isArray(files) ? files.length > 0 : files === true;
};

const itemName = function itemName(item: unknown): string {
    if (typeof item === "string") {
        return item;
    }
    const record = isRecord(item) ? item : {};
    return stringField(record, "name") || stringField(record, "symbol");
};

const itemFinding = function itemFinding(
    item: unknown,
    context: { ecosystem: string; file: string; key: string },
): Finding {
    const located = isRecord(item) ? item : {};
    return toolFinding({
        column: numberField(located, "col", POSITION),
        ecosystem: context.ecosystem,
        file: context.file,
        line: numberField(located, "line", POSITION),
        message: unusedItem(UNUSED_LABELS[context.key] ?? context.key, itemName(item)),
        ruleId: `${TOOL}/${context.key}`,
        tool: TOOL,
    });
};

const issueFindings = function issueFindings(issue: Record<string, unknown>, ecosystem: string): Finding[] {
    const file = stringField(issue, "file");
    const unusedFile = isUnusedFile(issue["files"])
        ? [
              toolFinding({
                  column: POSITION,
                  ecosystem,
                  file,
                  line: POSITION,
                  message: UNUSED_FILE,
                  ruleId: FILE_RULE_ID,
                  tool: TOOL,
              }),
          ]
        : [];
    const items = CATEGORY_KEYS.flatMap((key) => {
        const value = issue[key];
        return Array.isArray(value) ? value.map((item) => itemFinding(item, { ecosystem, file, key })) : [];
    });
    return [...unusedFile, ...items];
};

export const parseKnipOutput = function parseKnipOutput(stdout: string, ecosystem: string): Finding[] {
    return stdout.length > 0 ? jsonRecordsAt(stdout, "issues").flatMap((issue) => issueFindings(issue, ecosystem)) : [];
};
