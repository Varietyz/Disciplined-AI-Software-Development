import type { CanonRule } from "../../types/writing.types.ts";

export const WORD_RULES: readonly CanonRule[] = [
    {
        bans: ['"it is worth noting"', '"in other words"', '"note that"', '"the key point"', '"in short"'],
        checks: [{ detection: "check", enforcedIn: ["prose", "document"], id: "no-filler-phrase" }],
        conditions: ["text inside <em> quotes a model's reply and is exempt"],
        examples: [
            {
                rejected: "It is worth noting that the gate runs once per state.",
                repaired: "The gate runs once per state.",
                why: "The opening words add nothing to the fact that follows them.",
            },
        ],
        gate: "local/strings-composition",
        id: "root.no-filler",
        rule: "A string carries no phrase whose only job is to announce, emphasize or rephrase.",
        why: "The reader waits through the phrase for the fact.",
    },
    {
        bans: ['"a lie"', '"a wish"', '"wrong"'],
        checks: [],
        conditions: ["strong language is kept for a finding that has been measured"],
        examples: [
            {
                rejected: "Unverified claims are lies, not provisional truths.",
                repaired: "An unverified claim is not a provisional truth.",
                why: '"Lies" hands down a verdict where the sentence needs only the state.',
            },
        ],
        gate: null,
        id: "root.describe",
        rule: 'A string describes and does not judge: "does not hold", "is not enforced", "produces a different result".',
        why: "A verdict hands the reader the conclusion without the reasoning.",
    },
    {
        bans: [],
        checks: [],
        conditions: [
            "a coined term is kept only for a concept the field does not name, and is defined at first use",
            "where a coined term stands for an established one, the established one appears beside it once",
            "an abbreviation the page's readers use daily, such as API or SDK on a page for clients, stays unexpanded",
        ],
        examples: [
            {
                rejected:
                    "The system design across the web app, the application programming interface (API), the desktop client and the services",
                repaired: "System design across the web app, API, desktop client and services",
                why: "The client reads API every day, so the expansion turned a service card into a lesson.",
            },
        ],
        gate: null,
        id: "root.established-term",
        rule: "The established term is used, and every abbreviation is expanded once.",
        why: "A private term adds a vocabulary lesson on top of the concept lesson.",
    },
    {
        bans: [],
        checks: [{ detection: "check", enforcedIn: ["prose"], id: "one-term-per-concept" }],
        conditions: ["the term registry records the canonical name and the synonyms it retires"],
        examples: [
            {
                rejected: "The gate rejects the file. The checker reports the finding.",
                repaired: "The gate rejects the file. The gate reports the finding.",
                why: '"Checker" reads as a second tool.',
            },
        ],
        gate: "local/strings-terminology",
        id: "root.one-term",
        rule: "One concept has one name everywhere.",
        why: "A second name for the same thing reads as a second thing.",
    },
    {
        bans: ["praise words", 'accentuated words ("real software")', "marketing cadence"],
        checks: [{ detection: "check", enforcedIn: ["prose", "document"], id: "no-praise-vocabulary" }],
        conditions: [],
        examples: [
            {
                rejected: "Working with a model on real software goes well for a while.",
                repaired: null,
                why: '"Real" implies there is fake software.',
            },
            {
                rejected: "The method is robust and elegant.",
                repaired: "The method holds up under load.",
                why: "Neither word is measured.",
            },
            {
                rejected:
                    "If you've written rules for a coding agent in a Markdown file, marked them important, and watched it ignore them anyway, you've met the problem this method is built around.",
                repaired: null,
                why: "The developer rejected the post as marketing that pitches the method instead of giving a taste of what the site teaches.",
            },
        ],
        gate: "local/strings-vocabulary",
        id: "root.no-praise",
        rule: "A string claims no quality it does not measure.",
        why: "The reader has to take an unmeasured quality on trust.",
    },
    {
        bans: [],
        checks: [{ detection: "check", enforcedIn: ["prose"], id: "no-unmeasured-numbers" }],
        conditions: ["a measured value lives in a generated surface where it is derived"],
        examples: [
            {
                rejected: "A one-line change can add 300ms to the boot for every user.",
                repaired: "A one-line change can slow the boot for every user.",
                why: "Nothing derives the number.",
            },
        ],
        gate: "local/strings-punctuation",
        id: "root.measured-numbers",
        rule: "A number in a string is a measured claim.",
        why: "A digit beside a unit reads as a measurement.",
    },
    {
        bans: ["British spelling"],
        checks: [],
        conditions: [
            "the developer reviews the hits before the spelling codemod runs, and a quoted spelling is excluded by file",
        ],
        examples: [
            {
                rejected: "Configuration Externalisation",
                repaired: "Configuration Externalization",
                why: "The glossary term took the British form, so it no longer matched the ontology record it names.",
            },
        ],
        gate: "the spelling check (validation stage), which fails on every hit without rewriting",
        id: "root.american-spelling",
        rule: "Spelling is American.",
        why: "One spelling per word keeps one term per concept.",
    },
];
