import type { BranchOperand, Mutation, PresenceBackedGuard } from "../types/entrypoint.types.ts";
import { NO_FIX_FLAG, PIPELINE_ENTRY } from "../constants/path.constants.ts";
import type { Finding } from "../types/segment.types.ts";

export const optInFinding = function optInFinding(path: string, line: number, flag: string): Finding {
    return {
        actual: `${path} offers ${flag}, so healing is opt-in`,
        expected: `${path} heals by default and offers ${NO_FIX_FLAG}`,
        healed: false,
        line,
        locus: flag,
        path,
        remediation: {
            action: "rename",
            decide: "an opt-in repair flag inverts the rule — the tool computed the fix and then declined to apply it, which turns a solved problem into a queue nobody drains",
            deterministic: true,
            from: flag,
            target: path,
            to: NO_FIX_FLAG,
        },
        rule: "entrypoint/healingIsOptIn",
        stack: [
            { check: "entrypoint", resolved: path },
            { check: "flag", resolved: flag },
            { check: "default", resolved: "report" },
        ],
    };
};

export const unpublishedOperand = function unpublishedOperand(path: string, operand: BranchOperand): Finding {
    return {
        actual: `${operand.name} is computed here, decides which of two behaviors the run takes, is passed into the run, and appears in no key the emitted report declares`,
        expected: "the operand published as a report key",
        healed: false,
        line: operand.line,
        locus: operand.name,
        path,
        remediation: {
            action: "declare",
            decide: "an operand a run BRANCHES on decides what its result MEANS, so a report omitting it publishes a measurement whose conditions the reader cannot recover — and this tree answers outstanding work by READING the report rather than by re-running, so the fact lives only in a line printed to whoever started it. Publish it as a key. THE KEY NAME IS THE AUTHOR'S rather than derivable, which is why this reports instead of healing: a healer inventing a name asserts a field nobody declared. An operand that changes only HOW a result was produced belongs nowhere in it, and this comparison cannot tell that from one that changes what the result means — so a false positive is argued out on the record rather than narrowed away, because narrowing until nothing false ever fires is the check governing the scanner",
            deterministic: false,
            from: operand.name,
            target: path,
            to: null,
        },
        rule: "entrypoint/unpublishedBranchOperand",
        stack: [
            { check: "entrypoint", resolved: path },
            { check: "branches", resolved: operand.name },
            { check: "published", resolved: "absent" },
        ],
    };
};

export const duplicateEntry = function duplicateEntry(path: string, pipelines: readonly string[]): Finding {
    return {
        actual: `${String(pipelines.length)} entrypoints run the pipeline`,
        expected: "one entrypoint",
        healed: false,
        line: 1,
        locus: PIPELINE_ENTRY,
        path,
        remediation: {
            action: "move",
            decide: "governance runs through a single entry point whose default is the full pipeline, and arguments narrow it; a second entry is a second default that can disagree with the first, so a run can pass without having run everything",
            deterministic: false,
            from: path,
            target: path,
            to: pipelines[0] ?? null,
        },
        rule: "entrypoint/secondPipelineEntry",
        stack: [
            { check: "entries", resolved: String(pipelines.length) },
            { check: "sites", resolved: pipelines.join(" ") },
        ],
    };
};

export const unwitnessed = function unwitnessed(path: string, mutation: Mutation): Finding {
    return {
        actual: `${path} rewrites ${mutation.target} from content read earlier, with no re-read compared against it before the write`,
        expected: `${path} re-reads ${mutation.target} immediately before writing and aborts when it differs from what was read`,
        healed: false,
        line: mutation.line,
        locus: mutation.target,
        path,
        remediation: {
            action: "declare",
            decide: "a whole-file rewrite derived from an earlier read silently destroys anything written between the two, and the loser of that race is never told — the write reports success, so the destruction is discovered only when somebody misses their own work",
            deterministic: false,
            from: null,
            target: path,
            to: "compare-and-swap",
        },
        rule: "entrypoint/unwitnessedWrite",
        stack: [
            { check: "target", resolved: mutation.target },
            { check: "reads", resolved: String(mutation.reads) },
            { check: "witness", resolved: "absent" },
        ],
    };
};

export const presenceBackedGuard = function presenceBackedGuard(path: string, guard: PresenceBackedGuard): Finding {
    return {
        actual: `the operand deciding whether this run MUTATES resolves to a reader answering who EXISTS`,
        expected: "the same decision resolved from a reader answering who is WRITING",
        healed: false,
        line: guard.line,
        locus: guard.guard,
        path,
        remediation: {
            action: "declare",
            decide:
                "a mutation guard asks whether taking an exclusive resource is safe RIGHT NOW, and that is a question " +
                "about a write being live rather than about a party existing. A presence surface answers who is " +
                "seated, which is a state a protocol may hold CONTINUOUSLY — and where it does, the guard's true " +
                "state never occurs and the repair it gates becomes unreachable BY CONSTRUCTION rather than deferred " +
                "until quiet, so every finding whose only remedy is that repair is stranded on a walk nobody can " +
                "drain. The two surfaces are usually both already present and one derivation apart, which is what " +
                "makes the wrong one so easy to reach: it is the surface the party is already reading. Resolve the " +
                "decision from the liveness record instead — it clears on its own when the other writer finishes, and " +
                "two parties whose write sets are disjoint stop holding each other at all. WHICH SURFACES ANSWER " +
                "WHICH QUESTION IS SEMANTIC, so it is DATA this check cites rather than a property it infers, and a " +
                "surface enters that data only once somebody has read it and classified it",
            deterministic: false,
            from: guard.guard,
            target: path,
            to: null,
        },
        rule: "entrypoint/presenceBackedMutationGuard",
        stack: [
            { check: "guard", resolved: guard.guard },
            { check: "resolution", resolved: guard.chain.join(" → ") },
            { check: "operand", resolved: "presence" },
        ],
    };
};
