import { CARD_RULES } from "./writing.card.manifest.ts";
import type { CanonLayer } from "../../types/writing.types.ts";
import { LAYER_TITLES } from "../strings/writing.strings.ts";

export const SHORT_LAYER: CanonLayer = {
    covers: [
        "taglines, subtitles, share-card lines and meta descriptions",
        "card descriptions and card list items",
        "labels, titles, captions and alt text",
    ],
    defersTo: [],
    id: "short",
    intro: "A short line has no surrounding sentence, so it carries its meaning alone.",
    rules: [
        ...CARD_RULES,
        {
            bans: [
                "a label that restates the section above it",
                "a caption that describes the layout",
                "a qualifier appended to a label after a comma when the label reads alone",
                "a caption with no figure beside it where its neighbors each carry one",
                "a figure whose label does not name what it counts",
                "a unit repeated in the label of each figure that shares it",
                "an action label that names what the action carries instead of what it does",
                "a heading that names content its section does not hold",
            ],
            checks: [],
            conditions: [
                "a label takes the form of its neighbors in the same file",
                "a figure is labeled by the fewest words that name what it counts",
                "an action label names the outcome the reader asks for",
                "the options of one choice are parallel noun phrases",
                "a choice option names its party, because a pronoun in a control is read from the reader's side",
            ],
            examples: [
                {
                    rejected: "Each block is a tab, and each node is a section you can open.",
                    repaired: null,
                    why: "It describes what the reader can already see.",
                },
                {
                    rejected: "Commits, all time",
                    repaired: "Commits",
                    why: "The appended qualifier adds noise, and the label reads alone.",
                },
                {
                    rejected: "215 peak   29 average per week",
                    repaired: "Contributions per week: Peak 215, Average 29",
                    why: "The figure names no unit, so the reader cannot tell what was counted.",
                },
                {
                    rejected: "Peak weekly contributions / Average weekly contributions",
                    repaired: "Contributions per week: Peak 215, Average 29",
                    why: "Both labels repeat the unit they share, where one caption names it once for both figures.",
                },
                {
                    rejected: "Contributions per week, last 52 weeks",
                    repaired: "Contributions per week: Peak 215, Average 29",
                    why: "The caption carried no figure while every other label on the card sits beside one.",
                },
                {
                    rejected: "Send This Estimate",
                    repaired: "Request Service",
                    why: "The button requests the service and fills the mail from the estimate, so the label named the contents instead of the act.",
                },
                {
                    rejected: "I set the standards / We agree standards first / Your standards apply as written",
                    repaired: "Set by Bane's Lab / Set by your team",
                    why: "The options were sentences in three different persons, where a choice names each option in the same form.",
                },
                {
                    rejected: "My standards / Agreed standards / Your standards",
                    repaired: "Code and architecture standards: Set by Bane's Lab / Set by your team",
                    why: "My and your swap meaning with the reader, and standards named no kind.",
                },
                {
                    rejected: "Request a Copy",
                    repaired: "Buy",
                    why: "The button starts a payment that issues the download, so the label named a request instead of the purchase.",
                },
                {
                    rejected: "Request an Assessment",
                    repaired: "Request Service",
                    why: "The label swapped in the engagement name, while the button requests the whole service the estimate describes.",
                },
                {
                    rejected: "Urgent Requests / Intervention: Immediate, requested by phone only",
                    repaired: null,
                    why: "The row label restates the heading above it, so the row names nothing new.",
                },
                {
                    rejected: "Up to 14 working days: paid on delivery",
                    repaired: null,
                    why: "The row does not say whose working days it counts, so the client cannot tell the terms follow the length of the engagement.",
                },
                {
                    rejected: "Contact Information",
                    repaired: null,
                    why: "The heading named contact details while the section held the working terms, and the footer already carries the contact details.",
                },
            ],
            gate: null,
            id: "short.label",
            rule: "A label names the thing, and says nothing the page already shows.",
            why: "A caption that restates the UI is a truism.",
        },
    ],
    title: LAYER_TITLES.short,
};
