import type { CanonLayer } from "../../types/writing.types.ts";
import { LAYER_TITLES } from "../strings/writing.strings.ts";
import { relativePath } from "@ssot/paths";

const DIGESTS = `${relativePath("claude.root")}/rules`;

export const IDENTIFIER_LAYER: CanonLayer = {
    covers: ["file and folder names", "constants, ids and keys", "record names and ids in the ontology", "rule ids"],
    defersTo: [
        {
            covers: "the file and folder grammar and the closed vocabularies",
            path: `${relativePath("docArch.root")}/taxonomy/file-typing.project.taxonomy.md`,
        },
        { covers: "the machine truth of the vocabularies", path: relativePath("govlabHost.taxonomy") },
        { covers: "where ids and strings live", path: `${DIGESTS}/content-strings.md` },
        { covers: "a rule id is the shape it enforces", path: `${DIGESTS}/custom-gates.md` },
    ],
    id: "identifier",
    intro: "An identifier is written once and read everywhere it is used, so its word is chosen by what it names.",
    rules: [
        {
            bans: [],
            checks: [],
            conditions: [
                "a rename lands with its id and every edge that names it, and the ontology resolution check proves none dangles",
            ],
            examples: [
                {
                    rejected: "Ungrounded AI Output",
                    repaired: "Ungrounded Content",
                    why: '"AI" is a banned party name.',
                },
            ],
            gate: "the ontology resolution check",
            id: "identifier.record-name",
            rule: "A canon record name follows the root rules.",
            why: "A record name is copy wherever the record is linked.",
        },
        {
            bans: [
                "a banned party name or verdict inside a slug",
                "a space inside a slug",
                "an abbreviation or invented word inside a slug where the field has a term",
            ],
            checks: [],
            conditions: [
                "a slug is renamed together with every citation, in the same change",
                "a rule id is a slug even where its file's compound marker exempts the name from the file grammar",
            ],
            examples: [
                {
                    rejected: "claims_are_lies",
                    repaired: "claims_need_evidence",
                    why: "The slug carries the verdict the root layer bans.",
                },
                {
                    rejected: "user_contradiction_halts",
                    repaired: "developer_contradiction_halts",
                    why: "The slug names the developer by a banned party name.",
                },
                {
                    rejected: "re-read mandate",
                    repaired: "reread_on_entry",
                    why: "The space splits the slug, so it no longer reads as one identifier.",
                },
                {
                    rejected: "var-order",
                    repaired: "custom-property-order",
                    why: "The slug abbreviates custom property to var, a word the field does not use for the concept, and the rule marker kept the vocabulary from ever reading it.",
                },
            ],
            gate: null,
            id: "identifier.rule-slug",
            rule: "A rule slug names its behavior in the words the root layer allows.",
            why: "Every file that cites the rule repeats the slug, so a banned word in it spreads.",
        },
        {
            bans: ["the two-character arrow in a flow, a production, an example or a definition"],
            checks: [],
            conditions: [
                "a Pattern Abstract Grammar (PAG) document may still type the two-character form, because the grammar's arrow production accepts it and the parser reads both",
            ],
            examples: [
                {
                    rejected: '<Registry> "->" <GovernedRootSet>',
                    repaired: '<Registry> "→" <GovernedRootSet>',
                    why: "The ontology writes one arrow, and the ASCII form is a second spelling of it.",
                },
            ],
            gate: "the ontology resolution check",
            id: "identifier.arrow-sign",
            rule: "Ontology data writes an arrow as the sign →.",
            why: "One arrow keeps one spelling for every flow the ontology publishes.",
        },
        {
            bans: [
                "a second record that states an existing concept for another noun",
                "a record that is the inverse pole of an existing measure",
            ],
            checks: [],
            conditions: [
                "a variant folds into the record it varies, as an alias, with its distinct edges moved onto that record",
                "two records of one kind joined by an edge, or listed under one relation, carry a distinctFrom that states their difference",
            ],
            examples: [
                {
                    rejected: "Document-Only Policy beside Manual-Only Governance",
                    repaired:
                        "Manual-Only Governance, covering rules and policies, with Document-Only Policy as an alias",
                    why: "Both are a rule held only in prose with no executable check, and only the noun differs.",
                },
            ],
            gate: "the ontology resolution check",
            id: "identifier.one-record-per-concept",
            rule: "A concept has one record, and a variant of it is an alias of that record.",
            why: "Two records for one concept split its edges and its checks, and the reader cannot tell which one governs.",
        },
        {
            bans: ["a record name shaped like a sentence or a slogan"],
            checks: [],
            conditions: ["the established term of the field is used where one exists"],
            examples: [
                {
                    rejected: "Ordering Outside the Name",
                    repaired: "Registry-Held Order",
                    why: "The name reads as a clause, while a record name is the noun phrase for the thing.",
                },
            ],
            gate: null,
            id: "identifier.record-noun-phrase",
            rule: "A record name is a noun phrase.",
            why: "The name is linked from prose, and a clause dropped into a sentence reads as broken grammar.",
        },
    ],
    title: LAYER_TITLES.identifier,
};
