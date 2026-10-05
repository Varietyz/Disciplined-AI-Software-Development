import type { Spec, WorkspaceMap } from "#types/document.output.types";
import { hardeningAbort, hardeningLine } from "#configuration/strings/diagram.strings";
import { stampGenerated, writeVerbatim } from "@govlab/canonical-write";
import { dirname } from "node:path";
import { mermaidHardening } from "#core/analyzers/diagram.analyzer";
import { mkdirSync } from "node:fs";
import { readTextSafe } from "#core/loaders/base.loader";

const LINE_BREAK = "\n";

const writeHardened = function writeHardened(path: string, content: string): void {
    const hits = mermaidHardening(content);
    if (hits.length > 0) {
        const detail = hits.map((hit) => hardeningLine(hit.line, hit.code, hit.detail)).join(LINE_BREAK);
        throw new Error(hardeningAbort(path, detail));
    }
    writeVerbatim(path, content);
};

export const persistSpec = function persistSpec(spec: Spec, content: string): void {
    if (spec.mkdir === true) {
        mkdirSync(dirname(spec.path), { recursive: true });
    }
    if (spec.harden === true) {
        writeHardened(spec.path, content);
        return;
    }
    writeVerbatim(spec.path, content);
};

export const healFile = function healFile(target: string, content: string): boolean {
    if ((readTextSafe(target) ?? "") === content) {
        return false;
    }
    mkdirSync(dirname(target), { recursive: true });
    writeVerbatim(target, content);
    return true;
};

export const healMarkdown = function healMarkdown(target: string, body: string): boolean {
    return healFile(target, stampGenerated(body, readTextSafe(target) ?? "", new Date()));
};

export const persistWorkspaceMap = function persistWorkspaceMap(map: WorkspaceMap): void {
    mkdirSync(dirname(map.path), { recursive: true });
    writeVerbatim(map.path, map.content);
};
