import { AXIS_KIND, MODEL_KIND } from "#configuration/constants/ontology.constants";
import type {
    DocumentTypeView,
    GrammarView,
    KeywordCategoryView,
    KeywordRoleView,
    ProductionGroupView,
    TemplateView,
} from "@banes-lab/web/types/grammar.types.js";
import { type GovlabContext, PAG_KINDS, keywordIdOf } from "@govlab/context";
import type { EdgeRef } from "@banes-lab/web/types/link.types.js";
import type { Resolver } from "#types/ontology.types";
import { distinctsOf } from "#core/converters/view.converter";
import { pagAnchor } from "#core/resolvers/ontology.resolver";

const groupKeys = function groupKeys<T>(items: readonly T[], keyOf: (item: T) => string): readonly [string, T[]][] {
    const groups = new Map<string, T[]>();
    for (const item of items) {
        const key = keyOf(item);
        groups.set(key, [...(groups.get(key) ?? []), item]);
    }
    return [...groups.entries()];
};

const groundsOf = function groundsOf(resolve: Resolver, grounds: readonly string[] | undefined): readonly EdgeRef[] {
    return (grounds ?? []).map((ground) => resolve.target(ground));
};

const categoriesOf = function categoriesOf(context: GovlabContext, resolve: Resolver): readonly KeywordCategoryView[] {
    return groupKeys(context.pag.keywords(), (keyword) => keyword.roles[0].category).map(([category, keywords]) => ({
        category,
        keywords: keywords.map((keyword) => {
            const roleView = (role: (typeof keyword.roles)[number]): KeywordRoleView => ({
                category: role.category,
                example: role.example,
                grounds: groundsOf(resolve, role.grounds),
                meaning: role.meaning,
            });
            const [primary, ...further] = keyword.roles;
            return {
                anchor: pagAnchor(PAG_KINDS.keyword, keywordIdOf(keyword)),
                distinctFrom: distinctsOf(keyword.distinctFrom, resolve.target),
                name: keyword.keyword,
                roles: [roleView(primary), ...further.map(roleView)],
            };
        }),
    }));
};

const groupsOf = function groupsOf(context: GovlabContext, resolve: Resolver): readonly ProductionGroupView[] {
    return groupKeys(context.pag.productions(), (production) => production.group).map(([group, productions]) => ({
        group,
        productions: productions.map((production) => ({
            anchor: pagAnchor(PAG_KINDS.production, production.lhs),
            grounds: groundsOf(resolve, production.grounds),
            lhs: production.lhs,
            rhs: production.rhs,
        })),
    }));
};

const documentTypesOf = function documentTypesOf(
    context: GovlabContext,
    resolve: Resolver,
): readonly DocumentTypeView[] {
    return context.pag
        .documentTypes()
        .map((record) => ({
            anchor: pagAnchor(PAG_KINDS.documentType, record.type),
            axis: record.axis === undefined ? null : resolve.reasonAs(AXIS_KIND, record.axis),
            defaultVerb: record.defaultVerb,
            grounds: groundsOf(resolve, record.grounds),
            model: record.model === undefined ? null : resolve.reasonAs(MODEL_KIND, record.model),
            purpose: record.purpose,
            type: record.type,
            verbs: record.verbs,
        }));
};

const templatesOf = function templatesOf(context: GovlabContext): readonly TemplateView[] {
    return context.pag
        .templates()
        .map((template) => ({
            anchor: pagAnchor(PAG_KINDS.template, template.type),
            body: template.body,
            constraints: template.constraints,
            slots: template.slots.map((slot) => ({
                description: slot.description,
                kind: slot.kind,
                name: slot.name,
                required: slot.required,
                values: slot.enum ?? [],
            })),
            title: template.title,
            type: template.type,
        }));
};

export const grammarOf = function grammarOf(context: GovlabContext, resolve: Resolver): GrammarView {
    return {
        categories: categoriesOf(context, resolve),
        documentTypes: documentTypesOf(context, resolve),
        groups: groupsOf(context, resolve),
        templates: templatesOf(context),
    };
};
