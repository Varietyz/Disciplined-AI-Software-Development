import type { DiskFile, DiskFolder } from "@banes-lab/build-scripts/types/structure.types.ts";
import type { FileEntry, ModuleReport } from "@govlab/patterns";
import { convertAnatomy } from "@banes-lab/build-scripts/core/converters/anatomy.converter.ts";
import { createWalkAssets } from "@banes-lab/build-scripts/core/factories/walk.factory.ts";
import { definitionKey } from "@banes-lab/build-scripts/core/converters/report.converter.ts";
import { posix } from "node:path";

export const LINE = 3;
export const BYTES = 40;
export const CODE_LINES = 2;
export const CONTAINER = "presentation";
export const CONCERN_FOLDER = "renderers";
export const FILE_NAME = "text.renderer.ts";
export const CALLEE_FILE = posix.join("core", "factories", "element.factory.ts");
export const CONCERN_PATH = posix.join(CONTAINER, CONCERN_FOLDER);
export const FILE_PATH = posix.join(CONCERN_PATH, FILE_NAME);
export const DEFINITION = "renderText";
export const CALLEE = "createElement";

const EXTENSION = ".ts";
const CALLEE_SPECIFIER = `#${CALLEE_FILE.slice(0, -EXTENSION.length)}`;

export const report = (): ModuleReport => ({
    definitions: [
        {
            callable: true,
            callees: [definitionKey(CALLEE_FILE, CALLEE)],
            callers: [],
            exported: true,
            file: FILE_PATH,
            flow: "entry",
            inDegree: 0,
            kind: "lexical_declaration",
            line: LINE,
            local: false,
            name: DEFINITION,
            outDegree: 1,
        },
    ],
    edges: [
        {
            file: FILE_PATH,
            from: definitionKey(FILE_PATH, DEFINITION),
            line: LINE,
            to: definitionKey(CALLEE_FILE, CALLEE),
        },
    ],
    findings: [],
    metrics: {
        callable: 1,
        definitions: 1,
        edges: 1,
        exported: 1,
        findings: {},
        flows: { entry: 1 },
        maxInDegree: 0,
        maxOutDegree: 1,
        resolutionRate: 1,
        unresolvedCalls: 0,
    },
    module: "fixture",
    pages: [],
    unresolvedCalls: [],
});

export const sourceFile = (): DiskFile => ({
    bytes: BYTES,
    generated: false,
    inherited: false,
    lines: { blank: 0, code: CODE_LINES, total: CODE_LINES },
    name: FILE_NAME,
    path: FILE_PATH,
    text: `import { ${CALLEE} } from "${CALLEE_SPECIFIER}";\nexport const ${DEFINITION} = ${CALLEE};\n`,
});

export const concernFolder = (): DiskFolder => ({
    files: [sourceFile()],
    folders: [],
    name: CONCERN_FOLDER,
    path: CONCERN_PATH,
    role: "concern",
});

export const tree = (): DiskFolder => ({
    files: [],
    folders: [{ files: [], folders: [concernFolder()], name: CONTAINER, path: CONTAINER, role: "container" }],
    name: "",
    path: "",
    role: "member",
});

const entry = (): FileEntry => ({
    records: [{ nodeType: "identifier", text: DEFINITION }],
    rel: FILE_PATH,
    symbols: [],
    walk: [{ depth: 0, file: FILE_PATH, label: "program", role: "node" }],
});

export const convert = (): ReturnType<typeof convertAnatomy> =>
    convertAnatomy(
        {
            cells: new Map(),
            charts: [],
            documents: new Map(),
            entries: [entry()],
            imports: [],
            report: report(),
            tree: tree(),
            vectors: new Map(),
        },
        createWalkAssets(),
    );
