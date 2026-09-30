import type { CanonRule } from "../../types/writing.types.ts";

export const CARD_RULES: readonly CanonRule[] = [
    {
        bans: [
            '"AI systems"',
            'a bare "a model" in a tagline',
            "a full stop closing a phrase",
            "a slogan",
            "a card description written as a first-person sentence",
            "a subtitle that narrates the page's own tabs and what each one holds",
        ],
        checks: [],
        conditions: [
            'the short lines of a page say "LLMs", and its body copy then says "the model"',
            "a tagline slot keeps the developer's wording unless a finding names something in it",
            "a card description is one noun phrase that names what the card offers",
        ],
        examples: [
            {
                rejected: "Structured instructions for AI systems.",
                repaired: null,
                why: "It names no party, closes a phrase with a full stop, and is a slogan.",
            },
            {
                rejected: "I build a defined deliverable in your stack.",
                repaired: "A scoped build, modernization or refactor in your stack",
                why: "A card names the service it offers, and a first-person sentence on it reads as a pitch.",
            },
            {
                rejected:
                    "The anatomy page shows the source behind this site, parsed on every build. The reading tab explains what the page measures, and each tree tab holds one part of the codebase as it sits on disk, with every folder, file, syntax walk, definition and call edge.",
                repaired: null,
                why: "The developer rejected the subtitle, because it narrates the page's tabs in full sentences and names the page it sits on, where a subtitle is a short line.",
            },
        ],
        gate: null,
        id: "short.tagline",
        rule: "A tagline may stay a phrase, and its words follow every rule a chapter follows.",
        why: "A line written for a card is still copy.",
    },
    {
        bans: [
            "the teaching voice on an offer page",
            "a first-person sentence where a card line names the offer",
            "a disclaimer or a hint that the page's controls already make plain",
            "a badge or a note that tells the client nothing they choose by",
            "an option the developer does not offer, added to fill out a choice",
            "a term whose condition rests on the developer's own schedule or circumstances",
        ],
        checks: [],
        conditions: [
            "an offer page, such as a services or pricing page, is built from cards, lists, labels and controls, and each carries a short line",
            "the prose layer applies to teaching copy only, never to an offer page",
            "a term states its condition in what the client can see and plan around, such as the length of the engagement or the time of the request",
        ],
        examples: [
            {
                rejected: "I review a codebase and its workflow, and I deliver a written report.",
                repaired: "A written review of your codebase and workflow",
                why: "The developer rejected the service page as written like the methodology page, because a card names the offer and teaches nothing.",
            },
            {
                rejected: "A written review of your codebase and workflow",
                repaired: "A written review of your codebase architecture and governance",
                why: "The model added a workflow review, and the developer reviews code, not how a client works.",
            },
            {
                rejected: "Agreed at kickoff",
                repaired: null,
                why: "Standards are set either by the developer or by the client, and the model padded the choice with a third option that does not exist.",
            },
            {
                rejected: "Two-person team",
                repaired: null,
                why: "A team-size badge on a client card tells the client nothing they choose by.",
            },
            {
                rejected: "Terms on the licensing page",
                repaired: null,
                why: "Each package ships with its license and terms inside, so the note tells the buyer nothing they choose by.",
            },
            {
                rejected: "Built on the published methodology, architecture and PAG",
                repaired: null,
                why: "The note restates the site the client is already on, so it is noise under the cards.",
            },
            {
                rejected: "35% on the rate, during my other commitments and rest hours",
                repaired: null,
                why: "The fee rests on the developer's private schedule, so the client cannot tell when it applies.",
            },
            {
                rejected: "NACE 62.100",
                repaired: null,
                why: "A registry code in an engagement card header tells the client nothing they choose by, and the enterprise number in the footer already leads a client who checks registered activities to the registry.",
            },
        ],
        gate: null,
        id: "short.offer",
        rule: "An offer page states each offer in the short lines of its cards and lists.",
        why: "A client scans an offer page to compare what is offered, and an explanation slows the scan.",
    },
];
