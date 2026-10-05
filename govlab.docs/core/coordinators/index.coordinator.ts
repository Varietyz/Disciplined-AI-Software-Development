import type { ByGroup, PackageInfo, RenderedIndex } from "#types/index.types";
import { indexedCount, regeneratedIndex, upToDate, wroteFile } from "#configuration/strings/index.strings";
import { renderIndexMarkdown, roleOf } from "#core/formatters/index.formatter";
import type { IndexTargets } from "#types/document.output.types";
import { ROOT } from "@ssot/paths";
import { govlabPrettierConfig } from "@govlab/quality/config";
import { healFile } from "#core/persistence/document.persistence";
import { inspectPackage } from "#core/analyzers/package.analyzer";
import { join } from "node:path";
import prettier from "prettier";
import { print } from "#core/reporters/base.reporter";
import { readTextSafe } from "#core/loaders/base.loader";
import { stampGenerated } from "@govlab/canonical-write";
import { workspaceMembers } from "#core/loaders/package.loader";

const POSIX_SEPARATOR = "/";
const NAME_DOT = ".";

const groupOf = function groupOf(relPath: string): string {
    const cut = relPath.indexOf(POSIX_SEPARATOR);
    if (cut !== -1) {
        return relPath.slice(0, cut);
    }
    const bare = relPath.startsWith(NAME_DOT) ? relPath.slice(NAME_DOT.length) : relPath;
    return bare.split(NAME_DOT)[0] ?? bare;
};

const byGroupOf = function byGroupOf(packages: readonly PackageInfo[]): ByGroup {
    const byGroup: ByGroup = {};
    for (const pkg of packages) {
        byGroup[pkg.group] = [...(byGroup[pkg.group] ?? []), pkg];
    }
    return Object.fromEntries(
        Object.entries(byGroup).map(([group, list]) => [
            group,
            list.toSorted((left, right) => left.slug.localeCompare(right.slug)),
        ]),
    );
};

const payloadOf = function payloadOf(packages: readonly PackageInfo[], byGroup: ByGroup): Record<string, unknown> {
    return {
        generatedAt: null,
        groups: Object.fromEntries(
            Object.entries(byGroup).map(([group, list]) => [
                group,
                { packages: list.map((pkg) => pkg.name), role: roleOf(group) },
            ]),
        ),
        packages,
        totalPackages: packages.length,
    };
};

const renderIndex = async function renderIndex(targets: IndexTargets): Promise<RenderedIndex> {
    const packages = workspaceMembers(ROOT)
        .flatMap((relPath) => {
            const info = inspectPackage(join(ROOT, relPath), {
                group: groupOf(relPath),
                packageName: relPath,
                repoRoot: ROOT,
            });
            return info === null ? [] : [info];
        })
        .toSorted((left, right) => left.name.localeCompare(right.name));
    const byGroup = byGroupOf(packages);
    const base = await govlabPrettierConfig(ROOT);
    const payload = JSON.stringify(payloadOf(packages, byGroup));
    return {
        count: packages.length,
        groups: Object.keys(byGroup).length,
        json: await prettier.format(payload, { ...base, filepath: targets.json.path }),
        md: stampGenerated(
            renderIndexMarkdown(packages, byGroup),
            readTextSafe(targets.markdown.path) ?? "",
            new Date(),
        ),
    };
};

export const runIndex = async function runIndex(check: boolean, targets: IndexTargets): Promise<void> {
    const rendered = await renderIndex(targets);
    const markdownHealed = healFile(targets.markdown.path, rendered.md);
    const jsonHealed = healFile(targets.json.path, rendered.json);
    if (check) {
        const healed = markdownHealed || jsonHealed;
        print(healed ? regeneratedIndex(targets.markdown.rel, targets.json.rel) : upToDate(targets.markdown.rel));
        return;
    }
    print(wroteFile(targets.markdown.rel));
    print(wroteFile(targets.json.rel));
    print(indexedCount(rendered.count, rendered.groups));
};
