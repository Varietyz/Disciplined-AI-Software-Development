import type { FormAssessment } from "../types/surface.types.ts";

export const SELF_REHEARSING: Readonly<Record<string, string>> = {
    "--closes":
        "runs the closure's own refusals, computes the outcome, and reports what WOULD BE removed rather than removing it — so a dry run of this act shows what it would refuse as well as what it would write",
    "--compress":
        "resolves the field, takes a witness read, and reports which field WOULD go before any extraction happens, which is the whole reason a party looks before compressing",
    "--distribute": "reaches its own act and returns rehearsed from inside it, having run every refusal the raise runs",
    "--finding": "reaches its own act and returns rehearsed from inside it, having run every refusal the raise runs",
    "--model": "reaches its own act and returns rehearsed from inside it, having run every refusal the raise runs",
    "--retire":
        "computes the retirement, its citations and its live set, and reports the outcome under a would-be label rather than moving anything",
};

export const VENUE_ACTS: readonly (readonly [string, string])[] = [
    ["--raise", "raising a successor venue"],
    ["--relocate", "relocating a venue to the venue root"],
    ["--retire", "retiring a spent distribution into the planning archive"],
    ["--inherit", "recomputing a venue's inherited section"],
    ["--roster", "resolving a venue's roster from the active seats"],
    ["--defer", "deferring a question out of a venue"],
    ["--retract", "retracting a deferred question"],
    ["--arrive", "carrying deferred clauses into a successor"],
    ["--agenda", "writing a row into the agenda"],
];

const carries = function carries(note: string): FormAssessment {
    return { effect: "carry", note, region: null };
};

export const CARRYING_FORMS: Readonly<Record<string, FormAssessment>> = {
    "--agent": carries("names the calling seat and writes nothing on its own"),
    "--arrive": carries(
        "carries deferred clauses into a successor's inherited section, which no refusal names as a mandated write",
    ),
    "--barrier": carries("takes the exclusive-write barrier and writes nothing on its own"),
    "--because": carries(
        "carries why a row stands where it does, which is authored prose beside a computed value rather than the value itself",
    ),
    "--body": carries("carries an entry body"),
    "--body-file": carries("carries an entry body as one operand the caller cannot fragment"),
    "--establishes": carries("carries what a planned invariant must establish"),
    "--establishes-file": carries("carries the same as one operand the caller cannot fragment"),
    "--extracted": carries("names where a swept item landed"),
    "--file": carries("names the target surface and writes nothing on its own"),
    "--help": carries("prints and writes nothing"),
    "--item-file": carries("carries an item body as one operand the caller cannot fragment"),
    "--kind": carries(
        "carries which closure an item takes and is written onto its open marker, so it selects a path rather than performing a write of its own",
    ),
    "--lead": carries("carries a declared lead of an accumulator entry"),
    "--no-wait": carries("controls whether the call waits and writes nothing"),
    "--observer": carries("carries what observes a rule's checkable half"),
    "--planned": carries("carries a planned ordinal and defaults to the absent marker"),
    "--raise": carries(
        "creates a SUCCESSOR surface rather than writing content into a mandated one, so it discharges no mandate here",
    ),
    "--ref": carries("carries the extraction reference a removal refuses without"),
    "--rehearse": carries("runs every refusal the act runs and writes nothing"),
    "--seat": carries(
        "carries the letter a transition moves, defaulting to the caller — a self-scoped transition has no case for a seat that departs without declaring, which leaves a state only that seat may change while every edge quantifying over active seats counts a party that cannot act",
    ),
    "--seats": carries(
        "carries the letters a raise seats as participants, which is an INTENT about who should argue rather than an observation of who is running, so it is declared and never derived from the active roster",
    ),
    "--statement": carries("carries what a task row asks for"),
    "--to": carries("carries the receiver a deferred clause arrives at"),
    "--value": carries("carries what a rewritten field now reads"),
};
