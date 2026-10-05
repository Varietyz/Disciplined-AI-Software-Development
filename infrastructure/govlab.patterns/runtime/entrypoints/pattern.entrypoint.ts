import {
    COMMANDS,
    DEFAULT_RESULTS,
    DEFAULT_SYNTH_COUNT,
    FAILURE_EXIT,
    JSON_INDENT,
    PATTERN_FLAG_NAMES,
    SNAPSHOT_DIR,
} from "#configuration/constants/invocation.constants";
import { type ParsedArgv, flagValue, numberFlag, resolveArgv } from "@govlab/argv";
import { analyzeRefusal, analyzeWrote, unknownCommand, windowWrote } from "#configuration/strings/pattern.strings";
import { inferMapping, unrepresentable } from "#core/resolvers/representation.resolver";
import { mkdirSync, readFileSync } from "node:fs";
import type { AnalyzeOptions } from "#types/record.types";
import { DataLoadError } from "#core/classifiers/schema.classifier";
import { PATTERN_ARGV } from "#configuration/configs/invocation.config";
import { detectSchema } from "#core/analyzers/schema.analyzer";
import { isRecord } from "#core/predicates/record.predicate";
import { isRepresentation } from "#core/predicates/representation.predicate";
import { join } from "node:path";
import { loadRecords } from "#core/loaders/record.loader";
import process from "node:process";
import { report } from "#core/pipelines/record.pipeline";
import { schemaFromDict } from "#core/parsers/schema.parser";
import { synthesize } from "#core/factories/record.factory";
import { validateRecord } from "#core/validators/schema.validator";
import { windowedReports } from "#core/pipelines/snapshot.pipeline";
import { writeCanonicalJson } from "@govlab/canonical-write";

type Command = (path: string, argv: ParsedArgv) => Promise<void>;

const readJson = function readJson(path: string): unknown {
    return JSON.parse(readFileSync(path, "utf8"));
};

const jsonText = function jsonText(value: unknown): string {
    return `${JSON.stringify(value, null, JSON_INDENT)}\n`;
};

const writeOrEmit = async function writeOrEmit(value: unknown, output: string | undefined): Promise<void> {
    if (output === undefined) {
        process.stdout.write(jsonText(value));
        return;
    }
    await writeCanonicalJson(output, value);
};

const loadMapping = function loadMapping(path: string): Map<string, readonly string[]> {
    const parsed = readJson(path);
    const entries = isRecord(parsed) ? Object.entries(parsed) : [];
    return new Map(
        entries.map(([field, value]): [string, string[]] => [
            field,
            Array.isArray(value) ? value.filter(isRepresentation) : [],
        ]),
    );
};

const analyzeOptions = function analyzeOptions(argv: ParsedArgv, floatFields: ReadonlySet<string>): AnalyzeOptions {
    const mappingPath = flagValue(argv, PATTERN_FLAG_NAMES.mapping);
    return mappingPath === undefined ? { floatFields } : { floatFields, mapping: loadMapping(mappingPath) };
};

const assertRepresentable = function assertRepresentable(records: readonly unknown[], options: AnalyzeOptions): void {
    if (records.length === 0) {
        return;
    }
    const schema = detectSchema(records, options.floatFields);
    if ((options.mapping ?? inferMapping(schema)).size === 0) {
        throw new DataLoadError(
            analyzeRefusal(
                unrepresentable(schema)
                    .map((field) => field.name)
                    .join(", "),
            ),
        );
    }
};

const streamWindows = async function streamWindows(
    records: readonly unknown[],
    size: number,
    options: AnalyzeOptions,
): Promise<void> {
    mkdirSync(SNAPSHOT_DIR, { recursive: true });
    await Promise.all(
        [...windowedReports(records, size, options)].map(async (snapshot) => {
            const file = join(SNAPSHOT_DIR, `${snapshot.count}.generated.json`);
            await writeCanonicalJson(file, snapshot.report);
            process.stdout.write(windowWrote(String(snapshot.count), String(snapshot.report.headline.findings), file));
        }),
    );
};

const analyzeCommand: Command = async function analyzeCommand(path, argv) {
    const { records, floatFields } = loadRecords(path);
    const options = analyzeOptions(argv, floatFields);
    assertRepresentable(records, options);
    const window = flagValue(argv, PATTERN_FLAG_NAMES.window);
    if (window !== undefined) {
        await streamWindows(records, Number(window), options);
    }
    const output = flagValue(argv, PATTERN_FLAG_NAMES.output) ?? DEFAULT_RESULTS;
    const result = report(records, options);
    await writeCanonicalJson(output, result);
    process.stdout.write(analyzeWrote(String(result.headline.findings), output));
};

const COMMAND_TABLE: ReadonlyMap<string, Command> = new Map<string, Command>([
    [
        COMMANDS.inspect,
        async function inspect(path, argv) {
            const { records, floatFields } = loadRecords(path);
            await writeOrEmit(detectSchema(records, floatFields), flagValue(argv, PATTERN_FLAG_NAMES.output));
        },
    ],
    [
        COMMANDS.plan,
        async function plan(path, argv) {
            const { records, floatFields } = loadRecords(path);
            const mapping =
                analyzeOptions(argv, floatFields).mapping ?? inferMapping(detectSchema(records, floatFields));
            await writeOrEmit(
                [...mapping].map(([field, representations]) => ({ field, representations })),
                flagValue(argv, PATTERN_FLAG_NAMES.output),
            );
        },
    ],
    [COMMANDS.analyze, analyzeCommand],
    [
        COMMANDS.synthesize,
        async function synthesizeCommand(path, argv) {
            const { records, floatFields } = loadRecords(path);
            const count = numberFlag(argv, PATTERN_FLAG_NAMES.count, DEFAULT_SYNTH_COUNT);
            const seed = numberFlag(argv, PATTERN_FLAG_NAMES.seed, 0);
            const synthesized = synthesize(records, { ...analyzeOptions(argv, floatFields), count, seed });
            await writeOrEmit(synthesized, flagValue(argv, PATTERN_FLAG_NAMES.output));
        },
    ],
    [
        COMMANDS.validate,
        async function validate(path, argv) {
            const { records, floatFields } = loadRecords(path);
            const schemaPath = flagValue(argv, PATTERN_FLAG_NAMES.schema);
            const schema =
                schemaPath === undefined ? detectSchema(records, floatFields) : schemaFromDict(readJson(schemaPath));
            for (const record of records) {
                validateRecord(record, schema);
            }
            const verdict = { fields: schema.length, records: records.length, valid: true };
            await writeOrEmit(verdict, flagValue(argv, PATTERN_FLAG_NAMES.output));
        },
    ],
]);

const argv = resolveArgv(PATTERN_ARGV);
const [operation = "", source = ""] = argv.positionals;
const command = COMMAND_TABLE.get(operation);

if (command === undefined) {
    process.stderr.write(`${unknownCommand(operation)}\n`);
    process.exitCode = FAILURE_EXIT;
} else {
    try {
        await command(source, argv);
    } catch (error) {
        if (!(error instanceof DataLoadError)) {
            throw error;
        }
        process.stderr.write(`${error.message}\n`);
        process.exitCode = FAILURE_EXIT;
    }
}
