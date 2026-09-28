import { MILESTONE_MARKER, PHASE_MARKER } from "../constants/checklist.constants.ts";
import type { PhaseSpan } from "../types/checklist.types.ts";

export const phaseSpans = function phaseSpans(lines: readonly string[]): PhaseSpan[] {
    const out: PhaseSpan[] = [];
    let title = "";
    let start = -1;
    let body: string[] = [];
    let band: string[] = [];

    const close = (): void => {
        if (start === -1) {
            return;
        }
        out.push({ band: band.join("\n"), line: start + 1, text: body.join("\n"), title });
    };

    for (const [index, line] of lines.entries()) {
        if (line.startsWith(PHASE_MARKER)) {
            close();
            title = line.slice(PHASE_MARKER.length).trim();
            start = index;
            body = [];
        } else if (line.startsWith(MILESTONE_MARKER)) {
            close();
            start = -1;
            body = [];
            band = [];
        } else if (start === -1) {
            band.push(line);
        } else {
            body.push(line);
        }
    }

    close();
    return out;
};
