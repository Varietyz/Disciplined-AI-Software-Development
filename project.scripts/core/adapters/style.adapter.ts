import { ALWAYS_REACHED, UNKNOWN_FILE } from "#configuration/constants/style.constants";
import { PurgeCSS } from "purgecss";
import type { UnusedSelector } from "#types/style.types";
import { normalizePath } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import process from "node:process";
import { relative } from "node:path";
import { relativePath } from "@ssot/paths";

export const unusedSelectors = async function unusedSelectors(): Promise<readonly UnusedSelector[]> {
    const member = relativePath("app.member");
    const results = await new PurgeCSS().purge({
        content: [`${member}/**/*.html`, `${member}/**/*.ts`],
        css: [`${member}/**/*.css`],
        rejected: true,
        safelist: { standard: [...ALWAYS_REACHED] },
    });
    return results.flatMap((result) =>
        (result.rejected ?? []).map((selector) => ({
            file: typeof result.file === "string" ? normalizePath(relative(process.cwd(), result.file)) : UNKNOWN_FILE,
            selector,
        })),
    );
};
