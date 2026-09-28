export const DUPLICATE_CONCERN_TAG =
    "taxonomy: two concerns declare the same tag, or a concern's collection tag equals a tag. Give each concern its own unit tag and collection tag.";

export const TAG_ALTERNATIVE = "' or '";

export const TAG_LIST = ", ";

export const DUPLICATE_CONCERN_FOLDER =
    "taxonomy: two concerns declare the same folder. Give each concern its own folder.";

export const redundantSubject = function redundantSubject(subject: string): string {
    return `taxonomy: '${subject}' is declared in subjects and is already a concern tag. Every concern tag is a legal subject, so remove the declaration from subjects.`;
};

export const markerShadowsConcern = function markerShadowsConcern(marker: string): string {
    return `taxonomy: '${marker}' is both a compound marker and a concern tag. The marker is tested first, so no file can resolve to the concern. Drop one of the two declarations.`;
};

export const unboundMarkerFolder = function unboundMarkerFolder(marker: string): string {
    return `taxonomy: grammar.markerFolders binds '${marker}', which is not a compound marker, so no file carries it. Declare the marker or drop the binding.`;
};

export const unboundTestMarker = function unboundTestMarker(marker: string): string {
    return `taxonomy: grammar.testMarkers names '${marker}', which is not a compound marker, so no file carries it. Declare the marker or drop it from testMarkers.`;
};

export const unknownMirrorSource = function unknownMirrorSource(mirror: string, source: string): string {
    return `taxonomy: testMirrors maps '${mirror}' to '${source}', which is not a declared root, so the mirror has no containers to inherit. Declare the source root or fix the mapping.`;
};

export const mirrorIsRoot = function mirrorIsRoot(mirror: string): string {
    return `taxonomy: '${mirror}' is both a test mirror and a declared root. A test root inherits its containers from its source, so drop it from containers.`;
};

export const markerFolderShadowsConcern = function markerFolderShadowsConcern(marker: string, folder: string): string {
    return `taxonomy: grammar.markerFolders sends '${marker}' files to '${folder}/', which is already a concern folder, so its files would fail the tag check. Give the marker a folder of its own.`;
};

export const emptyRoot = function emptyRoot(root: string): string {
    return `taxonomy: root '${root}' declares no containers, so it governs nothing while it reads as governed. List its containers or drop the root.`;
};

export const duplicateContainer = function duplicateContainer(root: string): string {
    return `taxonomy: root '${root}' declares a container twice. Keep one of the two entries.`;
};

export const containerAndBucket = function containerAndBucket(root: string, special: string): string {
    return `taxonomy: root '${root}' declares '${special}' in both containers and specialContainers. A container is one kind or the other, so keep it in one list.`;
};

export const bucketNotConcern = function bucketNotConcern(root: string, special: string): string {
    return `taxonomy: root '${root}' declares the special container '${special}', which is not a declared concern folder. A flat bucket holds one collection concern, so name it by that concern's folder.`;
};

export const wildcardIgnore = function wildcardIgnore(pattern: string): string {
    return `taxonomy: Ignored.foldersFiles holds '${pattern}', which is only wildcards and matches every name. An ignore entry names one thing outside the taxonomy, so name it.`;
};

export const extensionIgnore = function extensionIgnore(pattern: string): string {
    return `taxonomy: Ignored.foldersFiles holds '${pattern}', which silences a whole file extension and every violation under it. Ignore a name, not a type.`;
};

export const unknownSplitter = function unknownSplitter(splitter: string, known: readonly string[]): string {
    return `taxonomy: grammar.dialects binds an extension to the splitter '${splitter}', which grammar.splitters does not declare, so the dialect resolves no name. Declare the splitter, or use one of ${known.join(", ")}.`;
};

export const duplicateSplitter = function duplicateSplitter(splitter: string): string {
    return `taxonomy: grammar.splitters declares '${splitter}' twice. A dialect names its splitter, so give each splitter one name.`;
};

export const malformedJoiner = function malformedJoiner(splitter: string, joiner: string): string {
    return `taxonomy: the splitter '${splitter}' joins words with '${joiner}', which is empty or holds a letter or digit, so no word boundary can be read from it. Use a joiner of punctuation only, or null for a case boundary.`;
};

export const unboundDialect = function unboundDialect(splitter: string): string {
    return `taxonomy: the '${splitter}' dialect binds no extension, so it governs nothing. Bind the extensions it names.`;
};

export const doubleBoundExtension = function doubleBoundExtension(extension: string): string {
    return `taxonomy: the extension '${extension}' is bound by two dialects. A file splits one way, so bind the extension to one dialect.`;
};

export const undeclaredBucketRoot = function undeclaredBucketRoot(root: string): string {
    return `taxonomy: specialContainers names '${root}', which is not a declared root. Declare the root in containers first.`;
};

export const shallowCap = function shallowCap(depth: string, minimum: number): string {
    return `taxonomy: grammar.maxDepthFromRoot is ${depth}. The cap counts folders from the governed root with the container included and the file excluded, so a cap below ${String(minimum)} forbids every legal path.`;
};

export const undeclaredTierContainer = function undeclaredTierContainer(name: string, root: string): string {
    return `layer.manifest: "${name}" is not a declared container of "${root}". The tier split classifies containers, and an undeclared one classifies nothing and disables the platform and product gate. Declare the container or drop it from the split.`;
};

export const noSplitter = function noSplitter(splitter: string): string {
    return `taxonomy: no declared splitter is named '${splitter}', so a name cannot be split by it. Declare it in grammar.splitters or use a declared splitter.`;
};

export const undeclaredContainerPath = function undeclaredContainerPath(container: string, scope: string): string {
    return `taxonomy: '${container}' is not a declared container${scope}. A rule does not fall back to a hardcoded path, so declare the container or key on one that exists.`;
};

export const ambiguousContainer = function ambiguousContainer(container: string, paths: readonly string[]): string {
    return `taxonomy: '${container}' is declared by more than one root (${paths.join(", ")}). Pass the root, because a first match binds the rule to whichever root sorts first.`;
};

export const rootScope = function rootScope(root: string): string {
    return ` of root '${root}'`;
};

export const unresolvedCoordinate = function unresolvedCoordinate(subject: string, tag: string): string {
    return `taxonomy: no file resolves to the subject '${subject}' with the concern '${tag}'. The taxonomy addresses a file by its coordinate, so the file is absent. Create it or fix the coordinate.`;
};

export const ambiguousCoordinate = function ambiguousCoordinate(
    subject: string,
    tag: string,
    matches: readonly string[],
): string {
    return `taxonomy: '${subject}.${tag}' resolves to ${String(matches.length)} files (${matches.join(", ")}). A subject and concern address one file, so qualify it with a variant or a folder subject.`;
};

type Data = Readonly<Record<string, string>>;

const field = function field(data: Data, key: string): string {
    return data[key] ?? "";
};

export const TAXONOMY_MESSAGES: Readonly<Record<string, (data: Data) => string>> = {
    badShape: (data) =>
        `'${field(data, "path")}' does not resolve in the folder grammar: ${field(data, "detail")}. Each depth takes a role strictly later than the one before it, and the file's parent is its concern folder, so move the file into the concern folder of the container it serves.`,
    generatedFolderIntruder: (data) =>
        `This file sits in '${field(data, "folder")}/', a generation folder whose files a tool writes, and its name carries no '${field(data, "marker")}' marker. Have the writer name it with the marker, or move it out to where authored files of its concern live.`,
    ungovernedFile: (data) =>
        `'${field(data, "name")}' sits outside every governed root and is neither an ecosystem-fixed name nor a boundary document. Move it into the root that owns it, or into a declared exclusion when it is not source.`,
    ungovernedTree: (data) =>
        `This tree holds ${field(data, "files")} text files and no governed root, exclusion or generation folder covers it. Declare it as a root in containers and convert it, or move it under a declared exclusion when it is not source.`,
    concernMismatch: (data) =>
        `'${field(data, "basename")}' declares the concern '${field(data, "tag")}' but sits in '${field(data, "folder")}/', the folder for '${field(data, "folderTag")}'. The tag equals its folder so one glob finds every file of a concern, so move the file to the folder for '${field(data, "tag")}' or retag it '${field(data, "folderTag")}'.`,
    looseFileAtRoot: (data) =>
        `'${field(data, "name")}' sits directly in the governed root '${field(data, "root")}', where only declared containers live. Move it into the concern folder of the container it serves, or add the name to Ignored.foldersFiles when a build owns it.`,
    markerFolderIntruder: (data) =>
        `'${field(data, "basename")}' sits in '${field(data, "path")}/', a folder grammar.markerFolders reserves for files a step writes, and its name carries no marker. Move it to the concern folder its tag names.`,
    markerMisplaced: (data) =>
        `'${field(data, "basename")}' carries a marker that grammar.markerFolders binds to '${field(data, "expected")}/', and it sits in '${field(data, "path")}/'. Move it into a '${field(data, "expected")}/' folder at the concern position of its container, and repoint its path key.`,
    misplacedTest: (data) =>
        `'${field(data, "basename")}' carries the '${field(data, "marker")}' marker and sits outside the centralized test root. Every test and fixture lives in the test root that mirrors its subject's source root, so move it there.`,
    unmirroredTest: (data) =>
        `'${field(data, "basename")}' names the subject '${field(data, "subject")}', and no file of that name sits at the mirrored path in '${field(data, "source")}'. A test sits at its subject's own path so a missing test shows as a missing file, so move it to its subject's path or name it for the file it tests.`,
    nonTestInMirror: (data) =>
        `'${field(data, "basename")}' sits in a test root and carries no test marker (${field(data, "markers")}). A test root holds tests and their fixtures only, so name it with a marker or move it to the source root that owns it.`,
    missingContainer: (data) =>
        `The container '${field(data, "container")}' is declared for the root '${field(data, "root")}' and does not exist on disk, so the closed set cannot be checked. Restore the folder or drop the declaration.`,
    missingRoot: (data) =>
        `The governed root '${field(data, "root")}' is declared in taxonomy.config.ts and does not exist on disk, so it governs no files. Restore the tree or drop the root.`,
    nestedInSpecial: (data) =>
        `The bucket '${field(data, "root")}/${field(data, "container")}' holds the folder '${field(data, "nested")}', and a bucket holds one collection concern as files only. Move the folder into a container, or declare the bucket as a container.`,
    undeclaredContainer: (data) =>
        `'${field(data, "root")}/${field(data, "container")}' is not a declared container. The root declares ${field(data, "declared")}. Move a subject or concern folder into an existing container, add build output or a tool cache to Ignored.foldersFiles, and propose a new container only for a new grouping axis.`,
    unparsable: (data) =>
        `'${field(data, "basename")}' does not resolve as <subject>[.<variant>].<concern>.<ext>: ${field(data, "reason")} ('${field(data, "word")}'). Every slot draws from the closed arrays in taxonomy.config.ts, so rename the file with declared words, or propose the word through the vocabulary ladder.`,
};

export const taxonomyFindingLine = function taxonomyFindingLine(
    path: string,
    messageId: string,
    message: string,
): string {
    return `✖ ${path} [${messageId}] ${message}\n`;
};

export const taxonomySummary = function taxonomySummary(findings: number, assessed: number, roots: number): string {
    return `taxonomy: ${String(findings)} finding(s) across ${String(assessed)} files in ${String(roots)} governed roots.\n`;
};

export const undeclaredConcernTag = function undeclaredConcernTag(tag: string): string {
    return `taxonomy: '${tag}' is not a declared concern tag. Declare it in concerns, or use a declared tag.`;
};
