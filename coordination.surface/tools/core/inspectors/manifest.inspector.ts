import { HOST_CLAIM, manifestFinding, reachFinding } from "../factories/manifest.factory.ts";
import { basename, dirname, relative, resolve } from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { toPosix, walk } from "../iterators/file.iterator.ts";
import type { Finding } from "../types/segment.types.ts";
import { SURFACE_ROOT } from "../constants/path.constants.ts";
import { dependencyReach } from "../resolvers/dependency.resolver.ts";
import { isFilesystemRefusal } from "../predicates/file.predicate.ts";
import { isObject } from "../predicates/schema.predicate.ts";
import { readJson } from "../readers/json.reader.ts";
import { splitWords } from "../predicates/text.predicate.ts";

export const MANIFEST = "package.json";

const SCRIPT_TARGETS = [".ts", ".js", ".mjs", ".cjs", ".json"];

const SUBPATH_FIELDS = ["imports", "exports"];

const MANIFEST_ROOTS = [SURFACE_ROOT];

const CLIMB = "..";

type Parsed =
    { readonly ok: false; readonly error: string } | { readonly ok: true; readonly value: Record<string, unknown> };

const endsWithAny = function endsWithAny(text: string, suffixes: readonly string[]): boolean {
    return suffixes.some((suffix) => text.length > suffix.length && text.endsWith(suffix));
};

const isRooted = function isRooted(token: string): boolean {
    return token.startsWith("/") || token.startsWith("\\") || token.charAt(1) === ":";
};

const isRepoRelative = function isRepoRelative(token: string): boolean {
    return token.length > 0 && !token.startsWith("-") && !isRooted(token);
};

export const climbsOut = function climbsOut(token: string): boolean {
    return token.split("/").includes(CLIMB);
};

const entriesOf = function entriesOf(value: unknown): [string, unknown][] {
    if (Array.isArray(value)) {
        return value.map((item: unknown, index): [string, unknown] => [String(index), item]);
    }
    return isObject(value) ? Object.entries(value) : [];
};

const holdsManifest = function holdsManifest(parent: string): boolean {
    try {
        return readdirSync(parent, { withFileTypes: true }).some(
            (child) => child.isDirectory() && existsSync(resolve(parent, child.name, MANIFEST)),
        );
    } catch (error) {
        if (isFilesystemRefusal(error)) {
            return false;
        }
        throw error;
    }
};

const resolvesToPackage = function resolvesToPackage(packageDir: string, entry: string): boolean {
    const star = entry.indexOf("*");
    return star === -1
        ? existsSync(resolve(packageDir, entry, MANIFEST))
        : holdsManifest(resolve(packageDir, entry.slice(0, star)));
};

const manifestPaths = function manifestPaths(repoRoot: string, ignored: readonly string[]): string[] {
    const skip = ignored.filter((name) => name !== MANIFEST);

    return MANIFEST_ROOTS.map((root) => resolve(repoRoot, root))
        .filter((absolute) => existsSync(absolute))
        .flatMap((absolute) => walk({ extensions: [], ignored: skip, root: absolute }))
        .filter((file) => basename(file) === MANIFEST);
};

const parsedManifest = function parsedManifest(repoRoot: string, manifestAbs: string): Parsed {
    try {
        const value = readJson(
            readFileSync(manifestAbs, "utf8"),
            isObject,
            relative(repoRoot, manifestAbs),
            "a JSON object",
        );
        return { ok: true, value };
    } catch (error) {
        return { error: String(error), ok: false };
    }
};

const runtimeFindings = function runtimeFindings(manifestPath: string, runtime: unknown): Finding[] {
    return entriesOf(runtime).map(([name]) =>
        manifestFinding(
            manifestPath,
            "declaredRuntimeDependency",
            `dependencies "${name}"`,
            `${name} is declared as a RUNTIME dependency`,
            "runtime code here takes no third-party dependency, so a consumer needs no toolchain of its own to run what it adopted — a declared runtime dependency makes this package's reach a function of what the consumer already has, and the invariant it breaks is one no amount of noticing holds because a manifest field is read by installers rather than by readers. Vendor the behavior, move it behind an injected port the consumer supplies, or demote it to a development dependency where it does not travel; where one is genuinely structurally unavoidable, that judgment is the maintainer's and is recorded rather than assumed, which is why this does not heal",
        ),
    );
};

const workspaceFindings = function workspaceFindings(
    manifestPath: string,
    packageDir: string,
    workspaces: unknown,
): Finding[] {
    return entriesOf(Array.isArray(workspaces) ? workspaces : [])
        .map(([, entry]) => entry)
        .filter((entry): entry is string => typeof entry === "string")
        .filter((entry) => !resolvesToPackage(packageDir, entry))
        .map((entry) =>
            manifestFinding(
                manifestPath,
                "emptyWorkspaceGlob",
                `workspaces "${entry}"`,
                `${entry} matches no directory holding a ${MANIFEST}`,
                `point the glob at the directory that actually holds the ${MANIFEST}, or drop it — a glob matching nothing installs nothing and warns only on some commands`,
            ),
        );
};

const isUnresolvedSubpath = function isUnresolvedSubpath(packageDir: string, value: unknown): value is string {
    if (typeof value !== "string") {
        return false;
    }
    const [concrete = value] = value.split("*");
    return concrete.length > 0 && !existsSync(resolve(packageDir, concrete));
};

const subpathFindings = function subpathFindings(
    manifestPath: string,
    packageDir: string,
    parsed: Record<string, unknown>,
): Finding[] {
    return SUBPATH_FIELDS.flatMap((field) =>
        entriesOf(parsed[field]).flatMap(([key, value]) =>
            isUnresolvedSubpath(packageDir, value)
                ? [
                      manifestFinding(
                          manifestPath,
                          "unresolvedSubpath",
                          `${field} "${key}"`,
                          value,
                          "the target does not exist — correct it or remove the entry, because a broken subpath fails only at the import that uses it",
                      ),
                  ]
                : [],
        ),
    );
};

const targetFinding = function targetFinding(
    manifestPath: string,
    packageDir: string,
    name: string,
    token: string,
): Finding[] {
    if (climbsOut(token)) {
        return [manifestFinding(manifestPath, "hostClaimingScriptTarget", `scripts.${name}`, token, HOST_CLAIM)];
    }
    return existsSync(resolve(packageDir, token))
        ? []
        : [
              manifestFinding(
                  manifestPath,
                  "unresolvedScriptTarget",
                  `scripts.${name}`,
                  token,
                  "the script names a file that does not exist — a renamed entrypoint leaves the documented command failing at the moment someone needs it",
              ),
          ];
};

const scriptFindings = function scriptFindings(manifestPath: string, packageDir: string, scripts: unknown): Finding[] {
    return entriesOf(scripts).flatMap(([name, command]) =>
        typeof command === "string"
            ? splitWords(command)
                  .filter((token) => isRepoRelative(token) && endsWithAny(token, SCRIPT_TARGETS))
                  .flatMap((token) => targetFinding(manifestPath, packageDir, name, token))
            : [],
    );
};

const inspectOne = function inspectOne(repoRoot: string, manifestAbs: string): Finding[] {
    const parsed = parsedManifest(repoRoot, manifestAbs);
    if (!parsed.ok) {
        return [
            manifestFinding(
                relative(repoRoot, manifestAbs),
                "unparsableManifest",
                MANIFEST,
                parsed.error,
                "the manifest is not valid JSON — every npm script in this package is dead until it parses",
            ),
        ];
    }

    const manifestPath = toPosix(repoRoot, manifestAbs);
    const packageDir = dirname(manifestAbs);
    const { value } = parsed;

    return [
        ...runtimeFindings(manifestPath, value["dependencies"]),
        ...dependencyReach(packageDir, manifestAbs).unreached.map((name) => reachFinding(manifestPath, name)),
        ...workspaceFindings(manifestPath, packageDir, value["workspaces"]),
        ...subpathFindings(manifestPath, packageDir, value),
        ...scriptFindings(manifestPath, packageDir, value["scripts"]),
    ];
};

export const inspectManifests = function inspectManifests(repoRoot: string, ignored: readonly string[]): Finding[] {
    return manifestPaths(repoRoot, ignored).flatMap((manifest) => inspectOne(repoRoot, manifest));
};
