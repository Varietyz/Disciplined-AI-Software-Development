import type { Accumulator, RepresentationRuntime } from "#types/representation.types";
import type { Finding } from "#types/finding.types";

export const runtimeOf = function runtimeOf<S>(
    accumulator: Accumulator<S>,
    findingsOf: (summary: S) => Finding[],
): RepresentationRuntime {
    return {
        findings(): Finding[] {
            return findingsOf(accumulator.result());
        },
        sample(rng): unknown {
            return accumulator.sample(rng);
        },
        update(chunk): void {
            accumulator.update(chunk);
        },
    };
};
