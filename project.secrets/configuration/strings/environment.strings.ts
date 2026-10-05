export const vaultRefused = function vaultRefused(entry: string, reason: string): string {
    return `@ssot/secrets: the vault refused a read of ${entry}: ${reason}. Unlock the vault, or add the entry and its fields.`;
};

export const answerMalformed = function answerMalformed(entry: string): string {
    return `@ssot/secrets: the vault answered a read of ${entry} with something that is not the expected answer.`;
};

export const keyMissing = function keyMissing(key: string, entry: string): string {
    return `@ssot/secrets: ${key} is required and ${entry} holds no field labeled ${key}. Add it to the vault, because no key has a default.`;
};

export const valueMalformed = function valueMalformed(key: string, kind: string): string {
    return `@ssot/secrets: the value of ${key} is not a valid ${kind}. Set it to a value of that kind in the vault.`;
};
