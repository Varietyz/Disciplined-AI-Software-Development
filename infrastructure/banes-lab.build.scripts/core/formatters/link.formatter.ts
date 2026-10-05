import type { Link, Placed, Relation } from "#types/catalog.types";
import { listedInSentence } from "@banes-lab/web/strings/catalog.strings";
import { relationLabelOf } from "@banes-lab/web/strings/reference.strings";
import { section } from "#core/formatters/markdown.formatter";

const SEPARATOR = ", ";

export const linkText = function linkText(link: Link): string {
    const target = link.markdown ?? link.json ?? link.href;
    return target === null ? link.label : `[${link.label}](${target})`;
};

export const linkList = function linkList(links: readonly Link[]): string {
    return links.map(linkText).join(SEPARATOR);
};

export const linkSection = function linkSection(title: string, links: readonly Link[]): string | null {
    return section(title, links.map(linkText));
};

const headingOf = function headingOf(relation: string): string {
    const label = relationLabelOf(relation);
    return label.charAt(0).toUpperCase() + label.slice(1);
};

export const relationSections = function relationSections(relations: readonly Relation[]): readonly (string | null)[] {
    return relations.map((relation) => linkSection(headingOf(relation.relation), relation.links));
};

export const placementLine = function placementLine(placed: Placed): string | null {
    if (placed.up === null) {
        return null;
    }
    const { next, previous } = placed.siblings ?? { next: null, previous: null };
    return listedInSentence(
        linkText(placed.up),
        previous === null ? null : linkText(previous),
        next === null ? null : linkText(next),
    );
};
