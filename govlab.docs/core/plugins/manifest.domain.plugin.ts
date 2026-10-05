import {
    MANIFEST_ERRORS,
    domainObject,
    duplicateDomain,
    unknownDomainMeta,
    unknownDomainSub,
} from "#configuration/strings/manifest.strings";
import { isDomainMeta, isDomainSub } from "#core/predicates/taxonomy.domain.predicate";
import type { ManifestPlugin } from "#types/manifest.types";
import { isPlainRecord } from "#core/predicates/record.predicate";

const SECTION = "domains";
const KEY_SEPARATOR = "/";

const entryErrors = function entryErrors(domain: unknown, at: string): string[] {
    if (!isPlainRecord(domain)) {
        return [domainObject(at)];
    }
    const { meta, sub } = domain;
    if (!isDomainMeta(meta)) {
        return [unknownDomainMeta(at, String(meta))];
    }
    return isDomainSub(meta, sub) ? [] : [unknownDomainSub(at, String(sub), meta)];
};

const domainKey = function domainKey(domain: unknown): string | null {
    return isPlainRecord(domain) ? [String(domain["meta"]), String(domain["sub"])].join(KEY_SEPARATOR) : null;
};

const duplicateErrors = function duplicateErrors(domains: readonly unknown[]): string[] {
    const keys = domains.map(domainKey);
    return keys.flatMap((key, index) =>
        key !== null && keys.indexOf(key) < index ? [duplicateDomain(index, key)] : [],
    );
};

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        const domains = manifest[SECTION];
        if (Array.isArray(domains) && domains.length > 0) {
            entry[SECTION] = domains
                .filter(isPlainRecord)
                .map((domain) => ({ meta: domain["meta"], sub: domain["sub"] }));
        }
    },
    name: "domains",
    section: {
        keys: [SECTION],
        validate(manifest) {
            const domains = manifest[SECTION];
            if (!Array.isArray(domains) || domains.length === 0) {
                return [MANIFEST_ERRORS.domainsRequired];
            }
            return [
                ...domains.flatMap((domain, index) => entryErrors(domain, `${SECTION}[${index}]`)),
                ...duplicateErrors(domains),
            ];
        },
    },
};
