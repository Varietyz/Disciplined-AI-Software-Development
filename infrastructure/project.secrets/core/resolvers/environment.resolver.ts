import type { EnvironmentEntry, EnvironmentScope, OptionalKey, PortKey, TextKey } from "#types/environment.types";
import { VAULT_FOLDER, VAULT_PATH_SEPARATOR } from "#configuration/constants/environment.constants";
import { fieldLabels, revealField } from "#core/adapters/environment.adapter";
import { keyMissing, valueMalformed } from "#configuration/strings/environment.strings";
import { ENVIRONMENT_ENTRIES } from "#configuration/schemas/environment.schema";
import { isValueOfKind } from "#core/validators/environment.validator";

const DECLARED: readonly EnvironmentEntry[] = ENVIRONMENT_ENTRIES;

const ENTRY_BY_KEY: ReadonlyMap<string, EnvironmentEntry> = new Map(DECLARED.map((entry) => [entry.key, entry]));

const vaultEntryOf = function vaultEntryOf(scope: EnvironmentScope): string {
    return VAULT_FOLDER + VAULT_PATH_SEPARATOR + scope;
};

const declaredOf = function declaredOf(key: string): EnvironmentEntry {
    const declared = ENTRY_BY_KEY.get(key);
    if (declared === undefined) {
        throw new Error(keyMissing(key, VAULT_FOLDER));
    }
    return declared;
};

const storedValueOf = function storedValueOf(declared: EnvironmentEntry): string | null {
    const entry = vaultEntryOf(declared.scope);
    if (!fieldLabels(entry).has(declared.key)) {
        return null;
    }
    const value = revealField(entry, declared.key);
    if (!isValueOfKind(declared.kind, value)) {
        throw new Error(valueMalformed(declared.key, declared.kind));
    }
    return value;
};

const requiredOf = function requiredOf(key: PortKey | TextKey): string {
    const declared = declaredOf(key);
    const value = storedValueOf(declared);
    if (value === null) {
        throw new Error(keyMissing(key, vaultEntryOf(declared.scope)));
    }
    return value;
};

export const portOf = function portOf(key: PortKey): number {
    return Number(requiredOf(key));
};

export const textOf = function textOf(key: TextKey): string {
    return requiredOf(key);
};

export const optionalTextOf = function optionalTextOf(key: OptionalKey): string | null {
    return storedValueOf(declaredOf(key));
};
