import { existsSync, readFileSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { join } from "node:path";

export const sourceTextOf = function sourceTextOf(name: string): string | null {
    const file = join(absolutePath("app.sources"), name);
    return existsSync(file) ? readFileSync(file, "utf8") : null;
};
