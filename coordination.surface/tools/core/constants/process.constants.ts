import { NODE_MODULES } from "./path.constants.ts";

export const NODE_CLIS: Readonly<Record<string, string>> = { npm: "npm-cli.js", npx: "npx-cli.js" };

export const NPM_PACKAGE = "npm";

export const PACKAGE_BIN = "bin";

export const PREFIX_LIB = "lib";

export const NPM_CLI_FOLDERS: readonly (readonly string[])[] = [
    [NODE_MODULES, NPM_PACKAGE, PACKAGE_BIN],
    [PREFIX_LIB, NODE_MODULES, NPM_PACKAGE, PACKAGE_BIN],
];
