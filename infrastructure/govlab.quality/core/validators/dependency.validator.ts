import { EMPTY_REQUEST, unknownEcosystem } from "#configuration/strings/dependency.strings";
import { ECOSYSTEM_SHORTCODES } from "#configuration/constants/ecosystem.constants";
import type { InstallRequest } from "#types/dependency.types";
import { loadInstallRegistry } from "#core/loaders/dependency.loader";

const knownEcosystems = function knownEcosystems(): Set<string> {
    return new Set(loadInstallRegistry().records.map((record) => record.ecosystem));
};

const canonicalEcosystem = function canonicalEcosystem(known: Set<string>, name: string): string {
    const ecosystem = ECOSYSTEM_SHORTCODES[name] ?? name;
    if (!known.has(ecosystem)) {
        const listed = [...known].sort((a, b) => a.localeCompare(b)).join(", ");
        throw new Error(unknownEcosystem(name, listed, Object.keys(ECOSYSTEM_SHORTCODES).join(", ")));
    }
    return ecosystem;
};

export const validateInstallRequest = function validateInstallRequest(request: InstallRequest): InstallRequest {
    const known = knownEcosystems();
    const ecosystems = [...new Set(request.ecosystems.map((name) => canonicalEcosystem(known, name)))];
    if (ecosystems.length === 0 && !request.auto) {
        throw new Error(EMPTY_REQUEST);
    }
    return { ...request, ecosystems };
};
