import type { Logger } from "#types/pattern.types";

export const NOOP_LOGGER: Logger = Object.freeze({
    warn(): void {
        return undefined;
    },
});
