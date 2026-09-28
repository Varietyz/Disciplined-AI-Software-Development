import {
    ACCUMULATOR_MARKER,
    HISTORY_HEADINGS,
    PAST_MARKERS,
    STATUS_MARKERS,
    TENSE_EXEMPT,
    TENSE_EXEMPT_ROOTS,
} from "../core/constants/tense.constants.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { contentDivides, contentIsImmutable } from "../../config/surface.config.ts";
import { enclosingRecord, itemSpanFlags } from "../core/analyzers/fence.analyzer.ts";
import type { Finding } from "../core/types/segment.types.ts";

const FENCE = "```";

const isAccumulator = function isAccumulator(path: string): boolean {
    const slash = path.lastIndexOf("/");
    const name = slash === -1 ? path : path.slice(slash + 1);
    return name.startsWith(ACCUMULATOR_MARKER);
};

interface Hit {
    readonly marker: string;
    readonly line: number;
    readonly text: string;
    readonly kind: string;
}

const CODE_MARK = "`";

const HEADING_MARK = "#";

const EXCERPT = 200;

const prose = function prose(line: string): string {
    let out = "";
    let inCode = false;

    for (const char of line) {
        if (char === CODE_MARK) {
            inCode = !inCode;
        } else {
            out += inCode ? "" : char;
        }
    }

    return out.toLowerCase();
};

const isLetter = function isLetter(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
};

const containsPhrase = function containsPhrase(text: string, phrase: string): boolean {
    let from = text.indexOf(phrase);

    while (from !== -1) {
        const before = from === 0 ? "" : (text[from - 1] ?? "");
        const afterIndex = from + phrase.length;
        const after = afterIndex >= text.length ? "" : (text[afterIndex] ?? "");

        if (!isLetter(before) && !isLetter(after)) {
            return true;
        }
        from = text.indexOf(phrase, from + 1);
    }

    return false;
};

const hitsIn = function hitsIn(raw: string, line: number): Hit[] {
    const text = prose(raw);
    if (text.length === 0) {
        return [];
    }

    const trimmed = raw.trim();
    const headings = raw.startsWith(HEADING_MARK) ? HISTORY_HEADINGS.filter((heading) => text.includes(heading)) : [];
    return [
        ...STATUS_MARKERS.filter((marker) => text.includes(marker)).map((marker) => ({
            kind: "retiredStatus",
            line,
            marker,
            text: trimmed,
        })),
        ...headings.map((marker) => ({ kind: "historySection", line, marker, text: trimmed })),
        ...PAST_MARKERS.filter((marker) => containsPhrase(text, marker)).map((marker) => ({
            kind: "pastTense",
            line,
            marker,
            text: trimmed,
        })),
    ];
};

const scan = function scan(source: string): Hit[] {
    const out: Hit[] = [];
    let fenced = false;

    for (const [index, raw] of source.split("\n").entries()) {
        const fence = raw.trimStart().startsWith(FENCE);
        if (!fence && !fenced) {
            out.push(...hitsIn(raw, index + 1));
        }
        fenced = fence ? !fenced : fenced;
    }

    return out;
};

const PAST_TENSE_DECIDE =
    "rewrite the sentence so it describes the current state, or move it to _changelogs.txt; a fact about third-party platform behavior is written in present tense and is not history";

const DECIDE_BY_KIND = new Map([
    [
        "retiredStatus",
        "delete the record rather than marking it — a retired record is history, and history has two homes",
    ],
    ["historySection", "move the section to _changelogs.txt — a governing document states what is true now"],
]);

const finding = function finding(path: string, hit: Hit, anchor: string | null): Finding {
    const decide = DECIDE_BY_KIND.get(hit.kind) ?? PAST_TENSE_DECIDE;

    return {
        actual: hit.text.slice(0, EXCERPT),
        expected: null,
        healed: false,
        line: hit.line,
        locus: anchor ?? hit.marker,
        path,
        remediation: { action: "none", decide, deterministic: false, from: hit.marker, target: path, to: null },
        rule: `tense/${hit.kind}`,
        stack: [
            { check: "exempt", resolved: "no" },
            { check: "mention", resolved: "no" },
            { check: "marker", resolved: hit.marker },
            { check: "anchor", resolved: anchor ?? "line" },
        ],
    };
};

export const TENSE_ROUTES = ["accumulator", "declared", "reached", "transient", "upstream"] as const;

type TenseRoute = (typeof TENSE_ROUTES)[number];

const tenseRoute = function tenseRoute(path: string): TenseRoute {
    if (TENSE_EXEMPT.includes(path)) {
        return "declared";
    }
    if (TENSE_EXEMPT_ROOTS.some((root) => path.startsWith(root))) {
        return "upstream";
    }
    if (isAccumulator(path)) {
        return "accumulator";
    }
    return contentIsImmutable(path) ? "transient" : "reached";
};

const surfaceFindings = function surfaceFindings(path: string, source: string): Finding[] {
    const hits = scan(source);
    if (!contentDivides(path)) {
        return hits.map((hit) => finding(path, hit, null));
    }

    const appendOnly = itemSpanFlags(source);
    const anchorOf = enclosingRecord(source);
    return hits.filter((hit) => appendOnly[hit.line - 1] !== true).map((hit) => finding(path, hit, anchorOf(hit.line)));
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const routed = context.paths.map((path) => ({ path, route: tenseRoute(path) }));
        const pathsOn = (route: TenseRoute): string[] =>
            routed.filter((entry) => entry.route === route).map((entry) => entry.path);

        const reached = pathsOn("reached");
        const skippedByDeclaredPath = pathsOn("declared");
        const skippedByUpstreamRoot = pathsOn("upstream");
        const skippedAsAccumulator = pathsOn("accumulator");
        const skippedAsTransientVenue = pathsOn("transient");
        const dividedSurfaces = reached.filter((path) => contentDivides(path));
        const findings = reached.flatMap((path) => surfaceFindings(path, context.read(path)));

        return {
            derivations: {
                anchorReason:
                    "on a surface whose declared lifetime DIVIDES, a finding's locus is the enclosing RECORD rather " +
                    "than a line, because such a surface only ever grows: every position any party appends moves every " +
                    "line below it, so a reported line points further above its subject at a constant rate while the " +
                    "report still reads as current, and a reader joining that line against the live file lands the " +
                    "finding in whichever span happened to grow. The record letter is the anchor an append cannot " +
                    "move. The line is kept beside it because it is exact at the moment of the run, and the two are " +
                    "told apart by the DECLARED lifetime rather than by the file's extension",
                dividedReason:
                    "a surface whose declared lifetime DIVIDES is scanned in its owner-rewritable region and skipped in " +
                    "its append-only one, because a finding on a span no party may rewrite is a report nobody can drain " +
                    "— the unreachable-remediation shape, whose cost lands on the findings beside it rather than on " +
                    "itself. The declaration decides THAT a surface splits and the span mechanism decides WHERE, so no " +
                    "prose is parsed and the one config stays the only truth",
                dividedSurfaces,
                reached,
                scanned: reached.length,
                skippedAsAccumulator,
                skippedAsTransientVenue,
                skippedByDeclaredPath,
                skippedByUpstreamRoot,
            },
            findings,
            healed: [],
        };
    },
    extensions: [".md"],
    heals: false,
    invariant:
        "every governed document that OUTLIVES its writing states what is true now and carries no history of this project; a transient surface is governed on its FORMAT and never on its content",
    jurisdiction: "taxonomy",
    kinds: ["retiredStatus", "historySection", "pastTense"],

    stage: "content",
};
