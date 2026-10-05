import { ALLOWED_VAR_DIRS, ALLOWED_VAR_FILES, CSS_EXTENSIONS } from "#configuration/constants/validation.constants";
import { strayVar, strayVarFix } from "#configuration/strings/validation.strings";
import type { FileInput } from "#types/validation.types";
import type { Finding } from "#types/finding.types";
import { defineValidator } from "#core/registries/validation.registry";
import { definedVars } from "#core/parsers/css.parser";
import { projectFinding } from "#core/factories/finding.factory";

const isAllowedVarFile = function isAllowedVarFile(path: string): boolean {
    const normalized = `/${path.split("\\").join("/")}`;
    return (
        ALLOWED_VAR_FILES.some((allowed) => normalized.endsWith(allowed)) ||
        ALLOWED_VAR_DIRS.some((dir) => normalized.includes(dir))
    );
};

const strayVarFindings = function strayVarFindings(file: FileInput, baseVars: ReadonlySet<string>): Finding[] {
    return [...new Set(definedVars(file.content))]
        .filter((name) => !baseVars.has(name))
        .map((name) =>
            projectFinding({
                file: file.path,
                message: strayVar(name),
                ruleId: "css-variable-location",
                suggestion: strayVarFix(name),
            }),
        );
};

defineValidator({
    appliesTo: CSS_EXTENSIONS,
    id: "css-variable-location",
    meta: {
        canonical: ["css-architecture", "design-tokens"],
        description: "Require custom-property definitions to live in the token/config files",
    },
    validate(files): Finding[] {
        const baseVars = new Set(
            files.filter((entry) => isAllowedVarFile(entry.path)).flatMap((entry) => definedVars(entry.content)),
        );
        return files
            .filter((entry) => !isAllowedVarFile(entry.path))
            .flatMap((entry) => strayVarFindings(entry, baseVars));
    },
});
