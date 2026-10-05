import { asCheck, mergeCheck } from "#core/converters/check.converter";
import type { CheckFacet } from "#types/check.types";
import { RECORD_KEY_SEPARATOR } from "#configuration/constants/check.constants";

export class CheckTable {
    readonly #byKind = new Map<string, CheckFacet>();
    readonly #byRecord = new Map<string, CheckFacet>();

    public forKind(kind: string, value: unknown): void {
        const facet = asCheck(value);
        if (facet !== null) {
            this.#byKind.set(kind, facet);
        }
    }

    public forRecord(kind: string, id: string, value: unknown): void {
        const facet = asCheck(value);
        if (facet !== null) {
            this.#byRecord.set(`${kind}${RECORD_KEY_SEPARATOR}${id}`, facet);
        }
    }

    public checkOf(kind: string, id: string): CheckFacet | null {
        return mergeCheck(
            this.#byKind.get(kind) ?? null,
            this.#byRecord.get(`${kind}${RECORD_KEY_SEPARATOR}${id}`) ?? null,
        );
    }
}
