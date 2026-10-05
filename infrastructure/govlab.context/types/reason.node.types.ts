export interface ReasonLayer {
    id: string;
    label: string;
    question: string;
    aliases?: string[];
}

export interface MathType {
    id: string;
    domains: string[];
    question: string;
    predicateFamily: string;
    yieldsShape: string;
    aliases?: string[];
}

export interface Axis {
    id: string;
    layer: string;
    question: string;
    mandatory: string;
    primaryMathType: string;
    selectable: boolean;
    aliases?: string[];
}

export interface ReasonNode {
    id: string;
    name: string;
    axis: string;
    mathType: string;
    concept?: string;
    question?: string;
    answerShape?: string;
    decisionTest?: string;
    role?: string;
    aliases?: string[];
}

export interface SubstrateNode {
    id: string;
    name: string;
    layer: string;
    mathType: string;
    aliases?: string[];
}

export interface CycleRecursion {
    from: string;
    to: string;
}

export interface Substrate {
    cycle: string[];
    recursion: CycleRecursion;
    nodes: SubstrateNode[];
}

export interface LoopStage {
    id: string;
    axis: string;
}

export interface LoopTransition {
    from: string;
    to: string;
    kind: string;
    gate?: string;
    onFail?: string;
    onPass?: string;
}

export interface DerivationLoop {
    id: string;
    stages: LoopStage[];
    transitions: LoopTransition[];
}

export interface ReasonEdge {
    from: string;
    to?: string;
    label?: string;
}
