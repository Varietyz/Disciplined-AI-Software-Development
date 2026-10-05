import type { SurfaceFigureName, SurfaceFrame } from "@banes-lab/web/types/surface.types.ts";

export type ScenarioTool = "await" | "govern";

export interface ToolStep {
    readonly kind: "tool";
    readonly tool: ScenarioTool;
    readonly args: readonly string[];
    readonly exit: number | null;
    readonly figures: readonly SurfaceFigureName[];
    readonly delivers: boolean;
}

export interface WaitStep {
    readonly kind: "wait";
    readonly args: readonly string[];
    readonly exit: number;
    readonly figures: readonly SurfaceFigureName[];
}

export interface WriteStep {
    readonly kind: "write";
    readonly text: string;
    readonly figures: readonly SurfaceFigureName[];
}

export type ScenarioStep = ToolStep | WaitStep | WriteStep;

export interface SampleFile {
    readonly name: string;
    readonly text: string;
}

export interface Scenario {
    readonly samples: readonly SampleFile[];
    readonly steps: readonly ScenarioStep[];
}

export interface Region {
    readonly from: number;
    readonly to: number;
}

export interface FigureFrame {
    readonly figure: SurfaceFigureName;
    readonly before: readonly string[];
    readonly frame: SurfaceFrame;
}

export interface SurfaceRecord {
    readonly figures: number;
    readonly reused: boolean;
}
