import type {
    DeclaredDocFinding,
    DeclaredGovernContext,
    DiscoveredModule,
    ManifestFinding,
    ProseFinding,
} from "#types/readme.types";
import { LEAD_HEADING, hardcodedCount, historySmell } from "#configuration/strings/governance.strings";
import { cleanTarget, unquote } from "#core/normalizers/reference.normalizer";
import { dirname, resolve } from "node:path";
import { hostCoupling, missingTarget, symbolDrift } from "#configuration/strings/reference.strings";
import { renderFieldFragment, renderRenderable } from "#core/formatters/markdown.formatter";
import type { DocumentDecl } from "#types/document.types";
import { bannedLanguage } from "#core/analyzers/vocabulary.analyzer";
import { conventionHits } from "#core/analyzers/markdown.analyzer";
import { declaredDocLocation } from "#core/resolvers/location.resolver";
import { hardcodedCounts } from "#core/analyzers/text.analyzer";
import { isExternalTarget } from "#core/predicates/reference.predicate";
import { pathReferences } from "#core/parsers/location.parser";
import { symbolDriftIn } from "#core/analyzers/drift.analyzer";
import { targetExists } from "#core/resolvers/source.resolver";

export const brokenPathsIn = function brokenPathsIn(
    fragment: string,
    moduleDir: string,
    consumerRoot: string,
): string[] {
    return pathReferences(fragment)
        .map((ref) => cleanTarget(ref.path))
        .filter((target) => !isExternalTarget(target) && !targetExists(target, moduleDir, consumerRoot));
};

export const hostCouplingIn = function hostCouplingIn(fragment: string, hostTokens: readonly string[]): string[] {
    return pathReferences(fragment)
        .map((ref) => unquote(ref.path))
        .filter((target) => hostTokens.some((token) => target.startsWith(token)));
};

const textFindings = function textFindings(fragment: string): ProseFinding[] {
    return [
        ...bannedLanguage(fragment).map((hit) => ({ axis: "history-smell", detail: historySmell(hit.term) })),
        ...conventionHits(fragment).map((hit) => ({ axis: hit.code, detail: hit.token })),
    ];
};

const pathFindings = function pathFindings(fragment: string, dir: string, consumerRoot: string): ProseFinding[] {
    return [
        ...brokenPathsIn(fragment, dir, consumerRoot).map((target) => ({
            axis: "broken-path",
            detail: missingTarget(target),
        })),
        ...symbolDriftIn(fragment, dir, consumerRoot).map((detail) => ({
            axis: "symbol-drift",
            detail: symbolDrift(detail),
        })),
    ];
};

export const governManifest = function governManifest(
    module: DiscoveredModule,
    consumerRoot: string,
    hostTokens: readonly string[],
): ManifestFinding[] {
    const { docs } = module.manifest;
    if (!docs || typeof docs !== "object") {
        return [];
    }
    return Object.entries(docs).flatMap(([key, value]) => {
        const fragment = renderFieldFragment(key, value);
        const coupled = hostCouplingIn(fragment, hostTokens).map((target) => ({
            axis: "host-coupling",
            detail: hostCoupling(target),
        }));
        return [...textFindings(fragment), ...pathFindings(fragment, module.dir, consumerRoot), ...coupled].map(
            (finding): ManifestFinding => ({ ...finding, field: key }),
        );
    });
};

const sectionFindings = function sectionFindings(
    docDir: string,
    consumerRoot: string,
    content: unknown,
): ProseFinding[] {
    const fragment = renderRenderable(content);
    return [
        ...textFindings(fragment),
        ...pathFindings(fragment, docDir, consumerRoot),
        ...hardcodedCounts(fragment).map((count) => ({ axis: "magic-number", detail: hardcodedCount(count) })),
    ];
};

const safeDocLocation = function safeDocLocation(doc: DocumentDecl, context: DeclaredGovernContext): string | null {
    try {
        return declaredDocLocation(doc, context.registries, context.options);
    } catch (error) {
        if (!(error instanceof Error)) {
            throw error;
        }
        return null;
    }
};

const docDirOf = function docDirOf(doc: DocumentDecl, context: DeclaredGovernContext): string | null {
    const location = safeDocLocation(doc, context);
    return location === null ? null : dirname(resolve(context.consumerRoot, location));
};

const docFindings = function docFindings(doc: DocumentDecl, context: DeclaredGovernContext): DeclaredDocFinding[] {
    const docDir = Array.isArray(doc.body) ? docDirOf(doc, context) : null;
    if (docDir === null) {
        return [];
    }
    const lead =
        typeof doc.lead === "string" || Array.isArray(doc.lead) ? [{ content: doc.lead, heading: LEAD_HEADING }] : [];
    return [...lead, ...doc.body].flatMap((section) =>
        sectionFindings(docDir, context.consumerRoot, section.content).map((finding): DeclaredDocFinding => ({
            ...finding,
            doc: doc.name,
            heading: section.heading,
        })),
    );
};

export const governDeclaredDocs = function governDeclaredDocs(
    module: DiscoveredModule,
    context: DeclaredGovernContext,
): DeclaredDocFinding[] {
    const { documents } = module.manifest;
    return Array.isArray(documents) ? documents.flatMap((doc) => docFindings(doc, context)) : [];
};
