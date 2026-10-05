export const DISTRIBUTION_STRINGS = {
    complexityExplained: "lower is more regular",
    complexityObserved: "compressibility of the value stream",
    driftExplained: "positive skews recent",
    driftObserved: "per-value position trend over the stream",
    freqExplained(entropy: string): string {
        return `entropy ${entropy} bits`;
    },
    freqObserved(count: string, distinct: string): string {
        return `${count} records over ${distinct} distinct values`;
    },
    predictionExplained(accuracy: string): string {
        return `predicting the mode is right ${accuracy} of the time on held-out history`;
    },
    predictionObserved(mode: string): string {
        return `most likely next value is ${mode}`;
    },
    recencyExplained: "largest gaps are most overdue",
    recencyObserved: "records since each value last appeared",
    seasonalityExplained: "record counts bucketed by month",
    seasonalityObserved(first: string, last: string): string {
        return `${first} to ${last}`;
    },
    temperatureExplained: "positive deviation runs hot",
    temperatureObserved: "recent-window frequency vs baseline",
    uniformDeparts: "departs from uniform",
    uniformExplained(p: string, verdict: string): string {
        return `p=${p}: ${verdict}`;
    },
    uniformObserved(chiSquare: string, dof: string): string {
        return `chi-square ${chiSquare} on ${dof} dof`;
    },
    uniformUniform: "consistent with a uniform null",
} as const;

export const VECTOR_STRINGS = {
    anomalyExplained(count: string): string {
        return `${count} beyond an independence null`;
    },
    anomalyObserved: "z-scored extreme values",
    autocorBeyond: "beyond chance",
    autocorExplained(verdict: string, p: string): string {
        return `${verdict} vs an independence null (p=${p})`;
    },
    autocorObserved: "first-lag autocorrelation",
    autocorWithin: "within chance",
    distributionExplained(min: string, max: string): string {
        return `range ${min} to ${max}`;
    },
    distributionObserved(mean: string, sd: string): string {
        return `mean ${mean}, sd ${sd}`;
    },
} as const;

export const SEQUENCE_STRINGS = {
    predictionExplained(accuracy: string): string {
        return `Markov next-state prediction is right ${accuracy} of the time on held-out history`;
    },
    predictionObserved(last: string, next: string): string {
        return `after ${last}, the next value is most likely ${next}`;
    },
    runsExplained: "distribution of consecutive-repeat run lengths",
    runsObserved(mean: string, longest: string): string {
        return `mean run ${mean}, longest ${longest}`;
    },
    transitionsExplained(verdict: string, p: string): string {
        return `sequence ${verdict} vs an independence null (p=${p})`;
    },
    transitionsHasMemory: "has memory",
    transitionsMemoryless: "is memoryless",
    transitionsObserved(ratio: string): string {
        return `change ratio ${ratio}`;
    },
} as const;

export const GRID_STRINGS = {
    densityExplained(cell: string, count: string): string {
        return `densest cell ${cell} (${count})`;
    },
    densityObserved(points: string, cells: string): string {
        return `${points} points over ${cells} cells`;
    },
} as const;

export const TREE_STRINGS = {
    compositionExplained: "most frequent keys and leaf value types",
    compositionObserved(keys: string, leaves: string): string {
        return `${keys} distinct keys over ${leaves} leaves`;
    },
    structureExplained(shapes: string, records: string): string {
        return `${shapes} distinct shapes over ${records} records`;
    },
    structureObserved(depth: string, branching: string): string {
        return `depth ${depth}, branching ${branching}`;
    },
} as const;

export const GRAPH_STRINGS = {
    combinatoricsExplained(rate: string): string {
        return `repeat rate ${rate}`;
    },
    combinatoricsObserved(sets: string): string {
        return `${sets} distinct member-sets`;
    },
    compositionExplained(ratio: string): string {
        return `high-half ratio ${ratio}`;
    },
    compositionObserved(ratio: string): string {
        return `odd ratio ${ratio}`;
    },
    cooccurrenceExplained: "most frequent co-occurring pairs",
    cooccurrenceObserved(members: string, degree: string): string {
        return `${members} members, mean degree ${degree}`;
    },
    liftExplained: "lift above the independence baseline is over-represented",
    liftObserved: "co-occurrence vs an independence null",
    membersDepart: "depart from uniform",
    membersUniform: "consistent with uniform",
    orderedExplained(symmetry: string): string {
        return `symmetry ${symmetry}`;
    },
    orderedObserved(adjacency: string): string {
        return `adjacency ${adjacency}`;
    },
    positionalExplained: "recurring consecutive-position patterns",
    positionalObserved: "modal value at each list position",
    uniformityExplained(verdict: string): string {
        return `members ${verdict}`;
    },
    uniformityObserved(chiSquare: string, dof: string): string {
        return `chi-square ${chiSquare} on ${dof} dof`;
    },
} as const;

export const NULL_MODEL_LABELS = {
    autocorrelation: "autocorrelation-independence",
    memberUniformity: "member-uniformity",
    transition: "transition-independence",
    uniformity: "uniformity",
} as const;

export const PREDICTION_METHODS = { markov: "held-out Markov", mode: "held-out mode" } as const;
