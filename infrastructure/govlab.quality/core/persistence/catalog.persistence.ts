import type { CatalogProduct, CatalogWriter, KnobEntry } from "#types/catalog.types";
import { existsSync, readFileSync } from "node:fs";
import { writeCanonicalJson, writeCanonicalText, writeGeneratedMarkdown } from "@govlab/canonical-write";
import { absolutePath } from "@ssot/paths";
import { byRuleId } from "#core/comparators/rule.comparator";
import { govlabPrettierConfig } from "#core/adapters/tool.prettier.adapter";
import { isRecord } from "#core/selectors/record.selector";
import path from "node:path";

const SORT_LOCALE = "en";
const PRODUCT_SUFFIX = ".generated.json";
const KNOB_FILE = "knobs.generated.json";

export const catalogWriter = async function catalogWriter(): Promise<CatalogWriter> {
    const base = await govlabPrettierConfig(process.cwd());
    return {
        json: async (file, data): Promise<void> => {
            await writeCanonicalJson(file, data, base);
        },
        markdown: async (file, text): Promise<void> => {
            await writeGeneratedMarkdown(file, text, base);
        },
        text: async (file, text): Promise<void> => {
            await writeCanonicalText(file, text, base);
        },
    };
};

export const productFile = function productFile(source: string): string {
    return path.join(absolutePath("govlab.quality.catalog.generated"), `${source}${PRODUCT_SUFFIX}`);
};

export const writeProduct = async function writeProduct(writer: CatalogWriter, product: CatalogProduct): Promise<void> {
    const rules = product.rules.toSorted(byRuleId);
    await writer.json(productFile(product.source), { rules, summary: product.summary });
};

const knobFile = function knobFile(): string {
    return absolutePath("govlab.quality.generated", KNOB_FILE);
};

export const readKnobs = function readKnobs(): Record<string, unknown> {
    const file = knobFile();
    const parsed: unknown = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
    return isRecord(parsed) ? parsed : {};
};

export const writeKnobs = async function writeKnobs(
    writer: CatalogWriter,
    refreshed: ReadonlyMap<string, KnobEntry[]>,
): Promise<void> {
    const merged = { ...readKnobs(), ...Object.fromEntries(refreshed) };
    const sorted = Object.fromEntries(
        Object.keys(merged)
            .toSorted((a, b) => a.localeCompare(b, SORT_LOCALE))
            .map((name) => [name, merged[name]]),
    );
    await writer.json(knobFile(), sorted);
};
