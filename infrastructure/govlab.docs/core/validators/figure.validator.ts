import type { ManifestModule } from "#types/manifest.types";
import { chartsStale } from "#configuration/strings/package.strings";
import { existsSync } from "node:fs";
import { relativePath } from "@ssot/paths";
import { resolve } from "node:path";

export const staleChartsMessages = function staleChartsMessages(module: ManifestModule, hasCharts: boolean): string[] {
    const charts = relativePath("moduleInfo.charts");
    if (hasCharts || !existsSync(resolve(module.dir, charts))) {
        return [];
    }
    return [chartsStale([module.label, charts].join("/"))];
};
