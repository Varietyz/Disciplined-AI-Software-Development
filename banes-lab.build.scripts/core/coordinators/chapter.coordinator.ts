import { attributionOf, surfaceInputFiles } from "@banes-lab/content/core/loaders/chapter.loader.ts";
import { chapterRefused, chaptersLine } from "#configuration/strings/chapter.strings";
import { collectFiles, fingerprint, fingerprintOf } from "@govlab/content-fingerprint";
import { CHAPTER_SHAPES } from "@banes-lab/content/configuration/constants/chapter.constants.ts";
import type { ChapterShape } from "@banes-lab/content/types/chapter.types.ts";
import { absolutePath } from "@ssot/paths";
import { renderSurface } from "@banes-lab/content/core/coordinators/chapter.coordinator.ts";

const SOURCE_EXTENSION = ".ts";

export const surfacesKey = function surfacesKey(): string {
    const inputs = [...new Set(CHAPTER_SHAPES.flatMap(surfaceInputFiles))];
    const code = collectFiles(absolutePath("app.content"), { include: (name) => name.endsWith(SOURCE_EXTENSION) });
    return fingerprintOf([fingerprint(inputs), fingerprint(code), JSON.stringify(attributionOf())]);
};

const renderShape = async function renderShape(shape: ChapterShape): Promise<string> {
    const result = await renderSurface(shape);
    if (!result.ok) {
        throw new Error(chapterRefused(shape, result.reason));
    }
    return chaptersLine(shape, result.chapters.length, result.removed.length, result.out);
};

export const renderSurfaces = async function renderSurfaces(): Promise<string> {
    return CHAPTER_SHAPES.reduce(
        async (previous, shape) => (await previous) + (await renderShape(shape)),
        Promise.resolve(""),
    );
};
