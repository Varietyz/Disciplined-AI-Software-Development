import { DIAGRAM_ROOT, DIAGRAM_STYLESHEET } from "@banes-lab/web/core/assets/diagram.assets.ts";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { STYLESHEET_FILE } from "@banes-lab/build-scripts/configuration/constants/diagram.constants.ts";
import { absolutePath } from "@ssot/paths";
import { diagramFileName } from "@banes-lab/build-scripts/core/resolvers/diagram.resolver.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeAssets } from "@banes-lab/build-scripts/core/persistence/diagram.persistence.ts";

const PREFIX = "govlab-diagrams-";
const SOURCE = "flowchart LR\n    a --> b";

let folder = "";

beforeEach(() => {
    const scratch = mkdtempSync(join(tmpdir(), PREFIX));
    folder = join(scratch, "diagrams");
});

afterEach(() => {
    rmSync(join(folder, ".."), { force: true, recursive: true });
});

describe("writeAssets", () => {
    it("replaces the folder with one marked vector per rendered source beside the hoisted stylesheet", () => {
        writeAssets(
            folder,
            new Map([
                [SOURCE, '<svg id="diagram-1"><style>#diagram-1{fill:red}</style><g style="stroke:blue"></g></svg>'],
            ]),
        );
        const vector = join(folder, diagramFileName(SOURCE));
        expect(readdirSync(folder).toSorted()).toStrictEqual([diagramFileName(SOURCE), STYLESHEET_FILE]);
        expect(readFileSync(vector, "utf8")).toBe(
            '<svg id="diagram-1" class="diagram-vector"><g class="diagram-style-1"></g></svg>',
        );
        expect(readFileSync(join(folder, STYLESHEET_FILE), "utf8")).toBe(
            ".diagram-vector{fill:red}\n.diagram-style-1{stroke:blue !important}\n",
        );
        writeAssets(folder, new Map([["flowchart LR\n    c --> d", "<svg>two</svg>"]]));
        expect(existsSync(vector)).toBe(false);
        expect(readdirSync(folder)).toHaveLength(2);
    });

    it("serves the stylesheet from the diagram root, where the loader attaches it on the first diagram", () => {
        expect(DIAGRAM_STYLESHEET).toBe(DIAGRAM_ROOT + STYLESHEET_FILE);
        const template = readFileSync(absolutePath("app.member", "index.html"), "utf8");
        expect(template).not.toContain(STYLESHEET_FILE);
    });
});
