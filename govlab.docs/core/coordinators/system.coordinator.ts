import { systemHardening, systemRegenerated, systemUpToDate, systemWrote } from "#configuration/strings/system.strings";
import type { OutputTarget } from "#types/document.output.types";
import { buildSystemModel } from "#core/loaders/system.loader";
import { healFile } from "#core/persistence/document.persistence";
import { mermaidHardening } from "#core/analyzers/diagram.analyzer";
import { print } from "#core/reporters/base.reporter";
import { readTextSafe } from "#core/loaders/base.loader";
import { renderDeclaredDoc } from "#core/formatters/document.formatter";
import { stampGenerated } from "@govlab/canonical-write";
import { systemDoc } from "#core/converters/system.converter";

const renderSystem = function renderSystem(target: OutputTarget): string {
    const doc = systemDoc(buildSystemModel());
    const markdown = stampGenerated(renderDeclaredDoc(doc), readTextSafe(target.path) ?? "", new Date());
    const [first] = mermaidHardening(markdown);
    if (first !== undefined) {
        throw new Error(systemHardening(target.rel, first.code, first.detail, first.line));
    }
    return markdown;
};

export const runSystem = function runSystem(check: boolean, target: OutputTarget): void {
    const healed = healFile(target.path, renderSystem(target));
    if (check) {
        print(healed ? systemRegenerated(target.rel) : systemUpToDate(target.rel));
        return;
    }
    print(systemWrote(target.rel));
};
