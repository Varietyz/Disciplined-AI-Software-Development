import { CLONED_FOLDER, PACKED_FOLDER, TARBALL_SUFFIX } from "#configuration/constants/grammar.constants";
import type { FetchOutcome, GrammarSource } from "#types/grammar.types";
import { mkdirSync, readdirSync } from "node:fs";
import { NO_TARBALL } from "#configuration/strings/grammar.strings";
import { join } from "node:path";
import { runCommand } from "#core/adapters/shell.adapter";

const firstTarball = function firstTarball(dir: string): string {
    const tarball = readdirSync(dir).find((name) => name.endsWith(TARBALL_SUFFIX));
    if (typeof tarball !== "string") {
        throw new TypeError(NO_TARBALL);
    }
    return tarball;
};

const fetchNpm = function fetchNpm(pkg: string, dir: string): string {
    runCommand("npm", ["pack", pkg], dir);
    runCommand("tar", ["xzf", firstTarball(dir)], dir);
    return join(dir, PACKED_FOLDER);
};

const fetchGit = function fetchGit(repo: string, dir: string): string {
    runCommand("git", ["clone", "--depth", "1", repo, CLONED_FOLDER], dir);
    return join(dir, CLONED_FOLDER);
};

const fetchPackageRoot = function fetchPackageRoot(source: GrammarSource, dir: string): string {
    mkdirSync(dir, { recursive: true });
    return typeof source.git === "string" ? fetchGit(source.git, dir) : fetchNpm(source.npm ?? "", dir);
};

export const fetchGrammarPackage = function fetchGrammarPackage(source: GrammarSource, dir: string): FetchOutcome {
    try {
        return { root: fetchPackageRoot(source, dir) };
    } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
    }
};
