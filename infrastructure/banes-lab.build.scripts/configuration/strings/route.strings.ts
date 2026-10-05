export const ledgerNotObject = function ledgerNotObject(sample: string): string {
    return `route ledger: expected an object of route stamps, got ${sample}`;
};

export const malformedStamps = function malformedStamps(paths: readonly string[]): string {
    return `route ledger: malformed stamps for ${paths.join(", ")}. Each stamp carries a fingerprint and a lastmod.`;
};
