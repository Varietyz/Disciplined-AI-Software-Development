import {
    CONFIG_DRIFT_FAILED,
    configDriftClean,
    forbiddenConfig,
    unsanctionedConfig,
} from "#configuration/strings/config.strings";
import { ROOT as WORKSPACE_ROOT, absolutePath } from "@ssot/paths";
import { basename, relative } from "node:path";
import { recordsAt, stringField } from "#core/selectors/record.selector";
import { defineCheck } from "@govlab/context/check";
import { excludeMatcher } from "#core/factories/exclusions.factory";
import { jsonRecord } from "#core/parsers/record.parser";
import { readFileSync } from "node:fs";
import { walkFiles } from "#core/loaders/source.loader";

defineCheck({
    detects: [],
    enforces: ["architecture:single-source-of-truth", "architecture:centralized-configuration"],
});

const ALLOWLIST_FILE = "config.allowlist.json";

const repoRoot = WORKSPACE_ROOT;
const allowlist = jsonRecord(readFileSync(absolutePath("govlab.quality.allowlists", ALLOWLIST_FILE), "utf8"));
const allow = new Set(
    recordsAt(allowlist, "exceptions")
        .map((entry) => stringField(entry, "path"))
        .filter((entry) => entry.length > 0)
        .map((entry) => entry.split("\\").join("/")),
);

const isExcluded = await excludeMatcher(process.cwd());

const FORBIDDEN = new Set([
    ".jscpd.json",
    "jscpd.json",
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",
    "eslint.config.ts",
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.json",
    ".eslintignore",
    ".stylelintrc",
    ".stylelintrc.js",
    ".stylelintrc.mjs",
    ".stylelintrc.cjs",
    ".stylelintrc.json",
    ".stylelintignore",
    "prettier.config.js",
    "prettier.config.mjs",
    "prettier.config.cjs",
    ".prettierrc",
    ".prettierrc.js",
    ".prettierrc.json",
    ".prettierrc.mjs",
    ".prettierignore",
    "knip.config.js",
    "knip.config.mjs",
    "knip.config.ts",
    "knip.json",
    ".knip.json",
    ".oxlintrc.json",
    ".oxlintrc.jsonc",
    ".oxlintrc",
    ".htmlhintrc",
    ".yamllint",
    ".yamllint.yaml",
    ".yamllint.yml",
    "ruff.toml",
    ".ruff.toml",
    ".rubocop.yml",
    ".rubocop.yaml",
    "clippy.toml",
    ".clippy.toml",
    ".sqlfluff",
]);

const SANCTIONED = new Set([".golangci.yml"]);

const files = walkFiles(repoRoot, isExcluded);
const errors: string[] = [];

for (const file of files) {
    const rel = relative(repoRoot, file).split("\\").join("/");
    const name = basename(file);
    if (FORBIDDEN.has(name) && !allow.has(rel)) {
        errors.push(forbiddenConfig(rel));
    }
    if (SANCTIONED.has(name) && !allow.has(rel)) {
        errors.push(unsanctionedConfig(rel, ALLOWLIST_FILE));
    }
}

if (errors.length > 0) {
    process.stderr.write(CONFIG_DRIFT_FAILED);
    for (const error of errors) {
        process.stderr.write(`  - ${error}\n`);
    }
    process.exit(1);
}
process.stdout.write(configDriftClean(files.length));
