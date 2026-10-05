import type { GovlabConfig } from "#types/config.types";

const GLOB_PREFIX = "**/";
const GLOB_SUFFIX = "/**";
const SLASH = "/";

export const masterExclude = (config: GovlabConfig): string[] => config.qualityMaster?.exclude ?? [];

export const withMasterExclude = (config: GovlabConfig, own: string[]): string[] => [
    ...new Set<string>([...masterExclude(config), ...own]),
];

const stripGlob = (pattern: string): string => {
    let inner = pattern;
    while (inner.startsWith(GLOB_PREFIX)) {
        inner = inner.slice(GLOB_PREFIX.length);
    }
    while (inner.endsWith(GLOB_SUFFIX)) {
        inner = inner.slice(0, -GLOB_SUFFIX.length);
    }
    if (inner.startsWith(SLASH)) {
        inner = inner.slice(1);
    }
    if (inner.endsWith(SLASH)) {
        inner = inner.slice(0, -1);
    }
    return inner;
};

export const masterExcludeMarkers = (config: GovlabConfig, tool?: string): string[] => {
    const markers = new Set<string>();
    const own = tool === undefined ? [] : (config.qualityMaster?.toolExclude?.[tool] ?? []);
    for (const pattern of [...masterExclude(config), ...own]) {
        const inner = stripGlob(pattern);
        if (inner.length > 0) {
            markers.add(inner);
        }
    }
    return [...markers];
};
