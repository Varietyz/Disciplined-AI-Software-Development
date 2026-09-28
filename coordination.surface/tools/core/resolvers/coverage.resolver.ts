import type { ConditionalSlot, Declaration, DeclarationOutcome } from "../types/coverage.types.ts";
import { isResolved, slotCount, slotList } from "../../../config/surface.config.ts";
import type { Finding } from "../types/segment.types.ts";
import { ROSTER } from "../constants/conduct.constants.ts";
import { coverageFinding } from "../factories/coverage.factory.ts";

const UNGATED = "none";

const CONDUCT = "conduct";

const SLOT_SEPARATOR = ".";

const SECTIONS = ["project", "surface", "convention", "limits", "execution"] as const;

const UNREACHED_FAILS = isResolved("convention", "unreached_gate_fails")
    ? slotCount("convention", "unreached_gate_fails") !== 0
    : false;

const parseConditional = function parseConditional(entry: string): ConditionalSlot[] {
    const space = entry.indexOf(" ");
    const path = entry.slice(space + 1).trim();
    const dot = path.indexOf(SLOT_SEPARATOR);
    const known = SECTIONS.find((one) => one === path.slice(0, dot));
    if (space <= 0 || dot <= 0 || known === undefined) {
        return [];
    }

    const name = path.slice(dot + 1);
    return [{ name, reached: isResolved(known, name), section: known, slug: entry.slice(0, space) }];
};

const conditionalSlot = function conditionalSlot(slug: string): ConditionalSlot | null {
    const entries = isResolved("convention", "conditional_gates") ? slotList("convention", "conditional_gates") : [];
    return entries.flatMap(parseConditional).find((entry) => entry.slug === slug) ?? null;
};

export const duplicateFindings = function duplicateFindings(
    { declared, path }: Declaration,
    prior: readonly Declaration[],
): Finding[] {
    const previous = prior.findLast((entry) => entry.declared.slug === declared.slug);
    if (previous === undefined) {
        return [];
    }
    return [
        coverageFinding(
            "duplicateSlug",
            path,
            declared,
            `${declared.slug} is also declared in ${previous.path}`,
            "the slug is the only rule identifier, so two declarations make a search resolve two different rules — merge them or rename one",
        ),
    ];
};

const gatedOutcome = function gatedOutcome(
    { declared, path }: Declaration,
    registered: ReadonlySet<string>,
): DeclarationOutcome {
    const needed = conditionalSlot(declared.slug);
    if (needed !== null) {
        const unreached =
            needed.reached || !UNREACHED_FAILS
                ? []
                : [
                      coverageFinding(
                          "unreachedGate",
                          path,
                          declared,
                          `${declared.slug} names gate "${declared.gate}", which registers, and its enforcing branch depends on ${needed.section}.${needed.name}, which does not resolve`,
                          "the rule is GATED-WHEN-RESOLVED and currently UNREACHED, which is a third state rather than either of the two: counting it plainly gated puts a zero-ungated total over a rule nothing enforces, and counting it plainly ungated makes a deployment permanently red on a finding whose only repair is acquiring a host. Resolve the slot the branch reads, or declare that an unreached gate does not fail here — which is the consumer's fact rather than this package's",
                      ),
                  ];
        return { conditional: needed, findings: unreached, route: "gated" };
    }

    const unknown = registered.has(declared.gate)
        ? []
        : [
              coverageFinding(
                  "unknownGate",
                  path,
                  declared,
                  `${declared.slug} names gate "${declared.gate}", which nothing in the pipeline registers`,
                  "register a check with that id, or declare gate: none — a rule naming a gate that does not exist reads as coverage while enforcing nothing. A gate is anything the ONE pipeline runs that emits a report and can fail the run, which is a registered rule OR a pipeline step: scoping the set to one of the two shapes that produce a verdict makes a real gate unnameable, and a transition nothing can spell stays undone however often it is noticed",
              ),
          ];
    return { conditional: null, findings: unknown, route: "gated" };
};

export const declarationOutcome = function declarationOutcome(
    entry: Declaration,
    registry: string,
    registered: ReadonlySet<string>,
): DeclarationOutcome {
    const { declared, path } = entry;
    if (declared.gate === UNGATED) {
        const backlog = coverageFinding(
            "ungatedBacklog",
            path,
            declared,
            `${declared.slug} declares gate: none`,
            "an ungated rule is unfinished work rather than a status — register a gate that observes it, or declare gate: conduct and write the proof in the conduct registry stating what would have to become observable",
        );
        return { conditional: null, findings: [backlog], route: "ungated" };
    }

    if (declared.gate !== CONDUCT) {
        return gatedOutcome(entry, registered);
    }

    const unproven = registry.includes(`\`${declared.slug}\``)
        ? []
        : [
              coverageFinding(
                  "unprovenConduct",
                  path,
                  declared,
                  `${declared.slug} declares gate: conduct but ${ROSTER} carries no proof for it`,
                  `a conduct declaration is a claim that no artifact observes the rule, and an unproven claim is an escape hatch — state in ${ROSTER} what would have to be observable for it to be gated, or gate it`,
              ),
          ];
    return { conditional: null, findings: unproven, route: "conduct" };
};
