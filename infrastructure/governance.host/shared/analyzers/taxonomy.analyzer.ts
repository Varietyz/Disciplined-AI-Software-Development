import { TAG_ALTERNATIVE, TAG_LIST } from "../strings/taxonomy.strings.ts";
import { fixtureMarkerOf, mirrorSourceOf, testMarkerOf, testMarkers } from "../manifests/taxonomy.root.manifest.ts";
import { isExempt, isParsed, parseFilename } from "../matchers/filename.matcher.ts";
import {
    isMarkerFolder,
    isNameExempt,
    isSpecialContainer,
    markerFolderOf,
    tagsForFolder,
    vocabularyFor,
} from "../manifests/taxonomy.manifest.ts";
import type { PlacementFinding } from "../../types/taxonomy.types.ts";
import { WORKSPACE_ROOT } from "../resolvers/anchor.resolver.ts";
import { existsSync } from "node:fs";
import { folderPathError } from "../matchers/folder.matcher.ts";
import { join } from "node:path";

const PATH_SEPARATOR = "/";

const markerFinding = function markerFinding(
    basename: string,
    folders: readonly string[],
    root: string,
): PlacementFinding | null {
    const expected = markerFolderOf(basename, root);
    const parent = folders.at(-1) ?? "";
    const path = [root, ...folders].join(PATH_SEPARATOR);
    if (expected === undefined) {
        return isMarkerFolder(parent, root) ? { data: { basename, path }, messageId: "markerFolderIntruder" } : null;
    }
    return parent === expected ? null : { data: { basename, expected, path }, messageId: "markerMisplaced" };
};

export const placementFinding = function placementFinding(
    basename: string,
    folders: readonly string[],
    root: string,
): PlacementFinding | null {
    const misplaced = markerFinding(basename, folders, root);
    if (misplaced !== null) {
        return misplaced;
    }
    if (markerFolderOf(basename, root) === undefined && isNameExempt(basename, root)) {
        return null;
    }
    const detail = folderPathError(root, folders);
    return detail === undefined
        ? null
        : { data: { detail, path: folders.join(PATH_SEPARATOR) }, messageId: "badShape" };
};

const subjectNameOf = function subjectNameOf(basename: string, separator: string): string {
    const segments = basename.split(separator);
    return [...segments.slice(0, -2), ...segments.slice(-1)].join(separator);
};

const mirroredFinding = function mirroredFinding(
    basename: string,
    folders: readonly string[],
    root: string,
    source: string,
): PlacementFinding | null {
    const detail = folderPathError(root, folders);
    if (detail !== undefined) {
        return { data: { detail, path: folders.join(PATH_SEPARATOR) }, messageId: "badShape" };
    }
    if (testMarkerOf(basename) === undefined) {
        return null;
    }
    const subject = subjectNameOf(basename, vocabularyFor(root).separator);
    return existsSync(join(WORKSPACE_ROOT, source, ...folders, subject))
        ? null
        : { data: { basename, source, subject }, messageId: "unmirroredTest" };
};

export const testFinding = function testFinding(
    basename: string,
    folders: readonly string[],
    root: string,
): PlacementFinding | null {
    const marker = testMarkerOf(basename) ?? fixtureMarkerOf(basename, root);
    const source = mirrorSourceOf(root);
    if (source === undefined) {
        return marker === undefined ? null : { data: { basename, marker }, messageId: "misplacedTest" };
    }
    if (marker === undefined) {
        return isNameExempt(basename, root)
            ? null
            : { data: { basename, markers: testMarkers().join(TAG_LIST) }, messageId: "nonTestInMirror" };
    }
    return mirroredFinding(basename, folders, root, source);
};

export const namingFinding = function namingFinding(
    basename: string,
    folders: readonly string[],
    root: string,
): PlacementFinding | null {
    if (isNameExempt(basename, root)) {
        return null;
    }
    const parsed = parseFilename(basename, root);
    if (isExempt(parsed)) {
        return null;
    }
    if (!isParsed(parsed)) {
        return { data: { basename, reason: parsed.reason, word: parsed.word }, messageId: "unparsable" };
    }
    const container = folders[0] ?? "";
    const folder = isSpecialContainer(root, container) ? container : (folders.at(-1) ?? "");
    const folderTags = tagsForFolder(folder, root);
    if (folderTags.length === 0 || folderTags.includes(parsed.concern)) {
        return null;
    }
    return {
        data: { basename, folder, folderTag: folderTags.join(TAG_ALTERNATIVE), tag: parsed.concern },
        messageId: "concernMismatch",
    };
};
