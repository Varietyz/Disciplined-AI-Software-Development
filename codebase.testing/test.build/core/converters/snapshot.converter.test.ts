import { describe, expect, it } from "vitest";
import type { AnatomyFolder } from "@banes-lab/web/types/anatomy.types.ts";
import { convert } from "./anatomy.fixture.ts";
import { qualifiedSnapshot } from "@banes-lab/build-scripts/core/converters/snapshot.converter.ts";

const MARK = "build~";

const qualify = function qualify(path: string): string {
    return MARK + path;
};

const pathsOf = function pathsOf(folder: AnatomyFolder): readonly string[] {
    return [
        folder.id,
        folder.path,
        ...folder.findings.map((finding) => finding.file),
        ...folder.files.flatMap((file) => [
            file.id,
            file.path,
            ...file.findings.map((finding) => finding.file),
            ...file.definitions.flatMap((definition) => [
                definition.id,
                definition.file,
                ...[...definition.callees, ...definition.callers].flatMap((ref) => [ref.id, ref.file]),
            ]),
        ]),
        ...folder.folders.flatMap(pathsOf),
    ];
};

describe("qualifiedSnapshot", () => {
    it("qualifies every path the snapshot carries and keeps everything else", () => {
        const snapshot = convert();
        const qualified = qualifiedSnapshot(snapshot, qualify);
        const paths = [
            ...pathsOf(qualified.tree),
            ...qualified.findings.map((finding) => finding.file),
            ...qualified.imports.flatMap((edge) => [edge.from, edge.to]),
        ];
        expect(paths.length).toBeGreaterThan(0);
        expect(paths.filter((path) => !path.startsWith(MARK))).toStrictEqual([]);
        expect(pathsOf(qualified.tree)).toHaveLength(pathsOf(snapshot.tree).length);
        expect(qualified.metrics).toStrictEqual(snapshot.metrics);
    });
});
