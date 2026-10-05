export const credentialHeld = function credentialHeld(scanned: number): string {
    return `[credential-check] no scanned file carries a secret-shaped value (${String(scanned)} scanned)\n`;
};

export const credentialBroken = function credentialBroken(rows: readonly string[]): string {
    return [
        `[credential-check] ${String(rows.length)} secret-shaped value(s). Move each into the secret store under a declared key:`,
        ...rows,
        "",
    ].join("\n");
};
