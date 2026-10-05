import { dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { writeCanonicalJson } from "@govlab/canonical-write";

export const persistReport = async function persistReport(target: string, report: unknown): Promise<void> {
    mkdirSync(dirname(target), { recursive: true });
    await writeCanonicalJson(target, report);
};
