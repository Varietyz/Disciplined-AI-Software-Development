import type { unaccountedScopeGaps, unevaluableScopes } from "../validators/governance.validator.ts";
import type { Finding } from "../types/segment.types.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import type { unrepairableLoci } from "../validators/repair.validator.ts";

type ScopeGap = ReturnType<typeof unaccountedScopeGaps>[number];

type Unevaluable = ReturnType<typeof unevaluableScopes>[number];

type Unrepairable = ReturnType<typeof unrepairableLoci>[number];

const UNUSABLE = -1;

const SCOPE_GAP_DECIDE =
    "two counts in one report disagreeing means the check narrowed its own scope, and a narrowing nobody named is a blind spot rather than a decision. A count is evidence of coverage only over the surface the scan reached, so a report whose reached set is smaller than the set it was handed names every path it skipped and the class it skipped it under — then the arithmetic closes and a reader can audit the green. This axis reads REPORTS rather than rules, so it fires on any check that silently narrows, including the ones nobody has thought to suspect. AND THE TWO OPERANDS MUST BE COMMENSURABLE OR THE SUBTRACTION MEANS NOTHING: `reached` is unit-bearing and names members OF THE HANDED SET, so a check whose population is not the handed files — one walking rules, declarations or slots — publishes that population under a key naming its own unit and declares NO reached set. Claiming one in a foreign unit satisfies the disclosure and breaks the audit, which is a more expensive failure than the silence it replaces. AND A REACHED OPERAND THAT NAMES NO MEMBERS IS SKIPPED RATHER THAN COMPARED: a count answers how many and never WHICH, so nothing can be audited against it and the axis passes over the report in silence while the field reads as evidence — publish the members, or publish nothing under that key";

const UNREPAIRABLE_DECIDE =
    "A FINDING'S LOCUS IS CONSUMED AS ITS REPAIR TARGET, and a surface whose declared mutability " +
    "is frozen cannot receive one — so the finding names a repair nobody may perform. This is " +
    "worse than a refusal rather than equivalent to it: a refusal produces a party who knows they " +
    "are blocked, while a frozen target that is nonetheless writable produces a party who edits, " +
    "is told the edit succeeded, watches the finding clear, and loses the repair at the next " +
    "regeneration — a party who believes they are done. Name the SOURCE the target is derived " +
    "from, where one exists, so the locus points where the repair belongs; withdraw the finding " +
    "where no source exists, because a report nobody can drain teaches every reader to discount " +
    "the color and the cost lands on the findings beside it. THE LIFETIME IS DECLARED AND THE " +
    "JOIN IS BETWEEN TWO OPERANDS THAT ALREADY EXIST, so this reads unchanged on the next surface " +
    "class the configuration declares and needs no walk to learn a skip. AND THE SURFACE'S ANSWER IS " +
    "THE WRONG OPERAND FOR A FINDING ANCHORED TO A SPAN: an accumulating surface ACCEPTS a write, so " +
    "restating a claim by appending is performable and the surface reads as repairable — while the " +
    "SPAN the finding names is permanent by the same lifetime that makes the surface appendable, so " +
    "the original span still carries the defect and the finding still stands whatever anybody " +
    "appends. The repair is reachable and the finding is unclearable, which are different properties, " +
    "and only the span's mutability separates them";

export const scopeGapFinding = function scopeGapFinding(gap: ScopeGap): Finding {
    const unusable = gap.reached === UNUSABLE;
    return {
        actual: unusable
            ? "this report declares a reached operand that names no members, so the arithmetic skips it entirely"
            : `${String(gap.handed - gap.reached - gap.named)} file(s) were handed to this check, not reached, and named in no skip list`,
        expected: null,
        healed: false,
        line: 0,
        locus: gap.report,
        path: `${GENERATED_DIR}/${gap.report}`,
        remediation: {
            action: "declare",
            decide: SCOPE_GAP_DECIDE,
            deterministic: false,
            from: gap.report,
            target: `${GENERATED_DIR}/${gap.report}`,
            to: null,
        },
        rule: unusable ? "governance/unusableOperand" : "governance/undeclaredExclusion",
        stack: [
            { check: "handed", resolved: String(gap.handed) },
            { check: "reached", resolved: unusable ? "declared, not enumerable" : String(gap.reached) },
            { check: "namedSkips", resolved: String(gap.named) },
        ],
    };
};

export const unevaluableFinding = function unevaluableFinding(gap: Unevaluable): Finding {
    return {
        actual: `${String(gap.handed)} were handed to this check and it publishes no population at all`,
        expected: null,
        healed: false,
        line: 0,
        locus: gap.report,
        path: `${GENERATED_DIR}/${gap.report}`,
        remediation: {
            action: "declare",
            decide: "a comparison cannot be wrong while one of its operands does not exist, so a report publishing NO population sits in neither pass nor fail on the scope axis — it is UNEVALUABLE, and unevaluable reads exactly like covered because both are silent. The handed count alone is inherited from whatever handed it and asserts nothing the check itself measured. Publish the population the check actually walked: as `reached` where its members ARE the handed set, or under a key naming its own unit where they are not",
            deterministic: false,
            from: gap.report,
            target: `${GENERATED_DIR}/${gap.report}`,
            to: null,
        },
        rule: "governance/unevaluableScope",
        stack: [
            { check: "handed", resolved: String(gap.handed) },
            { check: "population", resolved: "none published" },
        ],
    };
};

export const unrepairableFinding = function unrepairableFinding(locus: Unrepairable): Finding {
    return {
        actual:
            locus.reason === "frozenTarget"
                ? `${locus.rule} names a repair target whose declared mutability forbids the repair it computes`
                : `${locus.rule} anchors to a span that is permanent by the declared retention of the surface holding it, so the surface accepts a write and the span the finding names does not`,
        expected: null,
        healed: false,
        line: 0,
        locus: locus.target,
        path: `${GENERATED_DIR}/${locus.report}`,
        remediation: {
            action: "declare",
            decide: UNREPAIRABLE_DECIDE,
            deterministic: false,
            from: locus.target,
            target: `${GENERATED_DIR}/${locus.report}`,
            to: null,
        },
        rule: "governance/unrepairableLocus",
        stack: [
            { check: "reportedBy", resolved: locus.rule },
            { check: "unrepairableBy", resolved: locus.reason },
        ],
    };
};
