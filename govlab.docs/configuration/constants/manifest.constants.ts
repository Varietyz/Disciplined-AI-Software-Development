export const MATURITY: ReadonlySet<string> = new Set(["experimental", "stable", "deprecated"]);

export const CORE_KEYS: ReadonlySet<string> = new Set([
    "label",
    "summary",
    "maturity",
    "capabilities",
    "entries",
    "overlaps",
    "incompatibleWith",
    "supersedes",
    "visibility",
    "ecosystem",
]);

export const COMPUTED_KEYS: ReadonlySet<string> = new Set([
    "requires",
    "exports",
    "axis",
    "category",
    "readmeSections",
    "aiContext",
]);

export const RELATIONSHIP_KEYS: readonly string[] = ["overlaps", "incompatibleWith", "supersedes"];
export const VISIBILITY_FLAGS: readonly string[] = ["private", "hidden"];
export const PACKAGE_SCOPE = "@govlab/";
export const DEFAULT_ECOSYSTEM = "typescript";
export const DEFAULT_MATURITY = "experimental";
export const SELF_GOVERNED_KEY = "selfGoverned";
export const DELIVERY_MODES: ReadonlySet<string> = new Set(["source", "tarball"]);
export const DEFAULT_DELIVERY = "source";

export const ECOSYSTEM_MARKERS: readonly (readonly [string, string])[] = [
    ["go.mod", "go"],
    ["Cargo.toml", "rust"],
    ["pyproject.toml", "python"],
];
