import {
    ENTRY_LEADS,
    ENTRY_MARKER,
    clauseEnd,
    declaresLead,
    entryEnd,
    filedNotice,
    promoteLeads,
} from "../analyzers/archive.analyzer.ts";
import { authorOf, closureText } from "../generators/board.generator.ts";
import {
    clauseExtended,
    clauseMissing,
    entryAdded,
    entryExists,
    entryNotFound,
    extendContended,
    extendMissingHistory,
    extendNotFound,
    handledBy,
    historyContended,
    historyMissing,
    leadUndeclared,
    leadsInPlace,
    leadsMissing,
    leadsRepaired,
    repairContended,
    repairMissingHistory,
} from "../strings/archive.strings.ts";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { JUDGEMENT_KIND } from "../constants/board.constants.ts";
import { appendSection } from "../formatters/text.formatter.ts";
import { closureRefusal } from "../validators/archive.validator.ts";
import { itemKindOf } from "../formatters/board.formatter.ts";

interface ClosureRequest {
    readonly absolute: string;
    readonly archive: string;
    readonly index: string;
    readonly closes: string;
    readonly agent: string | null;
    readonly ref: string | null;
}

interface ClosureOutcome {
    readonly refusal: string | null;
    readonly author: string;
    readonly label: string;
    readonly acknowledged: boolean;
}

interface EntryRequest {
    readonly archive: string;
    readonly heading: string;
    readonly body: string;
}

interface EntryOutcome {
    readonly message: string;
    readonly code: number;
}

interface ExtendRequest {
    readonly archive: string;
    readonly heading: string;
    readonly lead: string;
    readonly body: string;
}

export const runEntry = function runEntry(request: EntryRequest): EntryOutcome {
    if (!existsSync(request.archive)) {
        return { code: 2, message: historyMissing(request.archive) };
    }

    const before = readFileSync(request.archive, "utf8");

    if (before.includes(`${ENTRY_MARKER}${request.heading}`)) {
        return { code: 2, message: `${entryExists(request.heading, request.archive)}${filedNotice(before)}` };
    }

    const missing = ENTRY_LEADS.filter((lead) => !declaresLead(request.body, lead));
    if (missing.length > 0) {
        return { code: 2, message: leadsMissing(missing) };
    }

    const written = appendSection(before, `${ENTRY_MARKER}${request.heading}`, request.body);

    const witness = readFileSync(request.archive, "utf8");
    if (witness !== before) {
        return { code: 2, message: historyContended(request.archive) };
    }

    writeFileSync(request.archive, written, "utf8");

    return { code: 0, message: `${entryAdded(request.heading, request.archive)}${filedNotice(before)}` };
};

export const runRepair = function runRepair(request: { archive: string; heading: string }): EntryOutcome {
    if (!existsSync(request.archive)) {
        return { code: 2, message: repairMissingHistory(request.archive) };
    }

    const before = readFileSync(request.archive, "utf8");
    const lines = before.split("\n");
    const opens = lines.findIndex((line) => line.startsWith(`${ENTRY_MARKER}${request.heading}`));

    if (opens === -1) {
        return { code: 2, message: `${entryNotFound(request.heading, request.archive)}${filedNotice(before)}` };
    }

    const end = entryEnd(lines, opens);
    const promotions = lines.slice(opens + 1, end).map(promoteLeads);
    const promoted = promotions.flatMap((promotion) => promotion.promoted);
    const out = [
        ...lines.slice(0, opens + 1),
        ...promotions.flatMap((promotion) => promotion.lines),
        ...lines.slice(end),
    ];

    if (promoted.length === 0) {
        return { code: 0, message: leadsInPlace(request.heading) };
    }

    const witness = readFileSync(request.archive, "utf8");
    if (witness !== before) {
        return { code: 2, message: repairContended(request.archive) };
    }

    writeFileSync(request.archive, out.join("\n"), "utf8");

    return { code: 0, message: leadsRepaired(promoted, request.heading) };
};

export const runExtend = function runExtend(request: ExtendRequest): EntryOutcome {
    if (!existsSync(request.archive)) {
        return { code: 2, message: extendMissingHistory(request.archive) };
    }

    if (!ENTRY_LEADS.includes(request.lead)) {
        return { code: 2, message: leadUndeclared(request.lead, ENTRY_LEADS) };
    }

    const before = readFileSync(request.archive, "utf8");
    const lines = before.split("\n");
    const opens = lines.findIndex((line) => line.startsWith(`${ENTRY_MARKER}${request.heading}`));

    if (opens === -1) {
        return { code: 2, message: `${extendNotFound(request.heading, request.archive)}${filedNotice(before)}` };
    }

    const at = clauseEnd(lines, opens, request.lead);
    if (at === -1) {
        return { code: 2, message: clauseMissing(request.heading, request.lead) };
    }

    const written = [...lines.slice(0, at + 1), request.body, ...lines.slice(at + 1)].join("\n");

    const witness = readFileSync(request.archive, "utf8");
    if (witness !== before) {
        return { code: 2, message: extendContended(request.archive) };
    }

    writeFileSync(request.archive, written, "utf8");

    return { code: 0, message: clauseExtended(request.lead, request.heading, request.archive) };
};

export const runClosure = function runClosure(request: ClosureRequest): ClosureOutcome {
    const carried = existsSync(request.archive) ? readFileSync(request.archive, "utf8") : "";
    const source = readFileSync(request.absolute, "utf8");
    const index = existsSync(request.index) ? readFileSync(request.index, "utf8") : "";
    const text = closureText(request.closes, request.ref ?? "", source, request.agent ?? "", index);
    const kind = itemKindOf(source, request.closes);

    return {
        acknowledged: kind === JUDGEMENT_KIND,
        author: authorOf(request.closes),
        label: handledBy(request.agent ?? ""),
        refusal: closureRefusal(request.closes, request.ref, request.agent, text, carried, kind),
    };
};
