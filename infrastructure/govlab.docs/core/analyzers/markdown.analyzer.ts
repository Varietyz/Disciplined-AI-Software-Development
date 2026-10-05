import type { ConventionHit, Fence } from "#types/markdown.types";
import { NO_FENCE, bodyStart, codeLineMask, splitLines, stepFence } from "#core/parsers/markdown.parser";
import { isProsePath, nextToken, trimEdges } from "#core/selectors/markdown.selector";
import { blankMarkup } from "#core/converters/markdown.converter";

const CODE_LANGS: ReadonlySet<string> = new Set(
    "ts tsx js jsx mjs cjs go rs py java rb php c cpp cs kt swift scala".split(" "),
);
const FENCE_INTENTS: ReadonlySet<string> = new Set(["API", "EXAMPLE", "CODE", "CONFIG"]);
const BARE_FENCE = "```";
const LABEL_SEPARATOR = ":";

const fenceRunLength = function fenceRunLength(trimmed: string): number {
    const char = trimmed.charAt(0);
    let run = 0;
    while (run < trimmed.length && trimmed.charAt(run) === char) {
        run += 1;
    }
    return run;
};

const langLabelHit = function langLabelHit(info: string, lineNo: number): ConventionHit | null {
    const space = info.indexOf(" ");
    const lang = space === -1 ? info : info.slice(0, space);
    if (!CODE_LANGS.has(lang)) {
        return null;
    }
    const rest = space === -1 ? "" : info.slice(space + 1).trim();
    const colon = rest.indexOf(LABEL_SEPARATOR);
    const intent = colon === -1 ? "" : rest.slice(0, colon).trim();
    return FENCE_INTENTS.has(intent) ? null : { code: "unlabeled-code-fence", col: 1, line: lineNo, token: lang };
};

const fenceHit = function fenceHit(trimmed: string, lineNo: number): ConventionHit | null {
    const info = trimmed.slice(fenceRunLength(trimmed)).trim();
    if (info.length === 0) {
        return { code: "untagged-code-fence", col: 1, line: lineNo, token: BARE_FENCE };
    }
    return langLabelHit(info, lineNo);
};

const barePathHits = function barePathHits(prose: string, lineNo: number): ConventionHit[] {
    const hits: ConventionHit[] = [];
    let at = 0;
    while (at < prose.length) {
        const span = nextToken(prose, at);
        const token = trimEdges(prose.slice(span.start, span.next));
        if (isProsePath(token)) {
            hits.push({ code: "bare-path", col: span.start + 1, line: lineNo, token });
        }
        at = span.next;
    }
    return hits;
};

class ConventionScanner {
    public readonly hits: ConventionHit[] = [];
    private fence: Fence = NO_FENCE;

    public feed(line: string, lineNo: number, masked: boolean): void {
        const trimmed = line.trim();
        const wasOpen = this.fence.open;
        this.fence = stepFence(trimmed, this.fence);
        const opened = !wasOpen && this.fence.open ? fenceHit(trimmed, lineNo) : null;
        if (opened !== null) {
            this.hits.push(opened);
        }
        if (!masked) {
            this.hits.push(...barePathHits(blankMarkup(line), lineNo));
        }
    }
}

export const conventionHits = function conventionHits(source: string): ConventionHit[] {
    const lines = splitLines(source);
    const start = bodyStart(lines);
    const mask = codeLineMask(lines, start);
    const scanner = new ConventionScanner();
    for (let at = start; at < lines.length; at += 1) {
        scanner.feed(lines[at] ?? "", at + 1, mask[at] ?? false);
    }
    return scanner.hits;
};
