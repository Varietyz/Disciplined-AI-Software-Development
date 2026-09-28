import { lifetimeOf } from "../../../config/surface.config.ts";

export const isImmutable = function isImmutable(path: string): boolean {
    const declared = lifetimeOf(path);
    if (declared === null) {
        return false;
    }

    return declared.mutability === "frozen" && declared.removal === "none";
};
