export const gateFinding = function gateFinding(label: string, line: number, code: string, message: string): string {
    return `✖ ${label}:${line} [${code}] ${message}`;
};

export const unstableRegeneration = function unstableRegeneration(
    label: string,
    code: string,
    attempts: number,
): string {
    return `✖ ${label} [${code}] non-deterministic — regeneration unstable across ${attempts} attempts`;
};

export const driftFinding = function driftFinding(label: string, code: string): string {
    return `✖ ${label} [${code}] regenerate with "npm run docs:generate"`;
};

export const selfHealed = function selfHealed(label: string): string {
    return `✓ self-healed ${label}`;
};

export const regenerated = function regenerated(label: string): string {
    return `✓ regenerated ${label}`;
};

export const healed = function healed(label: string): string {
    return `✓ healed ${label}`;
};

export const workspaceMapHardening = function workspaceMapHardening(rel: string, code: string, detail: string): string {
    return `${rel} failed hardening — generation aborted:\n  [${code}] ${detail}`;
};
