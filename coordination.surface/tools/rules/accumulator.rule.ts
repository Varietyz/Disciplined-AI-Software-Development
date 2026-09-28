import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { classBoundLeads, declaredLeads } from "../core/resolvers/marker.resolver.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { historyPath } from "../../config/surface.config.ts";
import { unboundedEntries } from "../core/validators/marker.validator.ts";

const ACCUMULATOR = historyPath();

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        if (!context.paths.includes(ACCUMULATOR)) {
            return {
                derivations: { accumulator: "outside this run's path set", skippedAsOutOfScope: [ACCUMULATOR] },
                findings: [],
                healed: [],
            };
        }

        const source = context.read(ACCUMULATOR);
        const leads = declaredLeads(source);

        if (leads.length === 0) {
            return {
                derivations: {
                    accumulator: "present",
                    leads: "ABSENT — the header declares no lead, so the branch that reads one does not run and no entry can be measured against it",
                },
                findings: [],
                healed: [],
            };
        }

        const findings: Finding[] = [];
        const missing: string[] = [];

        const classBound = classBoundLeads(source);

        for (const lead of leads) {
            for (const entry of unboundedEntries(source, lead, classBound.includes(lead))) {
                missing.push(`${entry.heading} @ ${lead}`);
                findings.push({
                    actual: `${entry.heading} declares no ${lead} clause`,
                    expected: null,
                    healed: false,
                    line: entry.line,
                    locus: `${entry.heading}:${lead}`,
                    path: ACCUMULATOR,
                    remediation: {
                        action: "declare",
                        decide: `state this entry's ${lead} clause under that exact lead, since the header declares it and a lead is what a mechanism joins on where prose is what only a reader consumes. EVERY declared lead binds every class entry, so adding one to the header is how this surface acquires a new obligation — the check learns no lead name and gains no branch, which is what keeps a second lead an operand rather than an edit here. A clause with nothing to say writes the lead followed by the absent marker, which states that the question was asked and answered where an omitted lead makes an oversight indistinguishable from an entry that genuinely has none. THE CHECK READS PRESENCE AND CLAIMS NOTHING MORE: whether what the clause says is RIGHT is judgement no check reaches, and its own discrimination has a shelf life — it separates entries only while some member still lacks a lead, and once every entry carries all of them its green is evidence about the habit rather than about the clauses`,
                        deterministic: false,
                        from: entry.heading,
                        target: ACCUMULATOR,
                        to: null,
                    },
                    rule: "accumulator/unledEntry",
                    stack: [
                        { check: "declaredLeads", resolved: leads.join(" ") },
                        { check: "entry", resolved: entry.heading },
                        { check: "lead", resolved: lead },
                        { check: "clause", resolved: "absent" },
                    ],
                });
            }
        }

        return {
            derivations: {
                accumulator: "present",
                leads,
                range: "the population is every class entry crossed with every lead the HEADER declares, so the obligation grows by a header edit rather than by a check edit; an entry heading the class-heading test rejects is outside it, and a clause inside a fenced specimen is a lead MENTIONED rather than carried",
                unledEntries: missing,
            },
            findings,
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant:
        "every class entry in the history accumulator carries EVERY lead its own header declares, so a header that declares a second lead governs by declaring it rather than by a check learning its name",
    jurisdiction: "all",
    kinds: ["unledEntry"],

    reads: [ACCUMULATOR],

    stage: "content",
};
