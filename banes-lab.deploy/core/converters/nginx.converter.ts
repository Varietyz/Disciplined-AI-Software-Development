import {
    ERROR_LOG_DIRECTIVE,
    NAME_SEPARATOR,
    NODE_PROTOCOL,
    SCRIPT_SOURCE_EXTENSION,
    SCRIPT_TARGET_EXTENSION,
} from "#configuration/constants/nginx.constants";
import { ERROR_LOG_MISSING } from "#configuration/strings/deployment.strings";
import ts from "typescript";

const LINE_END = "\n";
const SPACE = " ";
const DIRECTIVE_END = ";";

export const errorLogOf = function errorLogOf(config: string): string {
    for (const line of config.split(LINE_END)) {
        const words = line
            .trim()
            .split(SPACE)
            .filter((word) => word.length > 0);
        const [directive, path] = words;
        if (directive === ERROR_LOG_DIRECTIVE && path !== undefined) {
            return path.endsWith(DIRECTIVE_END) ? path.slice(0, -DIRECTIVE_END.length) : path;
        }
    }
    throw new Error(ERROR_LOG_MISSING);
};

export const scriptNameOf = function scriptNameOf(name: string): string {
    if (!name.endsWith(SCRIPT_SOURCE_EXTENSION)) {
        return name;
    }
    const subjectEnd = name.indexOf(NAME_SEPARATOR);
    return name.slice(0, subjectEnd) + SCRIPT_TARGET_EXTENSION;
};

const bareModules: ts.TransformerFactory<ts.SourceFile> = (context) => (file) => {
    const visit = (node: ts.Node): ts.Node => {
        if (
            !ts.isImportDeclaration(node) ||
            !ts.isStringLiteral(node.moduleSpecifier) ||
            !node.moduleSpecifier.text.startsWith(NODE_PROTOCOL)
        ) {
            return node;
        }
        const bare = context.factory.createStringLiteral(node.moduleSpecifier.text.slice(NODE_PROTOCOL.length));
        return context.factory.updateImportDeclaration(node, node.modifiers, node.importClause, bare, node.attributes);
    };
    return ts.visitEachChild(file, visit, context);
};

export const scriptTextOf = function scriptTextOf(name: string, source: string): string {
    if (!name.endsWith(SCRIPT_SOURCE_EXTENSION)) {
        return source;
    }
    return ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
        fileName: name,
        transformers: { before: [bareModules] },
    }).outputText;
};
