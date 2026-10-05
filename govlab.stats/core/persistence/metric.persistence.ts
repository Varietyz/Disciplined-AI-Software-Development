import { CENSUS_FILE } from "#configuration/constants/document.constants";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { writeGeneratedMarkdown } from "@govlab/canonical-write";

export const writeCensus = async function writeCensus(markdown: string, dir: string): Promise<string> {
    mkdirSync(dir, { recursive: true });
    const target = path.join(dir, CENSUS_FILE);
    await writeGeneratedMarkdown(target, markdown);
    return target;
};
