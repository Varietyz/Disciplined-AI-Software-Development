import { slotList, surfacePath } from "../../../config/surface.config.ts";

export const TASK_MARKER = "- [ ]";

export const PLANNING_ROOTS: readonly string[] = [...slotList("project", "planning_roots"), surfacePath("planning")];

export const PLANNING_TEMPLATE = surfacePath("planning_template");

export const MILESTONE_MARKER = "# M";

export const CHECKLIST_CONCERN = ".checklist.md";

export const CHECKLIST_TEMPLATE = surfacePath("checklist_template");

export const PHASE_MARKER = "### PHASE ";

const PHASE_CONTRACT_SCOPE =
    " THE PHASE CONTRACT HAS A SUBJECT ONLY WHERE THE SURFACE IS PUT TO WORK, and the discriminator is the surface's " +
    "own distribution declaration rather than anything about the span. A surface that names what it distributes is " +
    "enumerating work, so every phase in it answers this contract whether it carries content or not — a heading " +
    "somebody opened and never filled is an omission there, and it is invisible to every other rule because the task " +
    "rule keys on an argument nobody will close. A surface declaring no distribution has been RAISED and states " +
    "nothing about work, so this contract has no subject at all. THE SPAN'S OWN EMPTINESS IS THE WRONG OPERAND, " +
    "because emptiness is exactly what a raised surface and a neglected phase have in common: a predicate reading the " +
    "span alone exempts both, which passes total absence while firing on partial compliance. THIS CLAUSE IS COMPOSED " +
    "INTO EVERY RULE THE SCOPE GOVERNS rather than written into one of them, because a message stating a scope its " +
    "siblings share is one contract in several copies, and the copy a reader takes is whichever rule they happened to " +
    "hit — so a party quoting a stale copy refutes a build the copy has been superseded by.";

export const DECIDE: Record<string, string> = {
    axesMissing: `a phase declares what it depends on, what is lateral to it, what it shares data with, and what it propagates to; without all four the plan carries dependency order and nothing else, so a change lands with its blast radius unstated and the omission is invisible because the phase still reads complete.${
        PHASE_CONTRACT_SCOPE
    }`,
    closureBeforeItsDependencies:
        "the closure row is the operation that ENDS the surface, and the edge reading it holds only once every other row is gone — so a closure declared in an earlier phase than a row still open declares the last operation before work it must wait for, and a reader executing the phases in order waits for a closure that is waiting for them. The excluded closure row is what stops that being a deadlock in the MECHANISM; it does nothing about the ordering the DOCUMENT declares, so the two disagree and only one of them terminates. Order the closure row last: move it to a phase at or after every open row, or move the rows it waits on above it — both terminate and which one is intended is the author's, since the phases carry a genesis the reordering has to keep",
    contractIncomplete:
        "a task states the file it lands in, the evidence that closes it, the verifier who is never its builder, and the scope it excludes; a row missing any of them is a heading, and a heading forecasts work it cannot close",
    danglingBinding:
        "a row names the agent who verifies it and the agent who owns it, and an agent the board does not declare ACTIVE closes nothing — so the row can be BUILT and never RETIRED, which is a correct-in-every-part mechanism with no effect at the end arriving in the planning surface itself; re-address the row to an active agent, or leave it unclaimed rather than bound to nobody",
    danglingReference:
        "a checklist retires a task by deleting it, so a reference surviving the deletion points at nothing and reads as a live dependency; the citing sentence is rewritten or removed in the same change that retires the task",
    duplicateId:
        "an id resolves to exactly one task, because every dependency note, ordering claim and directed flag cites tasks by id; two tasks under one id make every reference to it ambiguous, and the reader who resolves it to the wrong one gets no error",
    gateUnnamed:
        "the four mandatory-always gates never fold — a checklist that names no result for one of them has either skipped the node that owns it or asserted the node without its evidence, and a gate naming no evidence is ceremony; state each gate's result where the artifact records its generation gates",
    genesisMissing: `phase order is a genesis rather than a verb chain, so each phase declares which stage of coming-to-be it realizes; without the stage the ordering claim cannot be checked and a phase depending on a later-genesis output than it produces reads as legitimate sequencing. AND THE STAGE IS READ ON THE GENESIS LINE AND MATCHED AT A WORD BOUNDARY, so a declared stage appearing as a substring inside some other mandatory line cannot satisfy this — a check cleared by a line it was never about is one that can no longer fail on any phase carrying that line, which is a green whose uniformity is a property of the mechanism rather than of the tree.${
        PHASE_CONTRACT_SCOPE
    }`,
    history:
        "a checklist states what is true now and what remains; past on a checklist invites re-implementing work already done and confuses the intent of what is left, so history belongs in _changelogs.txt or a message to the user and never here",
    literalCount:
        "a transcribed count is a derived fact maintained by hand, so it disagrees with the tree the moment the tree moves and nothing reports the disagreement; state what the set is for and let the derivation state how many there are",
    notAChecklist:
        "the concern a file declares selects the rules it answers to, so a file carrying the checklist concern with no task and no phase escapes every task-level and phase-level check while reading as governed; give it the concern its content actually is, or declare the tasks the concern promises",
    phaseWithoutTask:
        "a phase carrying prose and no task is an argument rather than work, and an argument about work already finished reads as current while being archaeology — which is the failure a past-tense scan cannot see; state the constraint in a task's non-goal, or delete the phase. THE PROSE IS THE OPERAND RATHER THAN THE EMPTINESS, and that is what separates this from a phase a RAISE produced: a scaffolded phase carrying its heading and nothing else states an intended cycle and asks a reader for nothing, while a phase carrying an argument and no row asks for something no row will ever close. Reporting the bare one would make every surface a raise produces fail once per phase from a seed that reads as authoritative — non-conformant at birth, with the party least able to judge which side is wrong meeting the findings first. AND A LINE THE PHASE'S OWN CONTRACT MANDATES IS SCAFFOLDING RATHER THAN AN ARGUMENT, so it does not make a phase argued: without that exclusion a seeded phase is unsatisfiable whatever it carries — bare, the phase-contract checks fire; carrying the labels those checks demand, those labels read as prose and this one fires — two rules selecting on opposite properties of one span with no third content between them. THE EXCLUSION SET IS DERIVED FROM THE SAME CONTRACT READ THOSE CHECKS USE rather than transcribed beside them, because a transcribed copy is two statements of one contract with nothing keeping them equal, and the drift surfaces where it costs most: the template gains a dimension, the checks demand it, the exclusion does not carry it, and the next raised surface fires on a line its own contract required",
    precheckedGate:
        "gates resolved while producing the artifact are separate from the gates that run when it is executed, and the latter ship unchecked; a pre-checked execution box claims a future run already passed, which is the one claim generation can never support",
    rippleMissing: `impact is recorded as named entities across every declared dimension, and a dimension with no impact carries the evidence that it was assessed and found empty; a silently omitted dimension is indistinguishable from one that was never considered, which is the reading a later agent takes. The phase needs a line carrying the word ripple to open the block, and every dimension named anywhere in the phase body — line wrapping is irrelevant, the block marker is not, and without it every dimension reports missing at once.${
        PHASE_CONTRACT_SCOPE
    }`,
    spentDistribution:
        "a planning surface declaring it distributes a venue the active tree no longer holds has a SPENT distribution, which is a STATE rather than an error: the work it distributed is either built or blocked, and the finding decides between those for nobody. Two dispositions and both are the author's — RETIRE the surface where its dependencies allow, which means its header recording that it is spent and why, its DISTRIBUTES declaration removed so no planning surface names a venue outside the active tree, and every built row deleted; or leave it standing with that header stating why it stays. RETIREMENT IS IN PLACE RATHER THAN A MOVE where any archived surface cites it by path, because an archived surface is frozen and nobody may repair a citation a relocation would disconnect. What this answers is the question a reader opening the planning directory cannot: which surface distributes a venue that is still being argued",
};

export const DERIVED_NOUNS = [
    "rule",
    "rules",
    "phase",
    "phases",
    "task",
    "tasks",
    "milestone",
    "milestones",
    "file",
    "files",
    "spec",
    "specs",
    "finding",
    "findings",
];
