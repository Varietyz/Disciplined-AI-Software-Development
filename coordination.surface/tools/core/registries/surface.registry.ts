import type { FormAssessment, ToolForm } from "../types/surface.types.ts";
import { CARRYING_FORMS } from "./invocation.registry.ts";

const WRITING_FORMS: Readonly<Record<string, FormAssessment>> = {
    "--agenda": {
        effect: "write",
        note: "WRITES a row into the AUTHORED PLAN the agenda table renders from, never into the table — the ordinal, the invariant and what a venue must establish are intent no tree holds, so they are authored, and a row written into the rendering is erased by the next run. Counted as the entry operand on the planning axis once that surface carries a declared slot",
        reaches: { member: "agenda row", operand: "entry", slots: ["agenda"], venueOnly: false },
        region: "agenda",
    },
    "--append": {
        effect: "write",
        note: "WRITES into an EXISTING accumulator entry, extending the declared clause its lead names — counted as the entry operand at the extension member",
        reaches: { member: "extension of an existing class", operand: "entry", slots: ["history"], venueOnly: false },
        region: "entry",
    },
    "--closes": { effect: "remove", note: "REMOVES an addressed item the caller handled", region: "item" },
    "--compress": { effect: "remove", note: "REMOVES a field from the caller's own record", region: "field" },
    "--defer": {
        effect: "write",
        note: "WRITES a clause into a venue's DEFERRED section, which the raise refuses without and which no form could write — counted as the entry operand at the deferral member",
        reaches: { member: "deferral", operand: "entry", venueOnly: true },
        region: "deferral",
    },
    "--discharge": {
        effect: "remove",
        note: "REMOVES a directive from a venue's directives section once what it asked for exists, which is a removal rather than a mandated write",
        region: "directive",
    },
    "--distribute": {
        effect: "write",
        note: "RAISES a planning surface from the template that seeds its root, on the same derivation as its two siblings — counted as the entry operand on the planning axis. THE SEED IS A SECOND DECLARATION BESIDE THE REASONING PROTOCOL rather than a re-point of it: the protocol states how a plan is EXECUTED and the planning walk derives its contract from that, while the seed states what a raised instance CARRIES PERMANENTLY and this form freezes its blocks. Two artifacts, two consumers, two declarations",
        reaches: { member: null, operand: "entry", slots: ["planning"], venueOnly: false },
        region: "entry",
    },
    "--extract": {
        effect: "write",
        note: "WRITES a new keyed entry into the history accumulator — counted as the entry operand at the new-class member",
        reaches: { member: "new class heading", operand: "entry", slots: ["history"], venueOnly: false },
        region: "entry",
    },
    "--field": {
        effect: "write",
        note: "WRITES a declared field inside the caller's own record — counted as the field operand at any member",
        reaches: { anyMember: true, member: null, operand: "field", venueOnly: false },
        region: "field",
    },
    "--finding": {
        effect: "write",
        note: "RAISES a measured surface from the template that seeds its root, on the same derivation as its sibling — counted as the entry operand on the findings axis",
        reaches: { member: null, operand: "entry", slots: ["findings"], venueOnly: false },
        region: "entry",
    },
    "--fixture": {
        effect: "write",
        note: "WRITES a gate fixture entry carrying BOTH halves into the declared fixture set — the fired sample the certifier refuses a kind without, and the accepted one it refuses it without equally. It takes a witness read and refuses on a concurrent change, and it supplies the placement rather than the sample CONTENT, which is the author's judgment about what violates a kind and what a correct member of its population looks like",
        reaches: { anyMember: true, member: null, operand: "entry", slots: ["fixtures"], venueOnly: false },
        region: "entry",
    },
    "--half": {
        effect: "write",
        note: "WRITES the third cell of one conduct-roster row, resolved by column position and checked against the closed three-value set — counted as the field operand at the checkable-half member",
        reaches: { member: "checkable half", operand: "field", slots: ["conduct_roster"], venueOnly: false },
        region: "field",
    },
    "--index": {
        effect: "write",
        note: "WRITES a letter-to-role binding into the identity accumulator, allocating the shortest free identity rather than taking one from the caller — counted as the entry operand at the binding member",
        reaches: { member: "binding", operand: "entry", slots: ["agent_index"], venueOnly: false },
        region: "entry",
    },
    "--inherit": {
        effect: "write",
        note: "REPLACES the generated inherited section on a venue already raised, from the deferrals every venue sends to that invariant — it amends a block the RAISE composes rather than a member a party writes, so it discharges no party mandate. Its refusals name a venue outside the venue root, a missing inherited section and a section with no protocol banner after it, and each is a state resolved by relocating or raising rather than by a hand write",
        region: "entry",
    },
    "--item": {
        effect: "write",
        note: "WRITES an addressed item — counted as the item operand",
        reaches: { member: null, operand: "item", venueOnly: false },
        region: "item",
    },
    "--mark": {
        effect: "write",
        note: "WRITES the calling seat's letter into the READ LEDGER on one item's own marker, which is per-recipient delivery state that dies with the item — counted as the field operand at the read-mark member, and never venue-only because an item carrying a change every seat must hold lands wherever the change is routed",
        reaches: { member: "read mark", operand: "field", venueOnly: false },
        region: "field",
    },
    "--member": {
        effect: "write",
        note: "WRITES a keyed member beneath a surface's DECLARED member region and refuses a surface that declares none, so it discharges a mandate only for a surface that has opted in — which is narrower than its slot, since a slot naming a directory holds surfaces that have and have not declared one",
        region: "member",
    },
    "--model": {
        effect: "write",
        note: "RAISES a class surface from the template that seeds its root, carrying the permanent blocks and leaving the live section born present and empty — counted as the entry operand on the models axis",
        reaches: { member: null, operand: "entry", slots: ["models"], venueOnly: false },
        region: "entry",
    },
    "--read": {
        effect: "write",
        note: "WRITES the caller's roster mark — counted as the field operand at the read-mark member",
        reaches: { member: "read mark", operand: "field", venueOnly: true },
        region: "read-mark",
    },
    "--record": {
        effect: "write",
        note: "WRITES the caller's own per-writer record — counted as the record operand",
        reaches: { member: null, operand: "record", venueOnly: false },
        region: "record",
    },
    "--relocate": {
        effect: "write",
        note: "MOVES a venue from the enclosing repository root to the venue root, byte-identical and verified at the destination before the source is removed — it writes no member of any surface's content, so it discharges no mandated write and is recorded here rather than paired. Its own refusals name an occupied destination, an absent source and a venue root that resolves to nothing; none of the three requires a party write, because each names a state a party resolves by relocating something else or by not relocating at all",
        region: "venue",
    },
    "--repair": {
        effect: "write",
        note: "WRITES an existing accumulator entry into the shape its consumer resolves, PROMOTING a declared lead that landed mid-paragraph to the head of its own line — counted as the entry operand at the clause-repair member. It refuses an absent archive and a heading that resolves to no entry, and it moves a lead without changing a word, which is what makes it available to any caller rather than an edit that asserts a measurement in its author's name",
        reaches: { member: "clause repair", operand: "entry", slots: ["history"], venueOnly: false },
        region: "entry",
    },
    "--retire": {
        effect: "write",
        note: "REPLACES a planning surface's distribution declaration with a statement that it is retired, in place at that surface's own path. It performs the write its own refusals would otherwise mandate, so it discharges rather than creates a party-write obligation. It moves nothing and deletes nothing BECAUSE A PATHED CITATION FROM A FROZEN SURFACE PINS ITS TARGET against that target's own declared lifetime: the citer cannot be rewritten, so a move degrades into a disconnection that nothing reports, since the reference walk correctly skips immutable paths as citation sources. Its refusals name an open venue, a non-planning path, and a surface already retired; none requires a party write, because each names a state a party resolves by retiring something else or by not retiring at all",
        region: "distribution",
    },
    "--retract": {
        effect: "remove",
        note: "REMOVES one deferred clause from a venue's DEFERRED section, taking that clause by NAME as its operand — it refuses a target that declares no such section and a target that does not exist, so it removes a member rather than clearing a region, which is what makes a withdrawal reach the derivation the receiving edge joins on instead of standing only in a position",
        region: "deferral",
    },
    "--role": {
        effect: "write",
        note: "WRITES the calling seat's own role document at the concern it names, with its section set derived from the role template — counted as the document operand on the roles axis",
        reaches: { member: null, operand: "document", slots: ["roles"], venueOnly: false },
        region: "document",
    },
    "--roster": {
        effect: "write",
        note: "RESOLVES a venue's two roster lines from the active seats, intersecting the marked set read off the surface and refusing any resolution that would return a seat to unread — the read mark itself is written by its own form and counted there, so this reaches no mandate the mark does not already reach. Its refusals name a venue outside the venue root, a venue missing a roster line and a resolution that would regress a mark; none requires a party write",
        region: "field",
    },
    "--sign": {
        effect: "write",
        note: "WRITES the caller's own sign-off row — counted as the field operand at the signature member",
        reaches: { member: "signature", operand: "field", venueOnly: true },
        region: "signature",
    },
    "--successor": {
        effect: "write",
        note: "WRITES the successor declaration inside a venue's own declaration section, refusing an invariant the agenda does not carry as PLANNED — counted as the field operand at the successor member, and venue-only because a successor is the invariant a venue feeds",
        reaches: { member: "successor", operand: "field", venueOnly: true },
        region: "field",
    },
    "--task": {
        effect: "write",
        note: "APPENDS a task row carrying every contract field the checklist template declares, derived from that template rather than transcribed — counted as the entry operand on the planning axis",
        reaches: { member: null, operand: "entry", slots: ["planning"], venueOnly: false },
        region: "entry",
    },
    "--transition": {
        effect: "write",
        note: "WRITES a seat's state in the identity accumulator, which is the one mutable column of a row whose binding is written once — the calling seat's own by default, and a FOREIGN letter where one is named, which refuses without a warrant and records who moved it beneath the row. Counted as the entry operand at the state-transition member",
        reaches: { member: "state transition", operand: "entry", slots: ["agent_index"], venueOnly: false },
        region: "entry",
    },
};

export const ASSESSED_FORMS: Readonly<Record<string, FormAssessment>> = Object.fromEntries(
    Object.entries({ ...CARRYING_FORMS, ...WRITING_FORMS }).toSorted(([left], [right]) =>
        left.localeCompare(right, "en"),
    ),
);

export const TOOL_WRITTEN: readonly ToolForm[] = Object.values(ASSESSED_FORMS)
    .map((assessment) => assessment.reaches)
    .filter((reached): reached is ToolForm => reached !== undefined);

export const RETRACTABLE: Readonly<Record<string, string>> = {
    deferral:
        "a member of this region is COLLECTED WHOLESALE by a second form that takes no member argument, so an author who has withdrawn one cannot stop it traveling — the collector carries every member the region holds, and a withdrawal stated in prose beside it is invisible to the derivation the receiving edge joins on. VERIFIED at the collecting runner rather than inferred from the region's shape: the arrival computes its clause set from the whole section and reports what it carried, so a withdrawn member arrives indistinguishable from a live one and reaches a receiver who cannot tell it was retracted",
};

export const DELIBERATELY_UNPAIRED: Readonly<Record<string, string>> = {
    "--member":
        "the member append reaches a surface by whether that surface DECLARES a member region rather than by which slot it is, and it refuses one that declares none. A pair keyed to a slot would therefore claim reach the form does not have: a slot resolving a directory holds surfaces that have opted in and surfaces that have not, and crediting the slot would report a mandate discharged for a surface with no region. So this form is deliberately unpaired — its reach is per-surface opt-in, recorded in the form's own refusal rather than in a pair, and a mandate on a surface that HAS declared a region is cleared by reading that refusal rather than by a slot-wide claim",
};
