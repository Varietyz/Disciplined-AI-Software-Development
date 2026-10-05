import type { Finding } from "#types/finding.types";

export interface FileInput {
    path: string;
    content: string;
}

export interface ValidatorMeta {
    canonical: readonly string[];
    description: string;
}

export interface ProjectValidator {
    id: string;
    appliesTo: readonly string[] | "*";
    meta: ValidatorMeta;
    validate: (files: readonly FileInput[], consumers: readonly FileInput[]) => Finding[];
}

export type FileReader = (path: string) => string;

export interface ValidationInput {
    consumers: readonly string[];
    files: readonly string[];
    readFile: FileReader;
    validators: readonly ProjectValidator[];
}

export interface ValidationResult {
    clean: boolean;
    findings: Finding[];
    panel: string;
}
