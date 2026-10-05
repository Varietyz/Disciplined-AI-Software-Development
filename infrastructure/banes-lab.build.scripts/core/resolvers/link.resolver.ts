import type { Canonical, Identity, Link, Linker, Unresolved } from "#types/catalog.types";
import { rewriteTargets } from "#core/converters/link.converter";

const ROOT = "/";
const FRAGMENT = "#";
const EXTENSION_MARK = ".";

const isPageLink = function isPageLink(target: string): boolean {
    return target.startsWith(ROOT) && !target.includes(FRAGMENT) && !target.includes(EXTENSION_MARK);
};

const absoluteOf = function absoluteOf(target: string, base: string): string | null {
    if (target.startsWith(FRAGMENT)) {
        return base + target;
    }
    return target.startsWith(ROOT) ? target : null;
};

export const linkOf = function linkOf(identity: Identity, site: string, label: string): Link {
    const { address, href } = identity;
    return {
        href: href === null ? null : site + href,
        json: site + address.json,
        label,
        markdown: address.markdown === null ? null : site + address.markdown,
        ref: identity.ref,
    };
};

export const createLinker = function createLinker(
    identities: readonly Identity[],
    site: string,
    canonical: Canonical,
    routes: ReadonlySet<string> | null = null,
): Linker {
    const byRef = new Map(identities.map((identity) => [identity.ref, identity]));
    const byHref = new Map<string, Identity>();
    for (const identity of identities) {
        if (identity.href !== null && !byHref.has(canonical(identity.href))) {
            byHref.set(canonical(identity.href), identity);
        }
    }
    const missed: Unresolved[] = [];
    const link = function link(label: string, ref: string | null): Link {
        const identity = ref === null ? undefined : byRef.get(ref);
        if (identity === undefined) {
            if (ref !== null) {
                missed.push({ from: null, label, target: ref });
            }
            return { href: null, json: null, label, markdown: null, ref };
        }
        return linkOf(identity, site, label);
    };
    const relink = function relink(markdown: string, base: string): string {
        return rewriteTargets(markdown, (target) => {
            const href = absoluteOf(target, base);
            if (href === null) {
                return target;
            }
            const identity = byHref.get(canonical(href));
            const leaf = identity?.address.markdown ?? identity?.address.json;
            const crossPage = target.startsWith(ROOT) && target.includes(FRAGMENT);
            const unrouted = isPageLink(target) && routes !== null && !routes.has(href);
            if (leaf === undefined && (crossPage || unrouted)) {
                missed.push({ from: base, label: target, target: href });
            }
            return leaf === undefined ? site + href : site + leaf;
        });
    };
    return {
        byHref: (href) => byHref.get(canonical(href)) ?? null,
        byRef: (ref) => byRef.get(ref) ?? null,
        link,
        relink,
        site,
        unresolved: () => missed,
    };
};
