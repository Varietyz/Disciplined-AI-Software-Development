import { AGENDA } from "../constants/blocking.constants.ts";
import { readFileSync } from "node:fs";

import { resolve } from "node:path";
import { writeRepair } from "../writers/repair.writer.ts";

export const writeAgendaIfUnmoved = function writeAgendaIfUnmoved(
    repoRoot: string,
    witnessed: string,
    rendered: string,
): boolean {
    const current = readFileSync(resolve(repoRoot, AGENDA), "utf8");
    if (current !== witnessed) {
        return false;
    }

    return writeRepair({ declared: "", repoRoot }, AGENDA, rendered).written;
};
