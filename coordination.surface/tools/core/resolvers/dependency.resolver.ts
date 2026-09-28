import {
    BIN_FIELD,
    DEPENDENCY_FIELDS,
    INSTALL_ROOT,
    REACH_EXTENSIONS,
    SCRIPTS_FIELD,
    SPECIFIER_SEPARATOR,
    TYPE_PACKAGE_PREFIX,
} from "../constants/dependency.constants.ts";
import { basename, resolve } from "node:path";

import { existsSync, readFileSync } from "node:fs";
import { hasPrefix, splitWords } from "../predicates/text.predicate.ts";
import type { DependencyReach } from "../types/dependency.types.ts";
import { NODE_MODULES } from "../constants/path.constants.ts";
import { isObject } from "../predicates/schema.predicate.ts";
import { isUnreadableJson } from "../predicates/file.predicate.ts";
import { slotText } from "../../../config/surface.config.ts";
import { stringLiterals } from "../predicates/literal.predicate.ts";
import { walk } from "../iterators/file.iterator.ts";

const record = function record(value: unknown): Record<string, unknown> | null {
    return isObject(value) ? value : null;
};

const parse = function parse(path: string): Record<string, unknown> | null {
    try {
        return record(JSON.parse(readFileSync(path, "utf8")));
    } catch (error) {
        if (isUnreadableJson(error)) {
            return null;
        }
        throw error;
    }
};

export const declaredDependencies = function declaredDependencies(manifest: Record<string, unknown>): string[] {
    const out: string[] = [];
    for (const field of DEPENDENCY_FIELDS) {
        const held = record(manifest[field]);
        if (held === null) {
            continue;
        }
        for (const name of Object.keys(held)) {
            out.push(name);
        }
    }
    return out;
};

const invocableNames = function invocableNames(packageDir: string, name: string): string[] | null {
    const installed = parse(resolve(packageDir, INSTALL_ROOT, ...name.split(SPECIFIER_SEPARATOR), "package.json"));
    if (installed === null) {
        return null;
    }

    const bin = installed[BIN_FIELD];
    if (typeof bin === "string") {
        return [basename(bin), name];
    }

    const map = record(bin);
    if (map === null) {
        return [name];
    }
    return [...Object.keys(map), name];
};

const scriptTokens = function scriptTokens(manifest: Record<string, unknown>): string[] {
    const scripts = record(manifest[SCRIPTS_FIELD]);
    if (scripts === null) {
        return [];
    }

    const out: string[] = [];
    for (const command of Object.values(scripts)) {
        if (typeof command !== "string") {
            continue;
        }
        for (const token of splitWords(command)) {
            out.push(token);
        }
    }
    return out;
};

const corpusLiterals = function corpusLiterals(
    packageDir: string,
    manifestPath: string,
): { literals: Set<string>; tokens: Set<string>; corpus: string[] } {
    const literals = new Set<string>();
    const tokens = new Set<string>();
    const corpus: string[] = [];
    const skip = [NODE_MODULES, slotText("surface", "generated")];

    for (const file of walk({ extensions: REACH_EXTENSIONS, ignored: skip, root: packageDir })) {
        if (file === manifestPath) {
            continue;
        }
        corpus.push(file);
        for (const literal of stringLiterals(readFileSync(file, "utf8"))) {
            literals.add(literal.value);
            for (const word of splitWords(literal.value)) {
                tokens.add(word);
            }
        }
    }

    return { corpus, literals, tokens };
};

const reachedBySpecifier = function reachedBySpecifier(literals: ReadonlySet<string>, name: string): boolean {
    if (literals.has(name)) {
        return true;
    }
    const scoped = name + SPECIFIER_SEPARATOR;
    for (const literal of literals) {
        if (hasPrefix(literal, scoped)) {
            return true;
        }
    }
    return false;
};

const reachedAsTypePackage = function reachedAsTypePackage(literals: ReadonlySet<string>, name: string): boolean {
    if (!hasPrefix(name, TYPE_PACKAGE_PREFIX)) {
        return false;
    }
    return literals.has(name.slice(TYPE_PACKAGE_PREFIX.length));
};

type ReachState = "reached" | "undetermined" | "unreached";

const reachOf = function reachOf(
    packageDir: string,
    name: string,
    literals: ReadonlySet<string>,
    tokens: ReadonlySet<string>,
): ReachState {
    if (reachedBySpecifier(literals, name) || reachedAsTypePackage(literals, name) || tokens.has(name)) {
        return "reached";
    }

    const invocable = invocableNames(packageDir, name);
    if (invocable === null) {
        return "undetermined";
    }
    return invocable.some((invocation) => tokens.has(invocation)) ? "reached" : "unreached";
};

export const dependencyReach = function dependencyReach(packageDir: string, manifestPath: string): DependencyReach {
    const manifest = parse(manifestPath);
    if (manifest === null) {
        return { corpus: [], declared: [], reached: [], undetermined: [], unreached: [] };
    }

    const declared = declaredDependencies(manifest);
    const { literals, tokens, corpus } = corpusLiterals(packageDir, manifestPath);
    for (const token of scriptTokens(manifest)) {
        tokens.add(token);
    }

    const states = new Map(declared.map((name) => [name, reachOf(packageDir, name, literals, tokens)]));
    const named = (state: ReachState): string[] => declared.filter((name) => states.get(name) === state);

    return {
        corpus,
        declared,
        reached: named("reached"),
        undetermined: named("undetermined"),
        unreached: named("unreached"),
    };
};

export const installRootPresent = function installRootPresent(packageDir: string): boolean {
    return existsSync(resolve(packageDir, INSTALL_ROOT));
};
