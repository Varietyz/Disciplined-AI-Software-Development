import type { DocForm } from "#types/location.types";
import type { DocVerb } from "#types/reference.types";
import type { Manifest } from "#types/readme.types";

export interface CatalogEntry {
    [key: string]: unknown;
    category: string | null;
    value: string;
}

export interface ManifestModule {
    dir: string;
    group: string;
    label: string;
    manifest: Manifest;
    pkg: Record<string, unknown>;
    relPath: string;
    slug: string;
    ecosystemHint?: string;
}

export interface PluginContext {
    module: ManifestModule;
    requires: (slug: string) => string[];
}

export interface ManifestSection {
    keys?: string[];
    validate?: (manifest: Manifest) => string[];
}

export interface ManifestPlugin {
    name: string;
    section?: ManifestSection;
    contribute?: (manifest: Manifest, entry: CatalogEntry, context?: PluginContext) => void;
    filter?: (manifest: Manifest, module?: ManifestModule) => boolean;
}

export interface QueryCriteria {
    group?: string;
    maturity?: string;
    ecosystem?: string;
    capability?: string;
    domain?: string;
    visibility?: string;
}

export interface DiscoverOptions {
    allowDot?: ReadonlySet<string>;
    isShaped?: (manifest: Manifest) => boolean;
}

export interface UserRegistries {
    activityVerbs: Readonly<Record<string, string>>;
    concerns: readonly string[];
    forms: Readonly<Record<string, DocForm>>;
    refVerbs: Readonly<Record<string, DocVerb>>;
}

export interface RegistryExtensions {
    concerns: unknown[];
    forms: unknown[];
    refVerbs: unknown[];
}

export interface Relationship {
    package: string;
    reason: string;
}
