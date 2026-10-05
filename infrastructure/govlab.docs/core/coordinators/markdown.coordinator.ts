import { fixSummary, fixedDocument } from "#configuration/strings/finding.strings";
import type { DocsHost } from "#types/environment.types";
import { MARKDOWN_SUFFIX } from "#configuration/constants/document.constants";
import { backtickBarePaths } from "#core/converters/markdown.converter";
import { isGeneratedDoc } from "#core/predicates/document.predicate";
import { print } from "#core/reporters/base.reporter";
import { readTextSafe } from "#core/loaders/base.loader";
import { writeVerbatim } from "@govlab/canonical-write";

const fixDocument = function fixDocument(host: DocsHost, doc: string): boolean {
    const source = readTextSafe(doc) ?? "";
    const next = backtickBarePaths(source);
    if (next === source || isGeneratedDoc(source)) {
        return false;
    }
    writeVerbatim(doc, next);
    print(fixedDocument(host.relative(doc)));
    return true;
};

export const runFix = function runFix(host: DocsHost): void {
    const fixed = host.walk(host.root, MARKDOWN_SUFFIX).filter((doc) => fixDocument(host, doc));
    print(fixSummary(fixed.length));
};
