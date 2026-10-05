import { CATALOG_FILE_BUDGET, INDEX_PART_BUDGET, INDEX_PART_KIND } from "#configuration/constants/catalog.constants";
import type { Identity, Leaf } from "#types/catalog.types";
import type { SectionPartAt, SectionShape } from "#types/section.types";
import { packedParts, serialize } from "#core/stores/catalog.store";
import { Buffer } from "node:buffer";
import { indexPart } from "#core/resolvers/catalog.resolver";
import { indexPartTitle } from "#configuration/strings/catalog.strings";
import { isRecord } from "#core/selectors/base.selector";
import { renderSectionPart } from "#core/formatters/section.formatter";

const SUBSECTIONS_KEY = "subsections";
const PART_REF_MARK = "/";

const subsectionTitle = function subsectionTitle(value: unknown): string {
    return isRecord(value) && typeof value["title"] === "string" ? value["title"] : "";
};

const withoutSubsections = function withoutSubsections(section: SectionShape): object {
    return Object.fromEntries(Object.entries(section).filter(([key]) => key !== SUBSECTIONS_KEY));
};

const subsectionPart = function subsectionPart(
    head: Identity,
    members: readonly object[],
    at: SectionPartAt,
    site: string,
): Leaf {
    const title = indexPartTitle(head.title, at.part, at.total);
    const ref = head.ref + PART_REF_MARK + String(at.part);
    const address = indexPart(head.address, String(at.part));
    const whole = site + (head.address.markdown ?? head.address.json);
    return {
        data: { part: at.part, ref, subsections: members, title, total: at.total },
        identity: { address, href: null, kind: INDEX_PART_KIND, ref, summary: null, title },
        markdown: renderSectionPart(title, site + address.json, whole, members.map(subsectionTitle)),
    };
};

export const partedSection = function partedSection(leaf: Leaf, section: SectionShape, site: string): readonly Leaf[] {
    const listed: unknown = Reflect.get(section, SUBSECTIONS_KEY);
    if (Buffer.byteLength(serialize(leaf.data)) <= CATALOG_FILE_BUDGET || !Array.isArray(listed)) {
        return [leaf];
    }
    const parts = packedParts(listed.filter(isRecord), INDEX_PART_BUDGET);
    const leaves = parts.map((members, index) =>
        subsectionPart(leaf.identity, members, { part: index + 1, total: parts.length }, site),
    );
    const summaries = leaves.map((part, index) => ({
        count: parts[index]?.length ?? 0,
        first: subsectionTitle(parts[index]?.at(0)),
        json: site + part.identity.address.json,
        last: subsectionTitle(parts[index]?.at(-1)),
        markdown: part.identity.address.markdown === null ? null : site + part.identity.address.markdown,
    }));
    const data = { ...leaf.data, content: withoutSubsections(section), parts: summaries };
    return [...leaves, { ...leaf, data }];
};
