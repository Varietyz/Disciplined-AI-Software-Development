import type { MandatedSurface } from "../types/surface.types.ts";

const ANCHORED_WRITE =
    "this mandate is LOW COST rather than discharged, and the difference is what the surface can COMPEL. A write " +
    "into authored source is usually an anchored edit, which matches a span the writer read and is refused where " +
    "the file moved since — but nothing here makes it one: a form is a mechanism a party INVOKES and the surface " +
    "therefore constrains, while an anchored edit is a mechanism a party CHOOSES, and none of these surfaces can " +
    "refuse a whole-file write. So the safe path is available and not compelled, which is the state where a party " +
    "correctly revising its own record with the unsafe mechanism loses content. AND THE COUNTABILITY IS THE HALF A DISCHARGE WOULD REMOVE: on a surface WITH a form, a hand write " +
    "is a DECLARED bypass and the gap stays countable because a form exists to be bypassed; on a discharged one " +
    "there is nothing to declare, so an unwitnessed write is indistinguishable from a witnessed one";

export const RECORD_FIELD_REFUSAL =
    "a venue record carrying anything other than the field set its TEMPLATE declares fails, and the closure separately holds while an active party's field is unfilled — so each declared field is a write a party owes before the venue can converge";

export const PARTY_WRITTEN: readonly MandatedSurface[] = [
    {
        member: null,
        operand: "record",
        refusal:
            "a record whose letter carries no board row is unaddressable, so every mechanism keyed by the letter has nothing to resolve",
        slot: "board",
    },
    {
        member: null,
        operand: "field",
        refusal:
            "a record carrying anything other than exactly its declared field set fails, so each field is a write a party owes before the record passes",
        slot: "board",
    },
    {
        member: null,
        operand: "item",
        refusal:
            "an addressed item is removable only through a span keyed to an allocated id, so the id and the fence are one mechanism rather than two options",
        slot: "board",
    },
    {
        member: "new class heading",
        operand: "entry",
        refusal:
            "a removal refuses without a reference naming where its extraction landed, and refuses again if that reference does not resolve, so a class that does not yet exist is written before the removal may run",
        slot: "history",
    },
    {
        member: "extension of an existing class",
        operand: "entry",
        refusal:
            "the same removal refusal, discharged against a class that ALREADY exists — the extraction adds a member to an entry rather than creating one, which the create form refuses by design because a second party appending into an entry asserts a measurement in its author's name",
        slot: "history",
    },
    {
        member: "binding",
        operand: "entry",
        refusal:
            "a record whose letter carries no index row fails, and a letter is claimed by adding the row rather than by using it",
        slot: "agent_index",
    },
    {
        member: "state transition",
        operand: "entry",
        refusal:
            "an ACTIVE letter owning no role document fails, so the state value is an OPERAND of a refusal rather than a label — a seat whose row reads active carries a standing document mandate and the only thing that ends it is a transition, which makes the state column a mandated write on a shared surface whose binding column is written once",
        slot: "agent_index",
    },
    {
        member: null,
        operand: "document",
        refusal:
            "an active letter owning no role document fails, so the obligation binds at the moment the letter is allocated",
        slot: "roles",
    },
    {
        member: null,
        operand: "entry",
        refusal:
            "a converged venue no planning surface declares cannot be archived, so the absorption edge refuses until one distributes it",
        slot: "planning",
    },
    {
        member: null,
        operand: "entry",
        refusal:
            "a venue refuses to converge until its class half is written here, so the exit condition requires a write and states no writer",
        slot: "models",
    },
    {
        member: null,
        operand: "entry",
        refusal:
            "a venue refuses to converge until its measured half is written here, one row per claim, and the obligation is named beside its class half rather than separately",
        slot: "findings",
    },
    {
        member: "clause repair",
        operand: "entry",
        refusal:
            "a registered walk fails an accumulator entry declaring no POPULATION or BOUNDARY clause, and no form can add one to an entry that already exists — the entry form writes clauses only from a body that carries them, and the extend form refuses a lead the entry does not already declare, so an entry that landed without them is unrepairable by every available path. VERIFIED by landing one: a body written as a single block carries those words mid-paragraph rather than at the head of a line, the walk reports both clauses absent, and the surface declares removal authority NONE so nothing retires it either. The mandate is therefore a REPAIR write rather than a first write, which is a distinct member of this class — every other entry here names content a party must supply once, and this names content a party must be able to supply AGAIN after the surface has accepted something incomplete",
        slot: "history",
    },
    {
        lowCost: ANCHORED_WRITE,
        member: "checkable half",
        operand: "field",
        refusal:
            "a registered walk refuses a roster row carrying no third cell, so the cell is a party write the walk requires before it passes",
        slot: "conduct_roster",
    },
    {
        lowCost: ANCHORED_WRITE,
        member: "fired sample",
        operand: "entry",
        refusal:
            "the certifier counts a kind with no violating sample into its open total, so the sample proving the kind FIRES is a party write the run refuses without",
        slot: "fixtures",
    },
    {
        lowCost: ANCHORED_WRITE,
        member: "accepted sample",
        operand: "entry",
        refusal:
            "the certifier counts a kind with no clearing sample into its open total, so the sample proving the kind DISCRIMINATES is a second party write and clearing the first clears nothing here",
        slot: "fixtures",
    },
];

export const SEEDED_MANDATES: readonly Omit<MandatedSurface, "slot">[] = [
    {
        member: "read mark",
        operand: "field",
        refusal:
            "positions standing while any party is marked unread fails, so the mark is a write the venue's own opening condition refuses without",
    },
    {
        member: "signature",
        operand: "field",
        refusal:
            "the closure holds while any active party is unsigned, since nobody countersigns and an unsigned party is a party that has not agreed",
    },
];
