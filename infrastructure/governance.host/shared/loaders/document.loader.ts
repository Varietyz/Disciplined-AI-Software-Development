import { WORKSPACE_POSIX, memberDirs } from "./manifest.loader.ts";
import { existsSync, readFileSync } from "node:fs";
import { jsonTexts, markdownTexts } from "../selectors/document.selector.ts";
import type { DocumentText } from "../../types/writing.types.ts";
import { absolutePath } from "@ssot/paths";
import path from "node:path";

const DOC_MANIFEST = "_manifest.json";

const relativeLabel = function relativeLabel(file: string): string {
    return path.relative(WORKSPACE_POSIX, file).split(path.sep).join(path.posix.sep);
};

export const governedManifests = function governedManifests(): readonly string[] {
    return [WORKSPACE_POSIX, ...memberDirs()]
        .map((dir) => path.join(dir, DOC_MANIFEST))
        .filter((file) => existsSync(file));
};

export const governedDocumentTexts = function governedDocumentTexts(): DocumentText[] {
    const policy = absolutePath("claudePolicy");
    const manifests = governedManifests().flatMap((file) => {
        const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
        return jsonTexts(relativeLabel(file), parsed);
    });
    return [...markdownTexts(relativeLabel(policy), readFileSync(policy, "utf8")), ...manifests];
};
