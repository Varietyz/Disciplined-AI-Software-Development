import { ARTIFACT_SUFFIXES, SLUG_JOIN, SVG_SUFFIX } from "#configuration/constants/report.constants";
import type { ModuleFindings, ModuleSvgs, ModuleTitle } from "#types/report.types";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { masterWritten, svgCollection } from "#configuration/strings/report.strings";
import { buildMasterFindings } from "#core/formatters/report.formatter";
import { loadModuleFindings } from "#core/loaders/finding.loader";
import process from "node:process";
import { relativePath } from "@ssot/paths";
import { writeVerbatim } from "@govlab/canonical-write";

export const HEX_DIR = relativePath("moduleInfo.root");

const isArtifact = function isArtifact(name: string): boolean {
    return ARTIFACT_SUFFIXES.some((suffix) => name.endsWith(suffix));
};

export const staleFiles = function staleFiles(hexDir: string, keep: ReadonlySet<string>): string[] {
    return (existsSync(hexDir) ? readdirSync(hexDir) : []).filter((name) => isArtifact(name) && !keep.has(name));
};

export const persistArtifacts = function persistArtifacts(
    moduleDir: string,
    artifacts: ReadonlyMap<string, string>,
): void {
    const hexDir = join(moduleDir, HEX_DIR);
    mkdirSync(hexDir, { recursive: true });
    for (const name of staleFiles(hexDir, new Set(artifacts.keys()))) {
        unlinkSync(join(hexDir, name));
    }
    for (const [name, content] of artifacts) {
        writeVerbatim(join(hexDir, name), `${content}\n`);
    }
};

const slugOf = function slugOf(fileName: string): string {
    return fileName.slice(0, Math.max(0, fileName.indexOf(SLUG_JOIN)));
};

export const writeSvgCollection = function writeSvgCollection(
    rootDir: string,
    units: readonly ModuleSvgs[],
    known: ReadonlySet<string>,
): void {
    const svgDir = join(rootDir, relativePath("moduleInfo.svg"));
    const ran = new Set(units.map((unit) => unit.slug));
    const written = new Map(
        units.flatMap((unit) =>
            [...unit.svgs].map(([page, markup]): [string, string] => [
                `${unit.slug}${SLUG_JOIN}${page}${SVG_SUFFIX}`,
                markup,
            ]),
        ),
    );
    mkdirSync(svgDir, { recursive: true });
    const pruned = readdirSync(svgDir).filter((name) => {
        const slug = slugOf(name);
        return name.endsWith(SVG_SUFFIX) && !written.has(name) && (ran.has(slug) || !known.has(slug));
    });
    for (const name of pruned) {
        unlinkSync(join(svgDir, name));
    }
    for (const [name, markup] of written) {
        writeVerbatim(join(svgDir, name), `${markup}\n`);
    }
    process.stdout.write(svgCollection(written.size, pruned.length, svgDir));
};

export const writeHexMaster = function writeHexMaster(masterPath: string, units: readonly ModuleTitle[]): void {
    const found = units
        .map((unit) => loadModuleFindings(unit.dir, unit.title))
        .filter((entry): entry is ModuleFindings => entry !== null);
    mkdirSync(dirname(masterPath), { recursive: true });
    writeVerbatim(masterPath, `${buildMasterFindings(found)}\n`);
    process.stdout.write(masterWritten(masterPath));
};
