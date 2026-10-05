import { existsSync, readFileSync } from "node:fs";
import type { RouteLedger } from "#types/route.types";
import { parseLedger } from "#core/converters/route.converter";
import { writeCanonicalJson } from "@govlab/canonical-write";

export const readLedger = function readLedger(file: string): RouteLedger {
    return existsSync(file) ? parseLedger(readFileSync(file, "utf8")) : {};
};

export const persistLedger = async function persistLedger(file: string, ledger: RouteLedger): Promise<void> {
    await writeCanonicalJson(file, ledger);
};
