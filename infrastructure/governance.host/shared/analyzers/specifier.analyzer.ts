import { PROJECT_ROOT, collapsePath, normalizePath } from "../resolvers/anchor.resolver.ts";
import { WORKSPACE_POSIX, isManifestRecord, manifestAt, memberDirs } from "../loaders/manifest.loader.ts";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { MASTER_EXCLUDE_MARKERS } from "../generated/exclusions.generated.ts";
import { isExcludedPath } from "@govlab/quality/core/matchers/exclusions.matcher.ts";
import path from "node:path";
import { specifiersOf } from "../selectors/specifier.selector.ts";
import { stagesFor } from "@govlab/pipeline/core/factories/plan.factory.ts";

const SOURCE_EXTENSION = ".ts";
const RELATIVE_MARK = ".";
const WILDCARD = "*";
const SUBPATH_MARK = "./";
const TOKEN_SEPARATOR = " ";
const IMPORT_MARK = "#";

const APPLICATION_ROOT = normalizePath(PROJECT_ROOT);

const exportPairsOf = function exportPairsOf(
    manifest: Record<string, unknown>,
): readonly (readonly [string, string])[] {
    const { exports } = manifest;
    if (!isManifestRecord(exports)) {
        return [];
    }
    return Object.entries(exports).flatMap(([key, target]) =>
        typeof target === "string" && key.endsWith(WILDCARD) && target.endsWith(WILDCARD)
            ? [
                  [
                      key.slice(SUBPATH_MARK.length, -WILDCARD.length),
                      target.slice(SUBPATH_MARK.length, -WILDCARD.length),
                  ] as const,
              ]
            : [],
    );
};

const packageTargets = function packageTargets(): ReadonlyMap<string, (sub: string) => string | null> {
    return new Map(
        memberDirs().flatMap((dir) => {
            const manifest = manifestAt(dir);
            const { name } = manifest;
            if (typeof name !== "string") {
                return [];
            }
            const pairs = exportPairsOf(manifest);
            const resolve = (sub: string): string | null => {
                const pair = pairs.find(([key]) => sub.startsWith(key));
                return pair === undefined ? null : `${dir}/${pair[1]}${sub.slice(pair[0].length)}`;
            };
            return [[name, resolve] as const];
        }),
    );
};

const PACKAGES = packageTargets();

interface SubpathImport {
    readonly key: string;
    readonly prefix: string;
    readonly suffix: string;
}

const subpathImportsOf = function subpathImportsOf(manifest: Record<string, unknown>): readonly SubpathImport[] {
    const { imports } = manifest;
    if (!isManifestRecord(imports)) {
        return [];
    }
    return Object.entries(imports).flatMap(([key, target]) => {
        if (typeof target !== "string" || !key.endsWith(WILDCARD) || !target.includes(WILDCARD)) {
            return [];
        }
        const star = target.indexOf(WILDCARD);
        return [
            {
                key: key.slice(0, -WILDCARD.length),
                prefix: target.slice(SUBPATH_MARK.length, star),
                suffix: target.slice(star + WILDCARD.length),
            },
        ];
    });
};

const MEMBER_IMPORTS: ReadonlyMap<string, readonly SubpathImport[]> = new Map(
    memberDirs().map((dir) => [dir, subpathImportsOf(manifestAt(dir))] as const),
);

const memberOf = function memberOf(file: string): string | null {
    const owners = [...MEMBER_IMPORTS.keys()].filter((dir) => file.startsWith(`${dir}/`));
    return owners.reduce<string | null>((best, dir) => (best === null || dir.length > best.length ? dir : best), null);
};

const subpathTarget = function subpathTarget(importer: string, specifier: string): string | null {
    const member = memberOf(importer);
    const entry =
        member === null ? undefined : MEMBER_IMPORTS.get(member)?.find((held) => specifier.startsWith(held.key));
    return member === null || entry === undefined
        ? null
        : `${member}/${entry.prefix}${specifier.slice(entry.key.length)}${entry.suffix}`;
};

const absoluteOf = function absoluteOf(collapsed: string): string {
    return collapsed.startsWith("/") || collapsed.includes(":") ? collapsed : `/${collapsed}`;
};

export const specifierTarget = function specifierTarget(importer: string, specifier: string): string | null {
    if (specifier.startsWith(RELATIVE_MARK)) {
        const folder = importer.slice(0, importer.lastIndexOf("/"));
        return absoluteOf(collapsePath(`${folder}/${specifier}`));
    }
    if (specifier.startsWith(IMPORT_MARK)) {
        return subpathTarget(importer, specifier);
    }
    const parts = specifier.split("/");
    const name = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : (parts[0] ?? "");
    const resolve = PACKAGES.get(name);
    return resolve === undefined ? null : resolve(specifier.slice(name.length + 1));
};

const sourceFilesUnder = function sourceFilesUnder(dir: string): string[] {
    if (!existsSync(dir)) {
        return [];
    }
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = normalizePath(path.join(dir, entry.name));
        if (isExcludedPath(full.slice(WORKSPACE_POSIX.length + 1), MASTER_EXCLUDE_MARKERS)) {
            return [];
        }
        if (entry.isDirectory()) {
            return sourceFilesUnder(full);
        }
        return entry.name.endsWith(SOURCE_EXTENSION) ? [full] : [];
    });
};

const applicationEdges = function applicationEdges(): ReadonlyMap<string, readonly string[]> {
    const edges = new Map<string, string[]>();
    for (const file of sourceFilesUnder(APPLICATION_ROOT)) {
        const targets = specifiersOf(file, readFileSync(file, "utf8")).flatMap((specifier) => {
            const target = specifierTarget(file, specifier);
            return target === null || target === file ? [] : [target];
        });
        edges.set(file, targets);
    }
    return edges;
};

export const applicationImporters = function applicationImporters(): ReadonlyMap<string, readonly string[]> {
    const importers = new Map<string, string[]>();
    for (const [file, targets] of applicationEdges()) {
        for (const target of targets) {
            importers.set(target, [...(importers.get(target) ?? []), file.slice(APPLICATION_ROOT.length + 1)]);
        }
    }
    return importers;
};

export const reachedUnder = function reachedUnder(root: string, seeds: ReadonlySet<string>): ReadonlySet<string> {
    const edges = applicationEdges();
    const inside = (file: string): boolean => file.startsWith(root);
    const start = [
        ...[...edges].filter(([file]) => !inside(file)).flatMap(([, targets]) => targets.filter(inside)),
        ...[...seeds].filter(inside),
    ];
    const reached = new Set<string>();
    const queue = [...start];
    while (queue.length > 0) {
        const file = queue.pop();
        if (file !== undefined && !reached.has(file)) {
            reached.add(file);
            queue.push(...(edges.get(file) ?? []).filter(inside));
        }
    }
    return reached;
};

const scriptTokens = function scriptTokens(command: string): readonly string[] {
    return command.split(TOKEN_SEPARATOR).filter((token) => token.endsWith(SOURCE_EXTENSION));
};

export const scriptTargets = function scriptTargets(): ReadonlySet<string> {
    const targets = new Set<string>();
    for (const dir of [WORKSPACE_POSIX, ...memberDirs()]) {
        const { scripts } = manifestAt(dir);
        const commands = isManifestRecord(scripts)
            ? Object.values(scripts).filter((value) => typeof value === "string")
            : [];
        for (const token of commands.flatMap(scriptTokens)) {
            targets.add(absoluteOf(collapsePath(`${dir}/${token}`)));
        }
    }
    return targets;
};

const EMPTY_OPTION = "";

export const gateTargets = function gateTargets(): ReadonlySet<string> {
    const { stages } = stagesFor({
        cleanCommentsIgnore: EMPTY_OPTION,
        hexIgnore: EMPTY_OPTION,
        qualityRoot: EMPTY_OPTION,
        scope: new Set<string>(),
    });
    const commands = stages.flatMap((stage) =>
        stage.steps.flatMap((step) => (step.parallel ? step.parallel.map((sub) => sub.run) : [step.run ?? ""])),
    );
    return new Set(
        commands.flatMap(scriptTokens).map((token) => absoluteOf(collapsePath(`${WORKSPACE_POSIX}/${token}`))),
    );
};
