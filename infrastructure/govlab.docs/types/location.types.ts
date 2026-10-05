export type OwnerAxis = "concern" | "module" | "none";
export type DocKind = "authored" | "generated" | "template";
export type DocMood = "declarative" | "directive";

export interface DocForm {
    id: string;
    folder: string;
    ownerAxis: OwnerAxis;
    kind: DocKind;
    boundary: boolean;
    mood?: DocMood;
    tag?: string;
}

export interface DocRegistries {
    forms: Readonly<Record<string, DocForm>>;
    concerns: readonly string[];
    owners?: readonly string[] | undefined;
}

export interface LocationOptions {
    rootPrefix?: string;
    resolveOwner?: (name: string) => string;
}

export type LocationFailure =
    | "axis-contradiction"
    | "bad-name"
    | "boundary-form"
    | "missing-concern"
    | "not-authored"
    | "unknown-concern"
    | "unknown-form"
    | "unknown-member"
    | "unmarked-member"
    | "unresolved-owner";

export type LocationResult = { ok: false; reason: LocationFailure; detail: string } | { ok: true; path: string };

export interface DocEntry {
    form: string;
    concern: string;
    name: string;
    member?: string | undefined;
    source: string;
}

export interface Collision {
    path: string;
    sources: string[];
}

export interface LocationRequest {
    form: string;
    concern: string;
    name: string;
    member?: string | undefined;
    generated?: boolean | undefined;
    registries: DocRegistries;
    options?: LocationOptions | undefined;
}

export interface OwnerContext {
    def: DocForm;
    concern: string;
    name: string;
    file: string;
    registries: DocRegistries;
    base: string;
    options: LocationOptions;
}

export type DocLocationCode = LocationFailure | "boundary-misplaced" | "off-location";

export interface DocLocationDefect {
    code: DocLocationCode;
    detail: string;
    expected?: string;
}

export interface DocLocationInput {
    relPath: string;
    form: string;
    concern: string;
    kind: DocKind;
    registries: DocRegistries;
    options?: LocationOptions;
}
