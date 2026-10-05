export interface Logger {
    warn: (message: string, detail?: unknown) => void;
}

export interface FaceContext {
    logger?: Logger;
    canonicalizeId?: (term: string) => string;
}

export interface PatternFaceDefinition<P = unknown> {
    name: string;
    dependsOn?: readonly string[];
    build: (context: FaceContext, dependencies: Record<string, unknown>) => P;
}

export interface GovlabPatternsOptions {
    logger?: Logger;
}

export interface GovlabPatterns {
    faces: readonly string[];
}
