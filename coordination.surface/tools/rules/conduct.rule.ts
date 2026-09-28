import { PAIR_SEPARATOR, ROSTER } from "../core/constants/conduct.constants.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { UNBUILT_HALF, rosterRows } from "../core/validators/coverage.validator.ts";
import { corpusOf, observerResolves } from "../core/resolvers/conduct.resolver.ts";
import { unresolvedFinding, unstatedFinding } from "../core/factories/conduct.factory.ts";
import { ENTRYPOINT_ROOTS } from "../core/constants/path.constants.ts";
import { KINDS as GATE_KINDS } from "../core/steps/gate.step.ts";
import { RULE_ROOT } from "../core/constants/layer.constants.ts";
import type { RosterRow } from "../core/types/coverage.types.ts";
import { KINDS as SNAPSHOT_KINDS } from "../core/steps/snapshot.step.ts";
import { KINDS as TYPECHECK_KINDS } from "../core/steps/typecheck.step.ts";
import { identityOf } from "../core/registries/rule.registry.ts";
import { publishedKinds } from "../core/readers/gate.reader.ts";
import { declaredKinds as qualityKinds } from "../core/steps/quality.step.ts";
import { stepEmittedIds } from "../core/validators/emission.validator.ts";

const STATED_CELLS = 5;

const NO_CHECKABLE_HALF = "—";

const isStated = function isStated(row: RosterRow): boolean {
    return row.cells >= STATED_CELLS && row.cell.length > 0;
};

const isMarker = function isMarker(row: RosterRow): boolean {
    return row.cell === UNBUILT_HALF || row.cell === NO_CHECKABLE_HALF;
};

const commandOf = function commandOf(path: string): string[] {
    const root = ENTRYPOINT_ROOTS.find((entry) => path.startsWith(entry));
    const name = root === undefined ? "" : path.slice(root.length);
    const dot = name.indexOf(".");
    return dot > 0 ? [name.slice(0, dot)] : [];
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        if (!context.paths.includes(ROSTER)) {
            return {
                derivations: { roster: "outside this run's path set", skippedAsOutOfScope: [ROSTER] },
                findings: [],
                healed: [],
            };
        }

        const rows = rosterRows(context.read(ROSTER));
        const unstated = rows.filter((row) => !isStated(row));

        const ruleIds = new Set(context.paths.filter((path) => path.startsWith(RULE_ROOT)).map(identityOf));

        const emitted = [
            ...stepEmittedIds(context.repoRoot),
            ...GATE_KINDS,
            ...SNAPSHOT_KINDS,
            ...TYPECHECK_KINDS,
            ...qualityKinds(),
        ];
        const stepIds = new Set(emitted.filter((id) => !id.includes(PAIR_SEPARATOR)));
        const stepKinds = new Set(emitted.filter((id) => id.includes(PAIR_SEPARATOR)));

        const commands = new Set(context.paths.flatMap(commandOf));

        const registered = new Set<string>([...ruleIds, ...stepIds, ...commands]);
        const certified = new Set(publishedKinds(context.repoRoot));
        const keyed = new Set<string>([...certified, ...stepKinds]);

        const observed = rows.filter((row) => isStated(row) && !isMarker(row));
        const resolving = observed.filter((row) => observerResolves(row.cell, registered, keyed));
        const unresolved = observed.filter((row) => !observerResolves(row.cell, registered, keyed));
        const corpora = Object.fromEntries(
            resolving.map((row) => [row.slug, corpusOf(row.cell, ruleIds, stepIds, commands, certified, stepKinds)]),
        );

        const findings = [...unstated.map(unstatedFinding), ...unresolved.map(unresolvedFinding)];

        return {
            derivations: {
                corpusBound:
                    "each resolving cell names which corpus every member came from, because the BARE namespace is two " +
                    "merged flat — a registered rule id and an entry-point command name are the same SHAPE, so the " +
                    "value's own form separates a keyed pair from a bare member and cannot separate the two bare kinds " +
                    "from each other. Measured on the roster: one token names a rule in one cell and a command in " +
                    "another, both correct and both resolving, with only the entry's prose telling a reader which. THE " +
                    "RESOLUTION ALREADY KNOWS — rule ids come from the rule sources and command names from the " +
                    "entry-point roots — so publishing it costs no authored vocabulary and asks nothing of an author, " +
                    "which is why it is done here rather than by typing the cell",
                notChecked:
                    "whether the named observer is the RIGHT one for that half — the join decides that the id " +
                    "RESOLVES against the registered set and never that the check it names observes the property " +
                    "the entry describes, which is a reading of both. The registered set is the rule ids this run " +
                    "hands the check plus the ids the pipeline's own steps emit, which is the same set the coverage " +
                    "walk builds, plus every entry point named by its command — because an entry point that REFUSES " +
                    "a closure is a stronger observer than any registered check offers and carries no rule id, so a " +
                    "join over rule ids alone reports the strongest enforcement in the tree as unresolved. A cell naming an emitted KIND " +
                    "rather than any of the three still resolves against nothing and is reported. This check ranges " +
                    "over every roster row for both axes and over nothing else",
                observerCorpora: corpora,
                population:
                    "the ROWS of one declared digest, never the files this run hands every check — so this report " +
                    "publishes its members under a key naming its own unit and declares no reached set at all. A " +
                    "reached count is a claim about members OF THE HANDED SET, and answering it in a foreign unit " +
                    "satisfies the disclosure while breaking the audit: the subtraction reads as a hundred skipped " +
                    "files when the check was never walking files. One file is opened and every row in it is walked, " +
                    "so there is nothing skipped and nothing to name",
                registeredObservers: [...registered].toSorted((left, right) => left.localeCompare(right, "en")),
                roster: "present",
                rosterRowsWalked: rows.map((row) => row.slug),
                rows: rows.length,
                unresolvedObserver: unresolved.map((row) => `${row.slug} → ${row.cell}`),
                unstated: unstated.map((row) => row.slug),
            },
            findings,
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant:
        "every entry in the conduct roster carries a third cell, so an unstated enforcement half is distinguishable from an assessed one",
    jurisdiction: "all",
    kinds: ["unstatedHalf", "unresolvedObserver"],
    reads: [ROSTER],

    stage: "content",

    wholeScopeOnly: true,
};
