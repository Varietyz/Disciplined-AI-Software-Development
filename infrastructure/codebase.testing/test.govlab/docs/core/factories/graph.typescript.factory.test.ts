import { afterAll, describe, expect, it } from "vitest";
import { defined, programFor, sourceFileOf } from "../analyzers/program.fixture.ts";
import { CallVisitor } from "@govlab/docs/core/visitors/code.typescript.visitor.ts";
import { GraphStore } from "@govlab/docs/core/stores/graph.store.ts";
import { TsGraphBuilder } from "@govlab/docs/core/factories/graph.typescript.factory.ts";
import { collectReturnedApi } from "@govlab/docs/core/selectors/surface.selector.ts";
import ts from "typescript";

const fixture = programFor({
    "thing.ts": [
        "class Store { save(): void {} }",
        "const helper = (): number => 1;",
        "export function createThing() {",
        "    const store = new Store();",
        "    helper();",
        "    store.save();",
        "    const open = (): void => {",
        "        helper();",
        "    };",
        "    return { open };",
        "}",
    ].join("\n"),
});
const file = sourceFileOf(fixture, "thing.ts");
const factory = defined(file.statements.find(ts.isFunctionDeclaration), "createThing");

const buildGraph = function buildGraph(): ReturnType<TsGraphBuilder["result"]> {
    const store = new GraphStore();
    const visitor = new CallVisitor({ ...fixture.analysis, recognizers: [], store });
    const builder = new TsGraphBuilder(fixture.analysis, store, visitor);
    builder.seedAll([{ axis: "main", barrel: file.fileName, label: "createThing", name: "createThing" }]);
    return builder.result();
};

afterAll(() => {
    fixture.dispose();
});

describe("collectReturnedApi", () => {
    it("reads the functions a factory returns in its object literal", () => {
        expect(collectReturnedApi(fixture.analysis.checker, factory).map((api) => api.name)).toStrictEqual(["open"]);
    });
});

describe("TsGraphBuilder and CallVisitor", () => {
    it("seed the factory and follow constructions, in-package calls, methods and the returned API", () => {
        const graph = buildGraph();
        const kinds = new Map(graph.nodes.map((node) => [node.label, node.kind]));
        expect(kinds.get("createThing")).toBe("factory");
        expect(kinds.get("Store")).toBe("collaborator");
        expect(kinds.get("helper")).toBe("method");
        expect(kinds.get("open")).toBe("method");
        expect(graph.edges.some((edge) => edge.kind === "dependency" && edge.label === "new")).toBe(true);
        expect(graph.edges.some((edge) => edge.kind === "loop")).toBe(true);
    });
});
