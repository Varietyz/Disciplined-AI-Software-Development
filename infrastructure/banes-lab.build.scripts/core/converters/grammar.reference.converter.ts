import { GROUNDS_RELATION, PAG_FACE } from "@govlab/constants";
import type { ReferenceIndex, ReferenceRecord } from "@banes-lab/web/types/reference.types.js";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { GrammarView } from "@banes-lab/web/types/grammar.types.js";
import { PAG_KINDS } from "@govlab/context";
import { refOf } from "#core/resolvers/ontology.resolver";

const recordOf = function recordOf(
    kind: string,
    name: string,
    summary: string | null,
    grounds: readonly EdgeRef[],
): ReferenceRecord {
    return {
        code: null,
        kind,
        layer: null,
        name,
        relations: grounds.length === 0 ? [] : [{ edges: grounds, relation: GROUNDS_RELATION }],
        summary,
    };
};

export const pagReferencesOf = function pagReferencesOf(grammar: GrammarView): ReferenceIndex {
    const entries: [string, ReferenceRecord][] = [
        ...grammar.categories.flatMap((group) =>
            group.keywords.map((keyword): [string, ReferenceRecord] => [
                refOf(PAG_FACE, keyword.anchor),
                recordOf(
                    PAG_KINDS.keyword,
                    keyword.name,
                    keyword.roles[0].meaning,
                    keyword.roles.flatMap((role) => role.grounds),
                ),
            ]),
        ),
        ...grammar.groups.flatMap((group) =>
            group.productions.map((production): [string, ReferenceRecord] => [
                refOf(PAG_FACE, production.anchor),
                recordOf(PAG_KINDS.production, production.lhs, production.rhs, production.grounds),
            ]),
        ),
        ...grammar.documentTypes.map((documentType): [string, ReferenceRecord] => [
            refOf(PAG_FACE, documentType.anchor),
            recordOf(PAG_KINDS.documentType, documentType.type, documentType.purpose, documentType.grounds),
        ]),
        ...grammar.templates.map((template): [string, ReferenceRecord] => [
            refOf(PAG_FACE, template.anchor),
            recordOf(PAG_KINDS.template, template.title, null, []),
        ]),
    ];
    return Object.fromEntries(entries);
};
