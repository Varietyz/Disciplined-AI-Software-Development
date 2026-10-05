import { existsSync, readFileSync } from "node:fs";
import type { ExactReference } from "#types/anatomy.types";
import { parseBaseline } from "#core/converters/baseline.converter";
import { writeCanonicalJson } from "@govlab/canonical-write";

export const readBaseline = function readBaseline(file: string): readonly ExactReference[] {
    return existsSync(file) ? parseBaseline(readFileSync(file, "utf8")) : [];
};

export const persistBaseline = async function persistBaseline(
    file: string,
    baseline: readonly ExactReference[],
): Promise<void> {
    await writeCanonicalJson(file, baseline);
};
