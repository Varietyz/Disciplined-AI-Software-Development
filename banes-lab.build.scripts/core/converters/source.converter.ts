import type { AnatomyFile, AnatomyFolder, DefinitionRef } from "@banes-lab/web/types/anatomy.types.js";
import {
    CONTAINED_IN_RELATION,
    EVIDENCE_FOR_RELATION,
    LINKED_FROM_RELATION,
    USED_BY_RELATION,
    USES_RELATION,
} from "@banes-lab/web/constants/graph.constants";
import type { DefinitionData, SourceFile, SourceSources, SourceTools, SourceTree } from "#types/source.types";
import type { Leaf, Link } from "#types/catalog.types";
import { sourceLeaf, sourceText } from "#core/resolvers/catalog.resolver";
import { ANATOMY_PREFIX } from "#configuration/constants/graph.constants";
import type { WebModules } from "#types/loader.types";
import { placedOf } from "#core/converters/location.converter";
import { relationGroups } from "#core/converters/link.converter";
import { renderSourceLeaf } from "#core/formatters/source.formatter";

const LINE_END = "\n";
const FILE_KIND = "file";
const FRAGMENT = "#";

export const toolsOf = function toolsOf(
    web: Pick<WebModules, "anatomyConstants" | "anatomyIds" | "folder" | "source">,
): SourceTools {
    return {
        definitionAnchor: web.anatomyIds.DEFINITION_ANCHOR,
        fileId: web.source.fileId,
        languageOf: web.source.languageOf,
        lineInfix: web.anatomyConstants.LINE_INFIX,
        localPath: web.folder.localPath,
        nodeHref: web.source.nodeHref,
    };
};

export const canonicalOf = function canonicalOf(site: string, tools: SourceTools): (href: string) => string {
    return (href) => {
        const local = href.startsWith(site) ? href.slice(site.length) : href;
        const cut = local.indexOf(FRAGMENT);
        const infix = cut === -1 ? -1 : local.indexOf(tools.lineInfix, cut);
        if (infix === -1) {
            return local;
        }
        const anchor = local.slice(cut + 1, infix);
        return anchor.startsWith(tools.definitionAnchor)
            ? tools.nodeHref(local.slice(infix + tools.lineInfix.length), null)
            : local.slice(0, infix);
    };
};

const filesOf = function filesOf(folder: AnatomyFolder): readonly AnatomyFile[] {
    return [...folder.files, ...folder.folders.flatMap(filesOf)];
};

export const summaryOf = function summaryOf(file: Pick<AnatomyFile, "definitions" | "stats">): string {
    const definitions = file.definitions.length;
    return `${String(file.stats.lines.code)} lines of code and ${String(definitions)} definition${definitions === 1 ? "" : "s"}.`;
};

export const sourceFiles = function sourceFiles(
    trees: readonly SourceTree[],
    tools: SourceTools,
): readonly SourceFile[] {
    return trees.flatMap((tree) =>
        filesOf(tree.snapshot.tree).map((file) => ({
            file,
            identity: {
                address: sourceLeaf(tree.tab, tools.localPath(file.path)),
                href: tools.nodeHref(file.path, null),
                kind: FILE_KIND,
                ref: ANATOMY_PREFIX + tools.fileId(file.path),
                summary: summaryOf(file),
                title: tools.localPath(file.path),
            },
            tree,
        })),
    );
};

const fileLinks = function fileLinks(
    refs: readonly DefinitionRef[],
    own: string,
    sources: SourceSources,
): readonly Link[] {
    const files = [...new Set(refs.map((ref) => ref.file))].filter((file) => file !== own);
    return files
        .toSorted((a, b) => a.localeCompare(b))
        .map((file) => sources.linker.link(sources.tools.localPath(file), ANATOMY_PREFIX + sources.tools.fileId(file)));
};

const signatureAt = function signatureAt(lines: readonly string[] | null, line: number): string | null {
    const held = line < 1 || lines === null ? undefined : lines.at(line - 1);
    return held === undefined || held.trim().length === 0 ? null : held.trim();
};

const definitionsOf = function definitionsOf(
    file: AnatomyFile,
    sources: SourceSources,
    lines: readonly string[] | null,
): readonly DefinitionData[] {
    const named = (ref: DefinitionRef): object => ({
        file: sources.tools.localPath(ref.file),
        name: ref.name,
        source: sources.linker.link(sources.tools.localPath(ref.file), ANATOMY_PREFIX + sources.tools.fileId(ref.file)),
    });
    return file.definitions.map((definition) => ({
        callable: definition.callable,
        callees: definition.callees.map(named),
        callers: definition.callers.map(named),
        exported: definition.exported,
        flow: definition.flow,
        kind: definition.kind,
        line: definition.line,
        name: definition.name,
        signature: signatureAt(lines, definition.line),
    }));
};

const relationsOf = async function relationsOf(
    { file, identity }: SourceFile,
    sources: SourceSources,
): Promise<ReturnType<typeof relationGroups>> {
    const callees = file.definitions.flatMap((definition) => definition.callees);
    const callers = file.definitions.flatMap((definition) => definition.callers);
    const containedIn = sources.folder(identity.ref)?.containedIn ?? null;
    return relationGroups([
        { links: containedIn === null ? [] : [containedIn], relation: CONTAINED_IN_RELATION },
        { links: fileLinks(callees, file.path, sources), relation: USES_RELATION },
        { links: fileLinks(callers, file.path, sources), relation: USED_BY_RELATION },
        { links: await sources.grounds(identity.ref), relation: EVIDENCE_FOR_RELATION },
        ...sources.checks(identity.ref),
        { links: sources.linkedBy(identity.ref), relation: LINKED_FROM_RELATION },
    ]);
};

export const sourceLeaves = async function sourceLeaves(
    files: readonly SourceFile[],
    sources: SourceSources,
): Promise<readonly Leaf[]> {
    return Promise.all(
        files.map(async (source) => {
            const { file, identity, tree } = source;
            const path = sources.tools.localPath(file.path);
            const text = file.source === null || file.generated ? null : sources.textOf(file.source);
            const textAddress = text === null ? null : sourceText(tree.tab, path);
            const relations = await relationsOf(source, sources);
            const data = {
                definitions: definitionsOf(file, sources, text === null ? null : text.split(LINE_END)),
                document: file.document,
                findings: file.findings.map((finding) => ({ ...finding, file: sources.tools.localPath(finding.file) })),
                generated: file.generated,
                href: identity.href === null ? null : sources.linker.site + identity.href,
                language: sources.tools.languageOf(file.name),
                layer: file.layer,
                name: file.name,
                path,
                ref: identity.ref,
                relations,
                slots: file.slots,
                stats: file.stats,
                summary: identity.summary,
                text: textAddress === null ? null : sources.linker.site + textAddress,
                tree: tree.tab,
                ...placedOf(sources.placement(identity.ref)),
            };
            const markdown = renderSourceLeaf(data, tree.label, text);
            return text === null || textAddress === null
                ? { data, identity, markdown }
                : { data, identity, markdown, text: { address: textAddress, body: text } };
        }),
    );
};
