import type { DocRegistries, LocationOptions } from "#types/location.types";
import type { HarnessProfile } from "#types/document.types";
import type { PathsCtx } from "#types/reference.types";
import type { UserRegistries } from "#types/manifest.types";

export interface ValidateCtx {
    boundaryDocs: ReadonlySet<string>;
    delegatedRoots: readonly string[];
    harnessAdapter: string | null;
    harnessAgentDir: string | null;
    harnessProfiles: readonly HarnessProfile[];
    harnessRoot: string | null;
    locationOptions: LocationOptions;
    paths: PathsCtx;
    registries: DocRegistries;
    relative: (path: string) => string;
    root: string;
    rootPrefix: string;
    userReg: UserRegistries;
}

export interface DocsHost {
    readonly ctx: ValidateCtx;
    readonly locationOptions: LocationOptions;
    readonly registries: DocRegistries;
    readonly relative: (path: string) => string;
    readonly root: string;
    readonly rootPrefix: string;
    readonly userReg: UserRegistries;
    readonly walk: (dir: string, suffix: string) => string[];
}

export interface CatalogContext {
    docs: string[];
    relative: (doc: string) => string;
    root: string;
    rootPrefix: string;
}

export interface TemplateContext {
    locationOptions: LocationOptions;
    registries: DocRegistries;
    root: string;
    userReg: UserRegistries;
}

export interface TemplateArguments {
    concern: string;
    form: string;
    member: string;
    name: string;
    status: string;
    subject: string;
    summary: string;
}
