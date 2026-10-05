import type { LayoutPolicy, PackageShape } from "#types/figure.types";

export const FRAMEWORK_SIBLING_THRESHOLD = 2;

export const FULL_STACK_SEGMENT = "full-stack";

export const FULL_STACK_EXPORTS: readonly string[] = ["./frontend", "./backend"];

export const LAYOUT_BY_SHAPE: Readonly<Record<PackageShape, LayoutPolicy>> = {
    framework: { cluster: true, direction: "TD", nodeCap: 70, perAxis: false },
    "full-stack": { cluster: true, direction: "TD", nodeCap: 70, perAxis: true },
    leaf: { cluster: false, direction: "TD", nodeCap: 45, perAxis: false },
};

export const MISSING_MATURITY = "-";
