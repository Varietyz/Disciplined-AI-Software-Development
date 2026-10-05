import { CONFIG_TAB, GOVERNANCE_TAB, TREE_TAB } from "@banes-lab/web/ids/anatomy.ids";

export const TREE_PREFIXES: readonly string[] = ["banes-lab.", "govlab.", "project.", "codebase."];

export const TAB_OVERRIDES: Readonly<Record<string, string>> = {
    "app.member": TREE_TAB,
    "govlabHost.root": GOVERNANCE_TAB,
};

export const RETIRED_TABS: Readonly<Record<string, string>> = { build: "content" };

export const SITE_EXPORT = "ANATOMY";

export const EXPORT_SUFFIX = "_ANATOMY";

export const NAME_JOIN = ".";

export const TAB_JOIN = "-";

export const EXPORT_JOIN = "_";

export const FOLDER_SEPARATOR = "/";

export const MANIFEST_LABEL_KEY = "label";

export const PACKAGE_LICENSE_KEY = "license";

export const PACKAGE_NAME_KEY = "name";

export const PACKAGE_EXPORTS_KEY = "exports";

export const METHODOLOGY_BRANCH = "methodology";

export const CONFIG_TREE = {
    generatedSources: true,
    key: "app.configs",
    licenseKey: "govlabHost.root",
    tab: CONFIG_TAB,
} as const;
