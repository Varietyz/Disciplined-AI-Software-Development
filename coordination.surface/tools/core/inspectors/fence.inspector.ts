import type { BoardRecord, Delimiter } from "../types/board.types.ts";
import type { Finding } from "../types/segment.types.ts";
import { boardFinding } from "../factories/board.factory.ts";
import { delimitersIn } from "../analyzers/fence.analyzer.ts";
import { itemSpans } from "../resolvers/sweep.resolver.ts";
import { letterOfLabel } from "./board.inspector.ts";

const ORDINAL_SEPARATOR = "-";

interface FenceCounts {
    opens: number;
    closes: number;
    line: number;
}

interface RecordSpan {
    readonly agent: string;
    readonly from: number;
    readonly through: number;
}

interface Fence {
    readonly open: number;
    readonly close: number;
}

const recordSpans = function recordSpans(source: string): RecordSpan[] {
    const opens = new Map<string, number>();
    const counted = new Map<string, number>();
    const out: RecordSpan[] = [];

    for (const mark of delimitersIn(source).filter((each) => !each.agent.includes(ORDINAL_SEPARATOR))) {
        counted.set(mark.agent, (counted.get(mark.agent) ?? 0) + 1);
        const from = opens.get(mark.agent);

        if (mark.open) {
            opens.set(mark.agent, mark.line);
            continue;
        }
        if (from !== undefined) {
            opens.delete(mark.agent);
            out.push({ agent: mark.agent, from, through: mark.line });
        }
    }

    return out.filter((span) => counted.get(span.agent) === 2);
};

export const checkItemLetters = function checkItemLetters(source: string): Finding[] {
    const records = recordSpans(source);

    return itemSpans(source).flatMap((item) => {
        const line = item.from + 1;
        const holder = records.find((record) => record.from < line && record.through > line);
        if (holder === undefined || holder.agent === item.agent) {
            return [];
        }

        return [
            boardFinding(
                "foreignItemLetter",
                line,
                item.key,
                `item ${item.key} sits inside the record of ${holder.agent}, so its key letter and its holder disagree`,
                `item ${item.key} sits inside the record of ${item.agent}`,
                "one writer per record and one letter per item are the same claim read from two operands, and NOTHING COMPARES THEM — the fence-pair check counts each key's own markers and passes a perfectly formed item wherever it happens to sit, while the interleaving check matches a foreign FENCE and an item fence is not foreign to itself. So an item written into a peer's record is well-formed by both, and every mechanism keyed on the letter then reads a different answer depending on which operand it took: the drain resolves the item by its own key and finds it, the record owner reads it as content of their block and may not remove it, and an anchored edit on the holder's span covers text the holder never wrote. Move the item into the record its key names, or reopen it under the letter whose record it sits in — the two operands are both cheap to change and only their AGREEMENT is load-bearing. THIS DOES NOT REACH FOREIGN PROSE: text written into a peer's record with no fence at all carries no letter to compare, so it is invisible to this check and to every other, which is the reason the item mechanism needs a fence rather than a convention",
            ),
        ];
    });
};

const fenceCounts = function fenceCounts(source: string): Map<string, FenceCounts> {
    const seen = new Map<string, FenceCounts>();
    for (const mark of delimitersIn(source).filter((each) => each.agent.includes(ORDINAL_SEPARATOR))) {
        const held = seen.get(mark.agent) ?? { closes: 0, line: mark.line, opens: 0 };
        if (mark.open) {
            held.opens += 1;
        } else {
            held.closes += 1;
        }
        seen.set(mark.agent, held);
    }
    return seen;
};

export const checkItemFences = function checkItemFences(source: string): Finding[] {
    const unstamped = itemSpans(source)
        .filter((span) => span.at === 0)
        .map((span) =>
            boardFinding(
                "unstampedItem",
                span.from + 1,
                span.key,
                `item ${span.key} carries no allocated stamp`,
                `item ${span.key} opened by the tool, which allocates the stamp`,
                "the auto-sweep keys an item by the stamp the tool allocates, so a hand-opened fence is one the sweep can never take — and a hand edit is the sanctioned fallback when the tool is down, which makes that fallback a residue generator on the surface the tool exists to keep clean. The item is not stranded: a handler still drops it by id with an extraction, and this finding is what makes the explicit drain necessary rather than optional",
            ),
        );

    const malformed = [...fenceCounts(source)]
        .filter(([, counts]) => counts.opens !== 1 || counts.closes !== 1)
        .map(([key, counts]) =>
            boardFinding(
                "malformedItemFence",
                counts.line,
                key,
                `item ${key} carries ${String(counts.opens)} open and ${String(counts.closes)} close markers`,
                `item ${key} carries exactly one of each`,
                "the span tool returns a span only when exactly one open and one close exist for a key, so a duplicated or unclosed item fence makes that item permanently unremovable BY TOOL — and the repair is manual, on the one surface the item mechanism exists to stop repairing by hand. At item granularity there are roughly ten times as many fences as at record level, so the failure that never mattered before becomes the common one",
            ),
        );

    return [...unstamped, ...malformed];
};

const fenceOf = function fenceOf(markers: readonly Delimiter[], agent: string, line: number): Fence | null {
    const opens = markers.filter((mark) => mark.open && mark.agent === agent);
    const closes = markers.filter((mark) => !mark.open && mark.agent === agent);
    const [open] = opens;
    const [close] = closes;

    if (opens.length !== 1 || closes.length !== 1 || open === undefined || close === undefined) {
        return null;
    }
    return open.line < line && close.line > line ? { close: close.line, open: open.line } : null;
};

const intruderIn = function intruderIn(
    markers: readonly Delimiter[],
    agent: string,
    fence: Fence,
): Delimiter | undefined {
    const foreign = markers.filter((mark) => mark.agent !== agent && !mark.agent.startsWith(`${agent}-`));
    return foreign.find((mark) => mark.line > fence.open && mark.line < fence.close);
};

const delimiterFindings = function delimiterFindings(record: BoardRecord, markers: readonly Delimiter[]): Finding[] {
    const agent = letterOfLabel(record.label);
    const fence = fenceOf(markers, agent, record.line);

    if (fence === null) {
        return [
            boardFinding(
                "undelimitedRecord",
                record.line,
                record.label,
                `${record.label} is not enclosed by a matched delimiter pair`,
                `┌─── AGENT ${agent} above the record and └─── END AGENT ${agent} below it`,
                "an undelimited record has no anchor unique to its own writer, so a neighbor revising their block has nothing to edit against and reaches for a whole-file write instead — which succeeds, reports success to the one who overwrote, and says nothing to the one overwritten",
            ),
        ];
    }

    const intruder = intruderIn(markers, agent, fence);
    return intruder === undefined
        ? []
        : [
              boardFinding(
                  "interleavedRecord",
                  intruder.line,
                  record.label,
                  `a delimiter for ${intruder.agent} falls inside the fence of ${record.label}`,
                  `every marker between lines ${String(fence.open)} and ${String(fence.close)} belongs to ${agent}`,
                  "a fence that encloses another agent's fence passes the pair check while defeating its purpose: an edit anchored on the outer fence spans the inner agent's content, which is exactly the destruction the fence exists to prevent, and both records read as correctly delimited while one sits inside the other",
              ),
          ];
};

export const checkDelimiters = function checkDelimiters(source: string, records: readonly BoardRecord[]): Finding[] {
    const markers = delimitersIn(source);
    return records.filter((record) => record.kind === "agent").flatMap((record) => delimiterFindings(record, markers));
};
