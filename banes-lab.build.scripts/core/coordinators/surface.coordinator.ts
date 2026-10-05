import type { FigureFrame, ScenarioTool, SurfaceRecord } from "#types/surface.types";
import {
    HASHED_FOLDERS,
    INSTALL_FOLDER,
    RECORDER_FOLDERS,
    RECORDER_SUBJECT,
    SCENARIO,
    SCRIPT_RUNNER,
    TEMPORARY_PREFIX,
} from "#configuration/constants/surface.constants";
import { basename, join, relative } from "node:path";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { scriptMissing, slotsUnreadable } from "#configuration/strings/surface.strings";
import { ScenarioPlayer } from "#core/adapters/surface.adapter";
import type { SurfaceFigureName } from "@banes-lab/web/types/surface.types.ts";
import { absolutePath } from "@ssot/paths";
import { createHash } from "node:crypto";
import { isRecord } from "#core/selectors/base.selector";
import { pathToFileURL } from "node:url";
import { recordingsOf } from "#core/converters/surface.converter";
import { replaceFolderFiles } from "#core/persistence/asset.persistence";
import { supplyCoordination } from "#core/persistence/coordination.persistence";
import { surfaceLocation } from "@banes-lab/web/core/assets/surface.asset.ts";
import { tmpdir } from "node:os";

const UTF8 = "utf8";

const LINE_BREAK = "\n";

const HASH = "sha256";

const HEX = "hex";

const TOOLS: readonly ScenarioTool[] = ["await", "govern"];

type SlotText = (section: string, name: string) => string;

const isSlotText = function isSlotText(value: unknown): value is SlotText {
    return typeof value === "function";
};

const filesUnder = function filesUnder(root: string, folder: string): string[] {
    const base = join(root, folder);
    if (!existsSync(base)) {
        return [];
    }
    return readdirSync(base, { encoding: UTF8, recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => join(entry.parentPath, entry.name));
};

const inputsHash = function inputsHash(member: string): string {
    const hash = createHash(HASH).update(JSON.stringify(SCENARIO));
    const files = HASHED_FOLDERS.flatMap((folder) => filesUnder(member, folder)).toSorted((left, right) =>
        left.localeCompare(right),
    );
    for (const file of [join(member, "package.json"), ...files]) {
        hash.update(relative(member, file)).update(readFileSync(file));
    }
    const build = absolutePath("app.build");
    const sources = RECORDER_FOLDERS.flatMap((folder) => filesUnder(build, folder))
        .filter((file) => basename(file).startsWith(RECORDER_SUBJECT))
        .toSorted((left, right) => left.localeCompare(right));
    for (const source of sources) {
        hash.update(relative(build, source)).update(readFileSync(source));
    }
    return hash.digest(HEX);
};

const figureNames = function figureNames(): SurfaceFigureName[] {
    return [...new Set(SCENARIO.steps.flatMap((step) => step.figures))];
};

const reusable = function reusable(inputs: string): boolean {
    return figureNames().every((figure) => {
        const path = join(absolutePath("app.surfaces"), basename(surfaceLocation(figure)));
        const parsed: unknown = existsSync(path) ? JSON.parse(readFileSync(path, UTF8)) : null;
        return isRecord(parsed) && parsed["inputs"] === inputs;
    });
};

const scriptsOf = function scriptsOf(install: string): ReadonlyMap<ScenarioTool, string> {
    const parsed: unknown = JSON.parse(readFileSync(join(install, "package.json"), UTF8));
    const scripts = isRecord(parsed) && isRecord(parsed["scripts"]) ? parsed["scripts"] : {};
    return new Map(
        TOOLS.map((tool) => {
            const script = scripts[tool];
            if (typeof script !== "string" || !script.startsWith(SCRIPT_RUNNER)) {
                throw new Error(scriptMissing(tool));
            }
            return [tool, script.slice(SCRIPT_RUNNER.length)];
        }),
    );
};

const raiseBoard = async function raiseBoard(install: string): Promise<void> {
    const loaded: unknown = await import(pathToFileURL(join(install, "config", "surface.config.ts")).href);
    const read = isRecord(loaded) ? loaded["slotText"] : null;
    if (!isSlotText(read)) {
        throw new Error(slotsUnreadable());
    }
    copyFileSync(join(install, read("surface", "board_template")), join(install, read("surface", "board")));
};

const record = async function record(member: string): Promise<readonly FigureFrame[]> {
    const host = mkdtempSync(join(tmpdir(), TEMPORARY_PREFIX));
    const install = join(host, INSTALL_FOLDER);
    try {
        await supplyCoordination(member, install);
        await raiseBoard(install);
        for (const sample of SCENARIO.samples) {
            writeFileSync(join(host, sample.name), sample.text + LINE_BREAK, UTF8);
        }
        return await new ScenarioPlayer(install, scriptsOf(install)).play();
    } finally {
        rmSync(host, { force: true, maxRetries: 5, recursive: true });
    }
};

export const recordSurfaces = async function recordSurfaces(): Promise<SurfaceRecord> {
    const member = absolutePath("app.coordination");
    const inputs = inputsHash(member);
    if (reusable(inputs)) {
        return { figures: figureNames().length, reused: true };
    }
    const recordings = recordingsOf(await record(member), inputs);
    const files = [...recordings].map(([figure, recording]): [string, string] => [
        basename(surfaceLocation(figure)),
        `${JSON.stringify(recording, null, 4)}\n`,
    ]);
    replaceFolderFiles(absolutePath("app.surfaces"), new Map(files));
    return { figures: recordings.size, reused: false };
};
