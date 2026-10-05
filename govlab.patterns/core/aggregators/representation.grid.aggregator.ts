import type { GridSummary } from "#types/representation.types";
import type { Rng } from "#types/seed.types";
import { foldRecords } from "#core/selectors/record.selector";
import { increment } from "#core/counters/base.counter";
import { weightedChoice } from "#core/selectors/counter.selector";

const PAIR = 2;
const DEFAULT_CELL = 1;
const CELL_SEP = ",";

const isNumberPair = function isNumberPair(value: unknown): value is [number, number] {
    return (
        Array.isArray(value) && value.length === PAIR && typeof value[0] === "number" && typeof value[1] === "number"
    );
};

export class GridAccumulator {
    private readonly field: string;
    private readonly cellSize: number;
    private readonly cells = new Map<string, number>();
    private points = 0;

    public constructor(field: string, cellSize = DEFAULT_CELL) {
        this.field = field;
        this.cellSize = cellSize;
    }

    public update(chunk: readonly unknown[]): void {
        foldRecords(chunk, this.field, (value) => {
            this.observe(value);
        });
    }

    public sample(rng: Rng): [number, number] | null {
        const key = weightedChoice(rng, this.cells);
        if (key === null) {
            return null;
        }
        const [cellX = 0, cellY = 0] = key.split(CELL_SEP).map(Number);
        return [(cellX + rng.next()) * this.cellSize, (cellY + rng.next()) * this.cellSize];
    }

    public result(): GridSummary {
        let densestCell = "";
        let densestCount = this.cells.size === 0 ? 0 : -1;
        for (const [cell, count] of this.cells) {
            if (count > densestCount) {
                densestCell = cell;
                densestCount = count;
            }
        }
        return { densestCell, densestCount, distinctCells: this.cells.size, field: this.field, points: this.points };
    }

    private observe(value: unknown): void {
        if (!isNumberPair(value)) {
            return;
        }
        this.points += 1;
        const [x, y] = value;
        increment(this.cells, `${Math.floor(x / this.cellSize)}${CELL_SEP}${Math.floor(y / this.cellSize)}`);
    }
}
