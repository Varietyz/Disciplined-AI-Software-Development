import { ADDRESS_GROUP_TITLES, COLLECTION_TITLES, addressGroupTitle } from "@banes-lab/web/strings/catalog.strings";
import {
    CANONICAL_FORM,
    IDS_TITLE,
    NO_MANIFEST_HEAD,
    indexPartTitle,
    untitledGroup,
} from "#configuration/strings/catalog.strings";
import { CATALOG_VERSION, INDEX_KIND, INDEX_PART_BUDGET } from "#configuration/constants/catalog.constants";
import type { Entry, Identity, Leaf, SiteBuild, SiteParts } from "#types/catalog.types";
import { idsIndex, idsShard, indexPart, localAddress, siteIndex } from "#core/resolvers/catalog.resolver";
import type { Discovery } from "#types/site.types";
import type { RouteLedger } from "#types/route.types";
import { grammarRows } from "#core/converters/catalog.grammar.converter";
import { groupedBy } from "#core/converters/base.converter";
import { latestStamp } from "#core/converters/route.converter";
import { packedParts } from "#core/stores/catalog.store";
import { renderSiteIndex } from "#core/formatters/index.formatter";
import { trainingConsent } from "#configuration/strings/site.strings";

const SITE_REF = "api:";
const IDS_REF = "api:ids";
const IDS_SHARD_PREFIX = "api:ids/";
const PART_REF_MARK = "/";
const REF_SEPARATOR = ":";
const ID_COLUMNS = ["ref", "kind", "title", "summary", "json", "markdown", "bytes", "fingerprint"] as const;

const groupOf = function groupOf(entry: Entry): string {
    return entry.ref.slice(0, entry.ref.indexOf(REF_SEPARATOR));
};

const groupNameOf = function groupNameOf(group: string): string {
    const collection = COLLECTION_TITLES.get(group);
    const name = collection === undefined ? ADDRESS_GROUP_TITLES.get(group) : collection.toLowerCase();
    if (name === undefined) {
        throw new Error(untitledGroup(group));
    }
    return name;
};

const rowOf = function rowOf(entry: Entry): readonly unknown[] {
    return [
        entry.ref,
        entry.kind,
        entry.title,
        entry.summary,
        entry.json,
        entry.markdown,
        entry.bytes,
        entry.fingerprint,
    ];
};

interface IdsShard {
    readonly count: number;
    readonly group: string;
    readonly leaf: Leaf;
}

const groupShards = function groupShards(group: string, members: readonly Entry[]): readonly IdsShard[] {
    const parts = packedParts(members, INDEX_PART_BUDGET);
    const groupTitle = addressGroupTitle(groupNameOf(group));
    return parts.map((rows, index): IdsShard => {
        const single = parts.length === 1;
        const part = index + 1;
        const ref = IDS_SHARD_PREFIX + group + (single ? "" : PART_REF_MARK + String(part));
        const title = single ? groupTitle : indexPartTitle(groupTitle, part, parts.length);
        const address = single ? idsShard(group) : indexPart(idsShard(group), String(part));
        const leaf: Leaf = {
            data: { columns: ID_COLUMNS, count: rows.length, group, ref, rows: rows.map(rowOf), title },
            identity: { address, href: null, kind: INDEX_KIND, ref, summary: null, title },
            markdown: null,
        };
        return { count: rows.length, group, leaf };
    });
};

export const idsLeaves = function idsLeaves(entries: readonly Entry[], site: string): readonly Leaf[] {
    const grouped = [...groupedBy(entries, groupOf).entries()].flatMap(([group, members]) =>
        groupShards(group, members),
    );
    const shards = grouped.map((shard) => shard.leaf);
    const listed = grouped.map(({ count, group, leaf }) => ({ count, group, json: site + leaf.identity.address.json }));
    const kinds = [...new Set([...entries, ...shards.map((shard) => shard.identity)].map((entry) => entry.kind))];
    const head: Leaf = {
        data: {
            count: entries.length,
            kinds: kinds.toSorted((left, right) => left.localeCompare(right)),
            ref: IDS_REF,
            shards: listed,
            title: IDS_TITLE,
        },
        identity: { address: idsIndex(), href: null, kind: INDEX_KIND, ref: IDS_REF, summary: null, title: IDS_TITLE },
        markdown: null,
    };
    return [...shards, head];
};

export const siteBuildOf = function siteBuildOf(
    entries: readonly Entry[],
    ledger: RouteLedger,
    site: string,
): SiteBuild {
    const head = entries.find((entry) => entry.ref === IDS_REF);
    if (head === undefined) {
        throw new Error(NO_MANIFEST_HEAD);
    }
    return {
        build: head.fingerprint,
        published: entries.map((entry) => localAddress(site, entry.json)),
        updated: latestStamp(ledger),
        version: CATALOG_VERSION,
    };
};

export const siteLeaf = function siteLeaf(discovery: Discovery, parts: SiteParts, build: SiteBuild): Leaf {
    const { published, ...stamp } = build;
    const identity: Identity = {
        address: siteIndex(),
        href: "/",
        kind: INDEX_KIND,
        ref: SITE_REF,
        summary: discovery.summary,
        title: discovery.name,
    };
    const data = {
        ...parts,
        ...stamp,
        canonical: CANONICAL_FORM,
        consent: trainingConsent(discovery.consent, discovery.author, discovery.site),
        grammar: grammarRows(published),
        ref: SITE_REF,
        site: discovery.site,
        summary: discovery.summary,
        title: discovery.name,
    };
    return { data, identity, markdown: renderSiteIndex(data, discovery.site) };
};
