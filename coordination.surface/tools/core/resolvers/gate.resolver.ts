import type { RuleContext, RuleDeclaration } from "../types/rule.types.ts";
import { existsSync, readFileSync } from "node:fs";
import type { Counted } from "../types/gate.types.ts";
import type { Sample } from "../types/fixture.types.ts";
import { growFixtureTree } from "../generators/fixture.generator.ts";
import { loadTaxonomy } from "./taxonomy.resolver.ts";
import { resolve } from "node:path";

const contextOf = function contextOf(
    id: string,
    repoRoot: string,
    samples: readonly Sample[],
    declared: readonly string[],
): RuleContext {
    const held = new Map(samples.map((sample): [string, string] => [sample.path, sample.text]));

    for (const wanted of declared.filter((path) => !held.has(path))) {
        const absolute = resolve(repoRoot, wanted);
        if (existsSync(absolute)) {
            held.set(wanted, readFileSync(absolute, "utf8"));
        }
    }

    return {
        exists: (path: string): boolean => held.has(path) || existsSync(resolve(repoRoot, path)),
        id,
        paths: [...held.keys()],
        read: (path: string): string => held.get(path) ?? "",
        repoRoot,
        taxonomy: loadTaxonomy(),
    };
};

export const countFindings = function countFindings(
    id: string,
    declaration: RuleDeclaration,
    repoRoot: string,
    samples: readonly Sample[],
    kind: string | undefined,
    onDisk?: true,
): Counted {
    const tree = onDisk === true ? growFixtureTree(samples) : null;
    const wanted = kind === undefined ? null : `${id}/${kind}`;

    try {
        const result = declaration.check(
            contextOf(id, tree?.root ?? repoRoot, samples, declaration.reads ?? []),
            false,
        );
        const findings = wanted === null ? result.findings : result.findings.filter((found) => found.rule === wanted);
        return { error: null, findings };
    } catch (error) {
        return { error: String(error), findings: [] };
    } finally {
        tree?.release();
    }
};

export const fromDisk = function fromDisk(
    id: string,
    root: string,
    paths: readonly string[],
    declared: readonly string[],
): RuleContext {
    const known = [...new Set([...paths, ...declared])];

    return {
        exists: (path: string): boolean => existsSync(resolve(root, path)),
        id,
        paths: known,
        read: (path: string): string => {
            const absolute = resolve(root, path);
            return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
        },
        repoRoot: root,
        taxonomy: loadTaxonomy(),
    };
};
