import { DATA_CONSTRUCTORS, FACTORY_PREFIXES } from "#configuration/constants/construct.constants";
import type { ConstructNode } from "#types/construct.types";

const isFn = function isFn(node: ConstructNode | null | undefined): boolean {
    return node?.type === "ArrowFunctionExpression" || node?.type === "FunctionExpression";
};

const isFactoryCallName = function isFactoryCallName(name: string): boolean {
    for (const prefix of FACTORY_PREFIXES) {
        if (name.startsWith(prefix) && name.length > prefix.length) {
            const next = name.charAt(prefix.length);
            if (next >= "A" && next <= "Z") {
                return true;
            }
        }
    }
    return false;
};

const isInstanceOrFactory = function isInstanceOrFactory(init: ConstructNode): boolean {
    const { callee } = init;
    if (callee?.type !== "Identifier" || typeof callee.name !== "string") {
        return false;
    }
    if (init.type === "NewExpression") {
        return !DATA_CONSTRUCTORS.has(callee.name);
    }
    return isFactoryCallName(callee.name);
};

export const isConstructInit = function isConstructInit(init: ConstructNode | null | undefined): boolean {
    if (!init) {
        return false;
    }
    if (isFn(init)) {
        return true;
    }
    if (init.type === "ObjectExpression") {
        return (init.properties ?? []).some(
            (prop) => prop.type === "Property" && (prop.method === true || isFn(prop.value)),
        );
    }
    if (init.type === "CallExpression" || init.type === "NewExpression") {
        return isInstanceOrFactory(init);
    }
    return false;
};

export const isDefaultConstruct = function isDefaultConstruct(declaration?: ConstructNode | null): boolean {
    if (!declaration) {
        return false;
    }
    return (
        declaration.type === "FunctionDeclaration" ||
        declaration.type === "ClassDeclaration" ||
        isConstructInit(declaration)
    );
};
