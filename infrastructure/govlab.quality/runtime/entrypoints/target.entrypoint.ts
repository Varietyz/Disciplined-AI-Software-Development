import { ENFORCED_ES, TARGET_CONFIG_BASENAMES } from "#configuration/constants/target.constants";
import { FAILURE_EXIT, FLAGS } from "#configuration/constants/invocation.constants";
import { hasFlag, resolveArgv } from "@govlab/argv";
import {
    targetClean,
    targetFatal,
    targetFixed,
    targetLine,
    targetStale,
    targetSummary,
} from "#configuration/strings/target.strings";
import { TARGET_ARGV } from "#configuration/configs/invocation.config";
import { bumpEsTokens } from "#core/converters/target.converter";
import { defineCheck } from "@govlab/context/check";
import { excludeMatcher } from "#core/factories/exclusions.factory";
import { findStaleEsTokens } from "#core/matchers/target.matcher";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { safeReaddir } from "#core/loaders/source.loader";
import { writeVerbatim } from "@govlab/canonical-write";

defineCheck({ detects: [], enforces: ["architecture:standardization"] });

const REPLACEMENT = `ES${String(ENFORCED_ES)}`;

interface Offender {
    fixed: boolean;
    rel: string;
    tokens: string[];
}

const argv = resolveArgv(TARGET_ARGV);
const fix = hasFlag(argv, FLAGS.fix);
const [rootArg] = argv.positionals;
const root = rootArg === undefined ? process.cwd() : path.resolve(rootArg);
const isExcluded = await excludeMatcher(process.cwd());

const collectConfigs = async function collectConfigs(dir: string): Promise<string[]> {
    const entries = safeReaddir(dir);
    const here = entries
        .filter((entry) => !entry.isDirectory() && TARGET_CONFIG_BASENAMES.has(entry.name))
        .map((entry) => path.join(dir, entry.name));
    const subdirs = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(dir, entry.name))
        .filter((subdir) => !isExcluded(subdir));
    const nested = await Promise.all(subdirs.map(async (subdir) => collectConfigs(subdir)));
    return [...here, ...nested.flat()];
};

const inspectFile = async function inspectFile(file: string): Promise<Offender | null> {
    const text = await fs.readFile(file, "utf8");
    const stale = findStaleEsTokens(text, ENFORCED_ES);
    if (stale.length === 0) {
        return null;
    }
    const rel = path.relative(root, file).split("\\").join("/");
    const tokens = stale.map((entry) => entry.token);
    const result = fix ? bumpEsTokens(text, ENFORCED_ES, REPLACEMENT) : { changed: false, text };
    if (result.changed) {
        writeVerbatim(file, result.text);
        process.stdout.write(targetFixed(rel, tokens.join(", "), REPLACEMENT));
    }
    return { fixed: result.changed, rel, tokens };
};

const report = function report(offenders: readonly Offender[]): void {
    if (fix) {
        process.stdout.write(targetSummary(offenders.filter((offender) => offender.fixed).length, REPLACEMENT));
        return;
    }
    if (offenders.length === 0) {
        process.stdout.write(targetClean(REPLACEMENT));
        return;
    }
    process.stderr.write(targetStale(offenders.length, REPLACEMENT));
    for (const offender of offenders) {
        process.stderr.write(targetLine(offender.rel, offender.tokens.join(", ")));
    }
    process.exitCode = FAILURE_EXIT;
};

try {
    const inspected = await Promise.all((await collectConfigs(root)).map(inspectFile));
    report(inspected.filter((result): result is Offender => result !== null));
} catch (error: unknown) {
    process.stderr.write(targetFatal(error instanceof Error ? error.message : String(error)));
    process.exitCode = FAILURE_EXIT;
}
