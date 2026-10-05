import type {
    FileInput,
    FileReader,
    ProjectValidator,
    ValidationInput,
    ValidationResult,
} from "#types/validation.types";
import type { Finding } from "#types/finding.types";
import { VALIDATOR_SUFFIX } from "#configuration/constants/validation.constants";
import { importFolder } from "#core/loaders/folder.loader";
import { isNotFound } from "#core/predicates/failure.predicate";
import { registeredValidators } from "#core/registries/validation.registry";
import { renderPanel } from "#core/formatters/validation.formatter";

const extensionOf = function extensionOf(path: string): string {
    const dotIdx = path.lastIndexOf(".");
    return dotIdx === -1 ? "" : path.slice(dotIdx + 1);
};

const safeRead = function safeRead(readFile: FileReader, path: string): string | null {
    try {
        return readFile(path);
    } catch (error) {
        if (error instanceof Error && isNotFound(error)) {
            return null;
        }
        throw error;
    }
};

const readInputs = function readInputs(readFile: FileReader, files: readonly string[]): FileInput[] {
    return files.flatMap((path) => {
        const content = safeRead(readFile, path);
        return content === null ? [] : [{ content, path }];
    });
};

const applies = function applies(validator: ProjectValidator, entry: FileInput): boolean {
    return validator.appliesTo === "*" || validator.appliesTo.includes(extensionOf(entry.path));
};

const validatorFindings = function validatorFindings(
    validators: readonly ProjectValidator[],
    inputs: readonly FileInput[],
    consumers: readonly FileInput[],
): Finding[] {
    return validators.flatMap((validator) =>
        validator.validate(
            inputs.filter((entry) => applies(validator, entry)),
            consumers.filter((entry) => applies(validator, entry)),
        ),
    );
};

export const loadValidators = async function loadValidators(): Promise<ProjectValidator[]> {
    await importFolder("govlab.quality.validators", VALIDATOR_SUFFIX);
    return registeredValidators();
};

export const runValidators = function runValidators(input: ValidationInput): ValidationResult {
    const findings = validatorFindings(
        input.validators,
        readInputs(input.readFile, input.files),
        readInputs(input.readFile, input.consumers),
    );
    return { clean: findings.length === 0, findings, panel: renderPanel(findings) };
};
