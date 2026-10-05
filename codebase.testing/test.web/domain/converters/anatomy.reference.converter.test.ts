import type { AnatomyFile, AnatomyFolder } from "@banes-lab/web/types/anatomy.types.ts";
import {
    CALLS_RELATION,
    DEFINITIONS_RELATION,
    FILES_RELATION,
    FOLDERS_RELATION,
    FOLDER_RELATION,
    ROOT_LABEL,
} from "@banes-lab/web/configuration/strings/folder.strings.ts";
import { anatomyIndexOf, anatomyRecordsOf } from "@banes-lab/web/domain/converters/anatomy.reference.converter.ts";
import { describe, expect, it } from "vitest";
import { ANATOMY } from "@banes-lab/web/core/generated/anatomy.generated.ts";
import type { ReferenceRecord } from "@banes-lab/web/types/reference.types.ts";

const filesOf = function filesOf(folder: AnatomyFolder): readonly AnatomyFile[] {
    return [...folder.files, ...folder.folders.flatMap(filesOf)];
};

const foldersOf = function foldersOf(folder: AnatomyFolder): readonly AnatomyFolder[] {
    return [folder, ...folder.folders.flatMap(foldersOf)];
};

const labelsOf = function labelsOf(record: ReferenceRecord | undefined, relation: string): readonly string[] {
    return record?.relations.find((held) => held.relation === relation)?.edges.map((edge) => edge.label) ?? [];
};

const ROOT = ANATOMY.tree;
const CALLING = filesOf(ROOT).find((file) => file.definitions.some((definition) => definition.callees.length > 0));

describe("anatomyRecordsOf", () => {
    it("gives a file its folder, its definitions and one record per definition with the definitions it calls", () => {
        const records = anatomyRecordsOf([ROOT]);
        expect(CALLING).toBeDefined();
        const file = CALLING ?? ROOT.files[0];
        if (file === undefined) {
            return;
        }
        const built = records.file(file);
        expect(built.node.name).toBe(file.name);
        expect(labelsOf(built.node, FOLDER_RELATION)).toHaveLength(1);
        expect(labelsOf(built.node, DEFINITIONS_RELATION)).toStrictEqual(file.definitions.map((entry) => entry.name));
        expect(Object.keys(built.definitions).sort()).toStrictEqual(
            [...new Set(file.definitions.map((entry) => String(entry.line)))].sort(),
        );
        const calling = file.definitions.find((definition) => definition.callees.length > 0);
        expect(labelsOf(built.definitions[String(calling?.line)], CALLS_RELATION)).toStrictEqual(
            calling?.callees.map((callee) => callee.name),
        );
    });

    it("names the root folder by its label and lists its child folders and files", () => {
        const built = anatomyRecordsOf([ROOT]).folder(ROOT);
        expect(built.node.name).toBe(ROOT_LABEL);
        expect(built.definitions).toStrictEqual({});
        expect(labelsOf(built.node, FOLDERS_RELATION)).toStrictEqual(ROOT.folders.map((folder) => folder.name));
        expect(labelsOf(built.node, FILES_RELATION)).toStrictEqual(ROOT.files.map((file) => file.name));
    });
});

describe("anatomyIndexOf", () => {
    it("maps every node that carries a records asset, and every file with a source to its source and references", () => {
        const index = anatomyIndexOf([ROOT]);
        const carried = [...foldersOf(ROOT), ...filesOf(ROOT)].filter((node) => node.records !== undefined);
        expect(Object.keys(index.nodes)).toHaveLength(carried.length);
        const sourced = filesOf(ROOT).filter((file) => file.source !== null);
        expect(Object.keys(index.sources)).toHaveLength(sourced.length);
        const [first] = sourced;
        expect(first === undefined ? null : index.sources[first.path]).toStrictEqual(
            first === undefined ? null : { references: first.references ?? null, source: first.source },
        );
    });
});
