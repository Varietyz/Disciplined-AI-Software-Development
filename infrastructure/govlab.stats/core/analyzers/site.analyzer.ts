import type { AppStats, PageStats, Tally } from "#types/site.types";
import { PAGE_MARKER, STYLE_EXTENSION } from "#configuration/constants/site.constants";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extensionOf, posixOf } from "#core/selectors/source.selector";
import { isAuthoredRole, roleOf } from "#core/classifiers/source.classifier";
import { readdirSafe, walkFiles } from "#core/loaders/folder.loader";
import type { PathExclusion } from "@govlab/quality/config";
import { countLines } from "#core/analyzers/text.analyzer";
import { isGeneratedPath } from "#core/predicates/source.predicate";
import path from "node:path";
import { relativePath } from "@ssot/paths";

const EMPTY: AppStats = {
    assetBytes: 0,
    assetFiles: 0,
    pages: [],
    present: false,
    sourceFiles: 0,
    sourceLines: 0,
    styles: 0,
    subsystems: [],
};

const descendantDirs = function descendantDirs(
    absDir: string,
    exclude: readonly string[],
    ignore: PathExclusion,
): number {
    return readdirSafe(absDir)
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(absDir, entry.name))
        .filter((abs) => !ignore(abs) && !exclude.includes(abs))
        .reduce((count, abs) => count + 1 + descendantDirs(abs, exclude, ignore), 0);
};

const isAuthoredSource = function isAuthoredSource(abs: string): boolean {
    const role = roleOf(extensionOf(path.basename(abs)));
    return isAuthoredRole(role) && !isGeneratedPath(abs, abs);
};

const codeLinesOf = function codeLinesOf(abs: string): number {
    return countLines(readFileSync(abs, "utf8")).code;
};

const sourceLinesOf = function sourceLinesOf(files: readonly string[]): { files: number; lines: number } {
    const counted = files.filter(isAuthoredSource).map(codeLinesOf);
    return { files: counted.length, lines: counted.reduce((sum, lines) => sum + lines, 0) };
};

const pagesUnder = function pagesUnder(memberAbs: string, memberRel: string, ignore: PathExclusion): PageStats[] {
    const markers = walkFiles(memberAbs, ignore).filter((abs) => path.basename(abs) === PAGE_MARKER);
    const depths = markers.map((abs) => path.relative(memberAbs, abs).split(path.sep).length);
    const shallowest = Math.min(...depths, Number.MAX_SAFE_INTEGER);
    const pageDirs = markers.map((abs) => path.dirname(abs));
    return markers
        .map((abs, index) => {
            const dir = path.dirname(abs);
            const nested = pageDirs.filter((other) => other.startsWith(`${dir}${path.sep}`));
            const own = walkFiles(dir, ignore).filter(
                (file) => !nested.some((inner) => file.startsWith(`${inner}${path.sep}`)),
            );
            const counted = sourceLinesOf(own);
            return {
                files: counted.files,
                isRoot: depths.at(index) === shallowest,
                lines: counted.lines,
                name: path.basename(dir),
                rel: `${memberRel}/${posixOf(path.relative(memberAbs, dir))}`,
                systems: descendantDirs(dir, nested, ignore),
            };
        })
        .toSorted((a, b) => Number(a.isRoot) - Number(b.isRoot) || b.lines - a.lines);
};

const tallyOne = function tallyOne(tally: Tally, abs: string): void {
    if (extensionOf(path.basename(abs)) === STYLE_EXTENSION) {
        tally.styles += 1;
    }
    if (isAuthoredSource(abs)) {
        tally.sourceFiles += 1;
        tally.sourceLines += codeLinesOf(abs);
        return;
    }
    tally.assetBytes += statSync(abs).size;
    tally.assetFiles += 1;
};

export const collectApp = function collectApp(
    root: string,
    containerRoots: readonly string[],
    ignore: PathExclusion,
): AppStats {
    const memberRel = relativePath("app.root");
    const memberAbs = path.join(root, memberRel);
    if (!existsSync(memberAbs)) {
        return EMPTY;
    }
    const tally: Tally = { assetBytes: 0, assetFiles: 0, sourceFiles: 0, sourceLines: 0, styles: 0 };
    for (const abs of walkFiles(memberAbs, ignore)) {
        tallyOne(tally, abs);
    }
    const subsystems = containerRoots
        .map((container) => ({
            container,
            folders: readdirSafe(path.join(root, container)).filter((entry) => entry.isDirectory()).length,
        }))
        .filter((entry) => entry.folders > 0)
        .toSorted((a, b) => b.folders - a.folders);
    return { ...tally, pages: pagesUnder(memberAbs, memberRel, ignore), present: true, subsystems };
};
