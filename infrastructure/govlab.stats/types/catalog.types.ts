export interface QualityStats {
    available: boolean;
    byEcosystem: Map<string, number>;
    byTool: Map<string, number>;
    canonicalMapped: number;
    concepts: number;
    ecosystems: number;
    producer: string;
    tools: number;
    totalRules: number;
}
