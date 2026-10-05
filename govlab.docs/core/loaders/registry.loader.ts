import type { RegistryExtensions, UserRegistries } from "#types/manifest.types";
import { RegistryBuilder } from "#core/factories/registry.factory";
import { homedir } from "node:os";
import { join } from "node:path";
import { loadExports } from "#core/loaders/plugin.loader";
import { relativePath } from "@ssot/paths";

const DEFAULT_KEY = "default";
const FORMS_DIR = "doc-forms";
const CONCERNS_DIR = "doc-concerns";
const VERBS_DIR = "doc-verbs";

export const EXTENSION_DIR = relativePath("govlabHost.root");

const isPresent = function isPresent(value: unknown): value is unknown {
    return value !== undefined;
};

export const extensionDirs = function extensionDirs(root: string, allowGlobal: boolean): string[] {
    return [...(allowGlobal ? [join(homedir(), EXTENSION_DIR)] : []), join(root, EXTENSION_DIR)];
};

const loadExtension = async function loadExtension(dir: string): Promise<RegistryExtensions> {
    const [forms, concerns, refVerbs] = await Promise.all([
        loadExports(join(dir, FORMS_DIR), DEFAULT_KEY, isPresent),
        loadExports(join(dir, CONCERNS_DIR), DEFAULT_KEY, isPresent),
        loadExports(join(dir, VERBS_DIR), DEFAULT_KEY, isPresent),
    ]);
    return { concerns, forms, refVerbs };
};

const apply = function apply(builder: RegistryBuilder, extension: RegistryExtensions): void {
    for (const form of extension.forms) {
        builder.addForm(form);
    }
    for (const entry of extension.concerns) {
        builder.addConcern(entry);
    }
    for (const entry of extension.refVerbs) {
        builder.addRefVerb(entry);
    }
};

export const loadUserRegistries = async function loadUserRegistries(
    root: string,
    base: UserRegistries,
    options: { allowGlobal?: boolean } = {},
): Promise<UserRegistries> {
    const builder = new RegistryBuilder(base);
    const extensions = await Promise.all(extensionDirs(root, options.allowGlobal ?? false).map(loadExtension));
    for (const extension of extensions) {
        apply(builder, extension);
    }
    return builder.frozen();
};
