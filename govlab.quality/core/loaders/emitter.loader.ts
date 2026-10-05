import type { DescriptorFile, EmitTokens } from "#types/emitter.types";
import { absolutePath } from "@ssot/paths";
import { importFolder } from "#core/loaders/folder.loader";
import { isRecord } from "#core/selectors/record.selector";
import { jsonRecord } from "#core/parsers/record.parser";
import { readFileSync } from "node:fs";

const DESCRIPTOR_FILE = "emitter.data.json";
const TOKENS_FILE = "emit-tokens.generated.json";
const FORMATTER_SUFFIX = ".formatter.ts";

const isListOf = function isListOf<T>(value: unknown): value is T[] {
    return Array.isArray(value);
};

const isStringRecord = function isStringRecord(value: unknown): value is Record<string, string> {
    return isRecord(value) && Object.values(value).every((entry) => typeof entry === "string");
};

const isEmitTokens = function isEmitTokens(value: unknown): value is EmitTokens {
    return isRecord(value);
};

export const loadDescriptors = function loadDescriptors(): DescriptorFile {
    const raw = jsonRecord(readFileSync(absolutePath("govlab.quality.data", DESCRIPTOR_FILE), "utf8"));
    const { deferred, descriptors, pluginParent } = raw;
    return {
        deferred: isListOf<DescriptorFile["deferred"][number]>(deferred) ? deferred : [],
        descriptors: isListOf<DescriptorFile["descriptors"][number]>(descriptors) ? descriptors : [],
        pluginParent: isStringRecord(pluginParent) ? pluginParent : {},
    };
};

export const loadEmitTokens = function loadEmitTokens(): EmitTokens {
    const raw = jsonRecord(readFileSync(absolutePath("govlab.quality.generated", TOKENS_FILE), "utf8"));
    return isEmitTokens(raw["tokens"]) ? raw["tokens"] : {};
};

export const loadFormatters = async function loadFormatters(): Promise<void> {
    await importFolder("govlab.quality.formatters", FORMATTER_SUFFIX);
};
