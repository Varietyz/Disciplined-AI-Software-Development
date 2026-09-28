import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { parseSamples, runFixture } from "../runners/fixture.runner.ts";
import {
    unknownArguments,
    unshareableOperations,
    unsuppliedOperands,
    writesNothing,
} from "../validators/entrypoint.validator.ts";
import type { RequestedOperation } from "../types/entrypoint.types.ts";
import type { BranchFixture, BranchObservation } from "../types/fixture.types.ts";

const MODULE = "probe.fixture.ts";

const SET = "export const PROBE_FIXTURES = [\n];\n";

const NO_SET = "export const PROBE_FIXTURES = 1;\n";

const SAMPLES = ["FIRES a/violating.md", "the violating line", "ACCEPTS a/clean.md", "the clean line"].join("\n");

const ONE_HALF = ["FIRES a/violating.md", "the violating line"].join("\n");

function appending(root: string, pair: string, body: string, witness?: string): BranchObservation {
    const absolute = resolve(root, MODULE);
    const before = readFileSync(absolute, "utf8");

    const outcome = runFixture({ target: MODULE, absolute, pair, body, witness: witness ?? before });
    const after = readFileSync(absolute, "utf8");

    return {
        code: outcome.code,
        changed: after !== before,
        carries: after.includes('kind: "aKind"') && after.includes("the clean line"),
    };
}

function splitting(body: string): BranchObservation {
    const held = parseSamples(body);
    return { fires: held.fires?.path ?? "", accepts: held.accepts?.path ?? "", text: held.fires?.text ?? "" };
}

const ITEM = "an item refusal";

const FIELD = "a field refusal";

function requested(
    itemAsked: boolean,
    itemSupplied: boolean,
    fieldAsked: boolean,
    fieldSupplied: boolean,
): readonly RequestedOperation[] {
    return [
        { operation: "--item", requested: itemAsked, supplied: itemSupplied, refusal: ITEM },
        { operation: "--field", requested: fieldAsked, supplied: fieldSupplied, refusal: FIELD },
    ];
}

function gathering(
    itemAsked: boolean,
    itemSupplied: boolean,
    fieldAsked: boolean,
    fieldSupplied: boolean,
): BranchObservation {
    const refusals = unsuppliedOperands(requested(itemAsked, itemSupplied, fieldAsked, fieldSupplied));

    return {
        refusals: refusals.length,
        names: refusals.join(" · "),
    };
}

const EXCLUSIVE = ["--mark", "--raise"];

function sharing(requested: readonly string[]): BranchObservation {
    const held = unshareableOperations(requested, EXCLUSIVE);
    return { held: held.length, names: held.join(" and ") };
}

const KNOWN = ["--agent", "--file", "--item", "--kind"];

function reading(argv: readonly string[]): BranchObservation {
    const unknown = unknownArguments(argv, KNOWN);
    return { unknown: unknown.length, names: unknown.join(" ") };
}

const DRY = "--rehearse";

const SELF_REHEARSING = ["--model", "--finding", "--closes"];

function dry(argv: readonly string[]): BranchObservation {
    return { writes: !writesNothing(argv, DRY, SELF_REHEARSING) };
}

export const INVOCATION_BRANCH_FIXTURES: readonly BranchFixture[] = [
    {
        subject: "fixture.runner",
        branch: "a pair carrying both halves, appended inside the declared set — the certifier refuses a kind without a violating sample AND without a clearing one, so both were party writes into authored source with no fence, no witness and no refusal",
        seed: [{ path: MODULE, text: SET }],
        exercise: (root) => appending(root, "probe/aKind", SAMPLES),
        expect: { code: 0, changed: true, carries: true },
    },
    {
        subject: "fixture.runner",
        branch: "a body carrying only the FIRED half, which must refuse — a check whose every member fails has been shown to refuse rather than to discriminate, so an entry declaring one direction certifies one and reads as certifying both",
        seed: [{ path: MODULE, text: SET }],
        exercise: (root) => appending(root, "probe/aKind", ONE_HALF),
        expect: { code: 2, changed: false, carries: false },
    },
    {
        subject: "fixture.runner",
        branch: "a bare rule with no kind, which must refuse — a fixture proves one KIND rather than one rule, and a pair collapsing every kind of a rule into one judgement reports a rule proven while a kind it emits has never been shown to fire",
        seed: [{ path: MODULE, text: SET }],
        exercise: (root) => appending(root, "probe", SAMPLES),
        expect: { code: 2, changed: false, carries: false },
    },
    {
        subject: "fixture.runner",
        branch: "a module declaring no fixture set, where an entry would land wherever the file happens to end rather than inside the collection it belongs to",
        seed: [{ path: MODULE, text: NO_SET }],
        exercise: (root) => appending(root, "probe/aKind", SAMPLES),
        expect: { code: 2, changed: false, carries: false },
    },
    {
        subject: "fixture.runner",
        branch: "a module that MOVED since the call read it, which must refuse rather than write over content that arrived in between — a write composed from an earlier read reports success to whoever overwrote and says nothing to whoever was overwritten",
        seed: [{ path: MODULE, text: SET }],
        exercise: (root) => appending(root, "probe/aKind", SAMPLES, "what the caller read earlier"),
        expect: { code: 2, changed: false, carries: false },
    },
    {
        subject: "fixture.runner",
        branch: "a body whose two halves each open their own line naming a path, which is the shape that makes a sample's own text carry newlines without a second operand",
        seed: [],
        exercise: () => splitting(SAMPLES),
        expect: { fires: "a/violating.md", accepts: "a/clean.md", text: "the violating line\n" },
    },
    {
        subject: "fixture.runner",
        branch: "a body carrying prose before either lead, which belongs to neither half — a parser attaching it to the first sample would put a caller's preamble inside the text a check is judged on",
        seed: [],
        exercise: () => splitting(`a note the caller wrote first\n${SAMPLES}`),
        expect: { fires: "a/violating.md", accepts: "a/clean.md", text: "the violating line\n" },
    },
    {
        subject: "entrypoint.validator",
        branch: "a dry run of an act that does NOT rehearse itself, which is the measured defect — the flag was documented for the whole form, read by one path, and every other path wrote while reporting success to a caller who had asked for nothing to happen",
        seed: [],
        exercise: () => dry(["--agent", "A", "--item", "-", "--kind", "judgement", DRY]),
        expect: { writes: false },
    },
    {
        subject: "entrypoint.validator",
        branch: "a dry run of an act that DOES rehearse itself, which must still reach its own act — a blanket gate would take the stronger behavior away from the one path that had it, so the exemption is the positive control rather than a carve-out",
        seed: [],
        exercise: () => dry(["--agent", "A", "--model", "a-subject", DRY]),
        expect: { writes: true },
    },
    {
        subject: "entrypoint.validator",
        branch: "a dry run of a self-rehearsing act that is NOT a surface raise, which the guard must exempt from its DECLARATION rather than from the raise table — deriving the exempt set from a table declared for a different question is correct only while the two sets coincide, and the moment they part the guard lets a non-rehearsing act through to a real write on a surface whose removal authority is none",
        seed: [],
        exercise: () => dry(["--agent", "A", "--closes", "B-1", "--ref", "changelog:a-heading", DRY]),
        expect: { writes: true },
    },
    {
        subject: "entrypoint.validator",
        branch: "an ordinary invocation with no dry-run flag, which must write — a predicate answering nothing-is-written everywhere would disable the form rather than rehearse it",
        seed: [],
        exercise: () => dry(["--agent", "A", "--item", "-", "--kind", "judgement"]),
        expect: { writes: true },
    },
    {
        subject: "entrypoint.validator",
        branch: "an argument the tool does not read, which was accepted silently and left an unwired form indistinguishable from a no-op",
        seed: [],
        exercise: () => reading(["--agent", "A", "--signoff", "a-venue"]),
        expect: { unknown: 1, names: "--signoff" },
    },
    {
        subject: "entrypoint.validator",
        branch: "every argument declared, where a value that opens with the flag lead is still a value",
        seed: [],
        exercise: () => reading(["--agent", "A", "--item", "--kind", "artifact"]),
        expect: { unknown: 0, names: "" },
    },
    {
        subject: "entrypoint.validator",
        branch: "a misspelling and an unwired form in one call, each naming itself rather than one shadowing the other",
        seed: [],
        exercise: () => reading(["--agnet", "A", "--signoff", "x"]),
        expect: { unknown: 2, names: "--agnet --signoff" },
    },
    {
        subject: "entrypoint.validator",
        branch: "an argument carrying its value inline, which names a declared flag rather than an unknown one",
        seed: [],
        exercise: () => reading(["--agent=A", "--file=board"]),
        expect: { unknown: 0, names: "" },
    },
    {
        subject: "entrypoint.validator",
        branch: "an exclusive operation sharing a call with a write, which returns first and discards the rest reporting success",
        seed: [],
        exercise: () => sharing(["--mark", "--item", "--field"]),
        expect: { held: 1, names: "--mark" },
    },
    {
        subject: "entrypoint.validator",
        branch: "an exclusive operation invoked alone, which is the only way it composes with anything",
        seed: [],
        exercise: () => sharing(["--mark"]),
        expect: { held: 0, names: "" },
    },
    {
        subject: "entrypoint.validator",
        branch: "composable operations sharing a call, where each performs and none returns before the others",
        seed: [],
        exercise: () => sharing(["--item", "--field", "--sign"]),
        expect: { held: 0, names: "" },
    },
    {
        subject: "entrypoint.validator",
        branch: "two exclusive operations in one call, where the second could never run whatever the first reported",
        seed: [],
        exercise: () => sharing(["--mark", "--raise"]),
        expect: { held: 2, names: "--mark and --raise" },
    },
    {
        subject: "entrypoint.validator",
        branch: "one operation complete beside a second whose operand is missing, where writing as it goes duplicates on retry",
        seed: [],
        exercise: () => gathering(true, true, true, false),
        expect: { refusals: 1, names: FIELD },
    },
    {
        subject: "entrypoint.validator",
        branch: "every requested operation carrying its operands, where nothing is withheld",
        seed: [],
        exercise: () => gathering(true, true, true, true),
        expect: { refusals: 0, names: "" },
    },
    {
        subject: "entrypoint.validator",
        branch: "an operation nobody requested whose operand is absent, which is not a refusal",
        seed: [],
        exercise: () => gathering(true, true, false, false),
        expect: { refusals: 0, names: "" },
    },
    {
        subject: "entrypoint.validator",
        branch: "two requested operations both missing operands, reported together rather than one exit at a time",
        seed: [],
        exercise: () => gathering(true, false, true, false),
        expect: { refusals: 2, names: `${ITEM} · ${FIELD}` },
    },
];
