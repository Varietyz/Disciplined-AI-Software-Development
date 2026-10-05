import type { WorkspaceMap, WorkspaceMapDeps } from "#types/document.output.types";
import { mermaidHardening } from "#core/analyzers/diagram.analyzer";
import { readTextSafe } from "#core/loaders/base.loader";
import { resolve } from "node:path";
import { stampGenerated } from "@govlab/canonical-write";
import { workspaceMapDoc } from "#core/converters/dependency.converter";
import { workspaceMapHardening } from "#configuration/strings/drift.strings";

export const workspaceMapTargetFor = function workspaceMapTargetFor(
    deps: WorkspaceMapDeps,
): () => Promise<WorkspaceMap | null> {
    return async function workspaceMapTarget(): Promise<WorkspaceMap | null> {
        const modules = deps.discoverAll();
        if (modules.length === 0) {
            return null;
        }
        const doc = workspaceMapDoc(modules);
        const rel = deps.declaredDocLocation(doc);
        const path = resolve(deps.root, rel);
        const rendered = await deps.formatMarkdown(deps.renderDeclaredDoc(doc));
        const content = stampGenerated(rendered, readTextSafe(path) ?? "", new Date());
        const [first] = mermaidHardening(content);
        if (first !== undefined) {
            throw new Error(workspaceMapHardening(rel, first.code, first.detail));
        }
        return { content, path, rel };
    };
};
