import {
    ASSESSED_FORMS,
    DELIBERATELY_UNPAIRED,
    RETRACTABLE,
    TOOL_WRITTEN,
} from "../core/registries/surface.registry.ts";
import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import {
    WRITE_ENTRYPOINT,
    noWritePathFinding,
    unassessedFinding,
    unretractableFinding,
} from "../core/factories/surface.factory.ts";
import {
    flagsIn,
    isDeclaredSlot,
    mandateRoute,
    namedOf,
    regionsWith,
    slotMandates,
    suffixMandates,
    toolWritable,
    venueMandates,
} from "../core/resolvers/surface.resolver.ts";
import type { MandateRoute } from "../core/types/surface.types.ts";
import { PARTY_WRITTEN } from "../core/constants/surface.constants.ts";
import { VENUE_TEMPLATE } from "../core/constants/blocking.constants.ts";
import { config } from "../../config/surface.config.ts";

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const writable = toolWritable();
        const declared = Object.keys(config.surface);

        const entrypoint = context.exists(WRITE_ENTRYPOINT) ? context.read(WRITE_ENTRYPOINT) : "";
        const liveFlags = flagsIn(entrypoint);
        const unassessed = liveFlags.filter((flag) => ASSESSED_FORMS[flag] === undefined);
        const undeclared = PARTY_WRITTEN.filter((mandated) => !isDeclaredSlot(mandated.slot)).map(
            (mandated) => mandated.slot,
        );

        const venueTemplate = context.exists(VENUE_TEMPLATE) ? context.read(VENUE_TEMPLATE) : "";
        const suffixMandated = venueMandates(venueTemplate);
        const routed = [...slotMandates(), ...suffixMandates(context.paths, suffixMandated)].map((mandated) => ({
            locus: `${mandated.from}:${namedOf(mandated)}`,
            mandated,
            route: mandateRoute(mandated, context.paths, writable),
        }));
        const lociOn = (route: MandateRoute): string[] =>
            routed.filter((entry) => entry.route === route).map((entry) => entry.locus);
        const unwritableMandates = routed.filter((entry) => entry.route === "unwritable");
        const lowCost = unwritableMandates.flatMap(({ locus, mandated }) =>
            mandated.lowCost === undefined ? [] : [`${locus} — ${mandated.lowCost}`],
        );

        const written = regionsWith("write");
        const removable = regionsWith("remove");
        const unretractable = Object.keys(RETRACTABLE).filter(
            (region) => written.has(region) && !removable.has(region),
        );

        const findings = [
            ...unassessed.map(unassessedFinding),
            ...unretractable.map(unretractableFinding),
            ...unwritableMandates.map(({ mandated }) => noWritePathFinding(mandated)),
        ];
        const outOfScope = lociOn("outOfScope");
        const reached = lociOn("reached");
        const unwritable = lociOn("unwritable");

        return {
            derivations: {
                declaredSurfaces: declared,
                deliberatelyUnpaired: DELIBERATELY_UNPAIRED,
                formAssessmentBound:
                    "the forms this entry point OFFERS are derived from its own source on every run; what each form DOES is a party's reading of its runner, recorded as data. So a form landing is loud rather than silent — the walk names it as unassessed until somebody opens the runner — while the walk still cannot decide whether a form discharges a mandate, which is a semantic claim no scan makes. The half that was going stale invisibly is now the half that is derived",
                formsOffered: liveFlags,
                formsUnassessed: unassessed,
                lowCostByAnchoredWrite: lowCost,
                mandatedAndReached: reached,
                mandatedAndUnwritable: unwritable,
                pairingBound:
                    "THE WRITE-PATH REGISTRY IS DERIVED FROM THE ASSESSMENTS RATHER THAN MAINTAINED BESIDE THEM, so the two copies this walk carried are one. Each write assessment names the pair it REACHES, and the registry is those pairs collected — a form cannot be assessed as writing an operand and be invisible as a path to it, because there is no second place for the fact to live. THE COMPARATOR CAME FIRST AND FAILED, WHICH IS WHY THE COLLAPSE IS THE REPAIR RATHER THAN A PREFERENCE. The two lists spoke different vocabularies: the map named an effect and a REGION, the registry an OPERAND and a MEMBER, and a region was sometimes the operand of its pair, sometimes that pair's member, once the same word with a hyphen where the pair used a space. A check joining them reported five write forms as unpaired and every one was a naming difference — so reconciling them needed a mapping table, and that table would have been a THIRD copy of the fact the two already disagreed about. The check was deleted rather than tuned. THE CHECK ON THE COLLAPSE ITSELF is that the derived registry reproduces the hand-written one exactly: the mandate count was eight before and eight after, which is what makes the swap verified rather than hopeful. One form remains deliberately unpaired and carries its reason, because its reach is per-surface opt-in rather than per-slot and a pair would claim more than it has",
                range: "the population is the (declared surface, write operand, MEMBER) triples a refusing mechanism requires, so a surface appears once per member and clearing one clears only that one; a mandate naming a surface the configuration never declared is outside it, and a surface the pipeline writes rather than a party is not a member. THE MEMBER IS THE GRANULARITY BECAUSE THE KIND IS NOT WHAT A REFUSAL NAMES: a closure holding on several per-party fields, where the tool writes some of them, is a surface whose kind reads as reached and whose remaining members are still hand writes — so a walk comparing kinds reports one finding where several stand and credits the tool for a path it does not have, which is the locally-true claim composing into a false global one. A mandate whose member is unnamed is the whole kind and matches only a tool form that is equally unnamed. The form set the tool performs is verified DATA read from its own entry point rather than a property inferred, so a new form is one entry here, and a form the tool exposes only on one surface class is scoped rather than credited everywhere. THE VENUE MEMBER SET IS DERIVED FROM THE VENUE TEMPLATE rather than listed here, because the walk that MANDATES those writes derives its record schema from that same template — a member list written here would be a second copy of one contract with nothing keeping the two equal, and the copy would go stale the first time a field is added to the template, reporting full coverage over a field no mandate here knows about. Two members are seeded rather than derived and they are the ones the template cannot supply: the roster mark and the sign-off row are venue writes that are not record fields. A surface the configuration names by SUFFIX rather than by slot is resolved from the run's own path set, so a mandate on it is counted per live instance rather than once — which is why such a locus carries its path where a slot-resolved one carries its slot name. An instance under the declared IMMUTABLE root is outside the population, because a mandated write with no path is the correct terminal state where no write will ever come rather than a defect; that root is DERIVED from the configuration here rather than restated, so this walk and every other one excluding it cannot go out of step",
                regionRefusalBound:
                    "A REFUSAL NAMING AN ABSENT REGION IS NOT A MANDATED WRITE, AND THIS IS RECORDED BECAUSE THE LETTER OF THIS WALK INVARIANT SAYS OTHERWISE. Several forms append a member beneath a declared region and refuse a surface that declares none, which reads exactly like a write the form depends on and never performs. Three were tested and none survived. One refusal states plainly that the absent region is a DECISION — a surface takes the form by declaring the region, and until it does its members are deliberately hand-written, so a reader meets a choice rather than a gap; registering that would report the design as a defect. Another is a BOUNDARY guard rather than a demand: it refuses because the surface first half belongs to a party outside the seat set, so the form stays inside the table, and the region it names has existed since the surface was authored. THE DISCRIMINATOR IS WHETHER ANY PARTY IS EVER IN THE STATE THE REFUSAL DESCRIBES, needing to perform that write — not whether the refusal mentions an absence. A mandate whose population is one surface that has satisfied it since it was created is a check that can never discriminate, and a mandate whose absence is a declared choice is a check that punishes the choice. So this walk holds MEMBER writes only, and the region-shaped refusals are excluded by verification rather than by oversight",
                removableRegions: [...removable],
                retractionBound:
                    "THE REGISTRY IS THE WHOLE POPULATION AND IT IS SEEDED ONLY WITH VERIFIED MEMBERS, so an empty finding set states that every CLASSIFIED region has a removal form and states NOTHING about the regions nobody has classified. Seven of the nine regions a form writes carry no removal, and naming all seven would report a defect on the ones whose permanence is the design — an accumulator entry is the only copy of a measurement, a signature and a read mark are records of an act, and unwriting any of them would falsify the thing it records. The discriminator that puts a region in the registry is not the absence of a removal form, which is decidable and wrong; it is whether a SECOND mechanism consumes the region's members without taking a member argument, which is a reading of that mechanism's source and is why the classification is data a party writes rather than a property this walk derives. The mechanism is general and transfers to the next region by one registry line; only the registry names an instance",
                retractionRegistry: Object.keys(RETRACTABLE),
                sanctionedHandWriteBound:
                    "A TOOL DECLINING AN OPERATION IS A DECISION AND DOES NOT REMOVE THE MANDATE FROM THIS POPULATION, and the discriminator is the SURFACE's writer count rather than the span's. A form that refuses to edit an existing entry — on the correct ground that a second party writing into one asserts a measurement in its author's name — leaves the operation to that author by hand. The span is single-author; the SURFACE is shared and still writable, so a concurrent appender, a witnessed read and a compare-and-swap all defend something real, and the hand write has none of them. The exemption in the rule this walk enforces is for a surface with ONE writer by construction, which the accumulator is not. So the mandate stays counted, and what the ruling changes is the REPAIR: the missing form is one an entry's own author invokes on their own entry, rather than a widening of the form that correctly refuses",
                skippedAsOutOfScope: outOfScope,
                slotGranularityBound:
                    "A MANDATE IS NAMED BY SLOT AND AN OWNER ANSWERS BY SURFACE, AND THE TWO COME APART WHERE A SLOT RESOLVES A DIRECTORY. Such a slot holds several surfaces, and a form may reach one of them while another has never opted in — so crediting the slot would report the mandate discharged while a surface under it still has no path, and refusing to credit it reports no path where one exists for the surface that asked. The walk takes the second, because an uncleared mandate over-reports work and a cleared one hides it, and only the second failure is silent. THE FINDING THEREFORE MEANS: not every surface this slot resolves has a path — never that no form exists. A reader wanting the per-surface state reads the form's own refusal, which names the surfaces that declare a member region and refuses the ones that do not, and that refusal is the opt-in record rather than anything this walk holds",
                sweepTrigger:
                    "THE UNASSESSED SET IS ALSO THE UNSWEPT SET, AND THAT IS ONE OBLIGATION RATHER THAN TWO. This walk derives the forms the entry point offers on every run, so a landing form is loud; it holds the MANDATES as data, so a landing REFUSAL is silent, and nothing derives refusals because deciding which of them REQUIRES A PARTY WRITE is a reading rather than a scan. The gap that leaves is not the reading — it is REMEMBERING that the reading is owed, which is discipline and decays. A separate swept-at marker would close it and would be a second registry over the same forms, disagreeing with the first the moment either moved, which is the defect this walk exists inside. So the two readings are COLLAPSED: assessing a form means reading its runner for what it writes AND for what its refusals require, in the same pass, because both answers come from the same read of the same file. A form that lands unassessed is therefore reported as unswept by construction, with no marker to maintain and no second copy to drift. WHAT THIS DOES NOT CLAIM: that a refusal landing on an ALREADY-ASSESSED form is caught. That case has no observable — a runner gains a refusal with no change to the offered set — and it is stated here rather than hidden, because a trigger that covers most of a condition reads as covering all of it",
                toolWritable: writable,
                toolWrittenForms: TOOL_WRITTEN,
                undeclaredMandateBound:
                    "the undeclared-mandate field above reports a mandate THIS WALK NAMES whose slot does not resolve, and it can never report a mandate whose surface has no slot at all — those are invisible to it by construction rather than absent, so an empty value states that every mandate this walk holds resolves and states NOTHING about completeness. The two surfaces that were outside the population are now inside it because the parameter surface DECLARED them rather than because this walk widened, which is the only order that keeps the bound honest: a check inventing a slot to reach a mandate is a check extending its own jurisdiction to improve its own number, so the walk names what it cannot see and the surface that owns naming decides whether to name it",
                undeclaredMandates: undeclared,
                unretractableRegions: unretractable,
                venueMembers: suffixMandated.map((mandated) => mandated.member),
                venueMembersDerivedFrom: context.exists(VENUE_TEMPLATE)
                    ? VENUE_TEMPLATE
                    : "ABSENT — no venue template resolves, so the per-party field members reduce to the two the roster and the sign-off block mandate and no record field is counted",
                writtenRegions: [...written],
            },
            findings,
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant:
        "every WRITE a registered mechanism refuses without is a write the tool performs, measured at the MEMBER the mechanism names rather than at the surface holding it or at the kind of write it is, so a surface reached for one member never clears a mandate on another; and a region whose members a second mechanism collects without naming one carries a form that removes a single member, so a written member stays retractable by the party who wrote it",
    jurisdiction: "all",
    kinds: ["unassessedWriteForm", "unretractableWriteRegion", "noWritePath"],

    reads: [VENUE_TEMPLATE, WRITE_ENTRYPOINT],

    stage: "meta",
};
