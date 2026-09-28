import type { RaiseOutcome } from "../types/venue.types.ts";
import { raiseRefused } from "../strings/venue.strings.ts";

export const venueRefusal = function venueRefusal(reason: string): RaiseOutcome {
    return { code: 2, message: raiseRefused(reason), raised: null };
};
