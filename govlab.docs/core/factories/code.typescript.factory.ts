import type { CodeSource } from "#types/graph.types";
import { declName } from "#core/selectors/code.typescript.selector";
import { nodeId } from "#core/normalizers/diagram.normalizer";
import { relFromModules } from "#core/resolvers/source.resolver";
import type ts from "typescript";

export const sourceOf = function sourceOf(node: ts.Node): CodeSource {
    const file = node.getSourceFile();
    const position = file.getLineAndCharacterOfPosition(node.getStart());
    return { file: relFromModules(file.fileName), line: position.line + 1 };
};

export const mkNodeId = function mkNodeId(node: ts.Node): string {
    return nodeId(`${node.getSourceFile().fileName}:${node.getStart()}`);
};

export const declId = function declId(decl: ts.Declaration): string {
    return nodeId(`${decl.getSourceFile().fileName}:${decl.getStart()}:${declName(decl)}`);
};
