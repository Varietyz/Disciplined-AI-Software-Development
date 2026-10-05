import { type GovlabContext, type Principle, slugify } from "@govlab/context";

export const archIndexOf = function archIndexOf(context: GovlabContext): ReadonlyMap<string, Principle> {
    const index = new Map<string, Principle>();
    for (const principle of context.arch.all()) {
        for (const key of [principle.id, principle.name, ...(principle.aliases ?? [])]) {
            index.set(slugify(key), principle);
        }
    }
    return index;
};

export const categoryLabelsOf = function categoryLabelsOf(context: GovlabContext): ReadonlyMap<string, string> {
    const labels = new Map<string, string>();
    for (const principle of context.arch.all()) {
        labels.set(slugify(principle.category), principle.category);
    }
    return labels;
};
