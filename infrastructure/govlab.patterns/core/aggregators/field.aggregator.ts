import { DataLoadError, isBlank, kindOf, primitiveOf, resolvePrimitive } from "#core/classifiers/schema.classifier";
import type { FieldSchema, Kind, Primitive } from "#types/schema.types";
import { heterogeneousKinds, unresolvedKind } from "#configuration/strings/schema.strings";

export class FieldAccumulator {
    private readonly kinds = new Set<Kind>();
    private readonly primitives = new Set<Primitive>();
    private readonly lengths = new Set<number>();
    private present = 0;
    private elementNumeric = true;
    private sawElement = false;

    public observe(value: unknown, floatField: boolean): void {
        if (isBlank(value)) {
            return;
        }
        this.present += 1;
        const kind = kindOf(value);
        this.kinds.add(kind);
        if (kind === "scalar") {
            this.primitives.add(primitiveOf(value, floatField));
        }
        if (Array.isArray(value)) {
            this.observeList(value);
        }
    }

    public result(name: string, total: number): FieldSchema {
        if (this.present === 0) {
            return { elementNumeric: false, fixedLength: null, kind: "scalar", name, nullable: true, primitive: null };
        }
        if (this.kinds.size !== 1) {
            const kinds = [...this.kinds].sort((a, b) => a.localeCompare(b)).join(", ");
            throw new DataLoadError(heterogeneousKinds(name, kinds));
        }
        const [kind] = [...this.kinds];
        if (kind === undefined) {
            throw new DataLoadError(unresolvedKind(name));
        }
        const [firstLength] = [...this.lengths];
        return {
            elementNumeric: this.sawElement && this.elementNumeric,
            fixedLength: this.lengths.size === 1 ? (firstLength ?? null) : null,
            kind,
            name,
            nullable: this.present < total,
            primitive: kind === "scalar" ? resolvePrimitive(name, this.primitives) : null,
        };
    }

    private observeList(value: readonly unknown[]): void {
        this.lengths.add(value.length);
        for (const element of value) {
            this.sawElement = true;
            if (typeof element !== "number") {
                this.elementNumeric = false;
            }
        }
    }
}
