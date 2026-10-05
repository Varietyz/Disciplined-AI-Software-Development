import { AUTHORED_ROLES, ROLE_BY_EXT } from "#configuration/constants/source.constants";
import type { FileRole } from "#types/source.types";

export const roleOf = function roleOf(ext: string): FileRole {
    return ROLE_BY_EXT.get(ext) ?? "other";
};

export const isAuthoredRole = function isAuthoredRole(role: FileRole): boolean {
    return AUTHORED_ROLES.includes(role);
};
