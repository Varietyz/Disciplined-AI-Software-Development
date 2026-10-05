import type { SpineContext, SpineProfile, StemParts } from "#types/document.types";
import { SPINE_KEYS } from "#configuration/constants/document.constants";

const POSIX_SEPARATOR = "/";
const EXTENSION_DOT = ".";

const DEFAULT_PROFILE: SpineProfile = { keys: [...SPINE_KEYS], requireFrontmatter: true, requireTitle: true };

export const spineProfileFor = function spineProfileFor(relDoc: string, context: SpineContext): SpineProfile {
    const { harnessRoot } = context;
    if (harnessRoot === null || !relDoc.startsWith(harnessRoot)) {
        return DEFAULT_PROFILE;
    }
    const profile = context.harnessProfiles.find((candidate) => relDoc.startsWith(harnessRoot + candidate.prefix));
    return profile === undefined
        ? DEFAULT_PROFILE
        : { keys: profile.keys, requireFrontmatter: profile.requireFrontmatter, requireTitle: profile.requireTitle };
};

export const docBasename = function docBasename(relDoc: string): string {
    return relDoc.slice(relDoc.lastIndexOf(POSIX_SEPARATOR) + 1);
};

export const docStem = function docStem(relDoc: string): string {
    const filename = docBasename(relDoc);
    const dot = filename.lastIndexOf(EXTENSION_DOT);
    return dot === -1 ? filename : filename.slice(0, dot);
};

export const stemParts = function stemParts(stem: string, tag?: string): StemParts {
    const suffix = `${EXTENSION_DOT}${tag ?? ""}`;
    const bare = tag !== undefined && tag.length > 0 && stem.endsWith(suffix) ? stem.slice(0, -suffix.length) : stem;
    const dot = bare.lastIndexOf(EXTENSION_DOT);
    return dot === -1 ? { name: bare } : { member: bare.slice(dot + 1), name: bare.slice(0, dot) };
};
