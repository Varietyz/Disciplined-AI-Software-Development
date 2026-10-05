import type { CanonRule } from "../../types/writing.types.ts";

export const SOURCE_RULES: readonly CanonRule[] = [
    {
        bans: [],
        checks: [],
        conditions: [],
        examples: [
            {
                rejected: "This site is about keeping it from drifting.",
                repaired: null,
                why: "The site says the method reduces drift and catches what remains.",
            },
            {
                rejected:
                    "A model imitates human conversation well enough that it's easy to work with it the way you would with a colleague.",
                repaired: null,
                why: "The developer rejected the line because it is not drawn from the methodology content.",
            },
        ],
        gate: null,
        id: "prose.site-claims",
        rule: "Every claim is one the site already makes.",
        why: "A paraphrase drifts from the claim it restates.",
    },
    {
        bans: [],
        checks: [],
        conditions: [
            "an established field term is linked to its ontology record, which is the site's own cross-reference",
        ],
        examples: [],
        gate: null,
        id: "prose.no-citations",
        rule: "The copy cites no outside source.",
        why: "The method is original work.",
    },
    {
        bans: [],
        checks: [],
        conditions: [],
        examples: [],
        gate: null,
        id: "prose.draft-matches-slot",
        rule: "A draft shown in chat takes the form the string can hold.",
        why: "A draft with bullets for a one-paragraph slot misstates the change.",
    },
    {
        bans: ["a question that hands the developer the read of a section the model changed"],
        checks: [],
        conditions: [
            "the developer pastes the page's full Markdown alternate, which is quicker than fetching it",
            "a reading sign-off records the model's own read of a changed section, and the model writes it once the section passes the canon",
        ],
        examples: [
            {
                rejected: "The sign-off records that you read the current text, so the model can't sign for you.",
                repaired: null,
                why: "The sign-off records the model's read after its last change, and the question handed that read to the developer.",
            },
        ],
        gate: null,
        id: "prose.read-the-page",
        rule: "The model reads a page whole before its first change and again after its last.",
        why: "A strings module shows fields, not the page the reader meets.",
    },
    {
        bans: [
            'a missing auxiliary ("a discipline that undergone")',
            'a wrong word ("convolutional" for conventional, "stockholders" for stakeholders)',
            'a double verb ("There are different models are available")',
            'a filler opener ("It can be seen from the definitions that…")',
            "a duplicated list item",
            'unmeasured praise ("high quality", "successful")',
            "a casual aside or apology",
        ],
        checks: [],
        conditions: ["the traits the copy takes from the primary reference are listed in the teaching guide"],
        examples: [],
        gate: null,
        id: "prose.reference-texts",
        rule: "The copy takes register and structure from the reference texts, never their sentence errors.",
        why: "The reference texts make a reader understand, but their grammar is not a model.",
    },
];
