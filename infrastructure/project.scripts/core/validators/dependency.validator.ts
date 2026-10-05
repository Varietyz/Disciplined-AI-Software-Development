import {
    EVERY_SCRIPT_DECIDED,
    HOIST_REMEDY,
    ONE_HOIST_HELD,
    REVIEW_REMEDY,
    hoistBreachHeading,
    missingAllowScripts,
    undecidedHeading,
} from "#configuration/strings/dependency.strings";
import type { CheckVerdict } from "#types/validation.types";
import { isRecord } from "@banes-lab/build-scripts/core/selectors/base.selector.ts";

const pendingOf = function pendingOf(output: string): readonly unknown[] {
    const parsed: unknown = JSON.parse(output);
    const pending = isRecord(parsed) ? parsed["allowScripts"] : null;
    if (!Array.isArray(pending)) {
        throw new TypeError(missingAllowScripts(output));
    }
    return pending;
};

const labelOf = function labelOf(entry: unknown): string {
    const changes = isRecord(entry) ? entry["changes"] : null;
    const keys = Array.isArray(changes)
        ? changes.flatMap((change) => {
              const key = isRecord(change) ? change["key"] : null;
              return typeof key === "string" ? [key] : [];
          })
        : [];
    return keys.length > 0 ? keys.join(", ") : JSON.stringify(entry);
};

export const hoistVerdict = function hoistVerdict(breaches: readonly string[]): CheckVerdict {
    if (breaches.length === 0) {
        return { held: true, text: ONE_HOIST_HELD };
    }
    const lines = breaches.map((breach) => `  ${breach}`);
    return { held: false, text: [hoistBreachHeading(breaches.length), ...lines, HOIST_REMEDY, ""].join("\n") };
};

export const installScriptVerdict = function installScriptVerdict(listing: string): CheckVerdict {
    const pending = pendingOf(listing);
    if (pending.length === 0) {
        return { held: true, text: EVERY_SCRIPT_DECIDED };
    }
    const lines = pending.map((entry) => `  ${labelOf(entry)}`);
    return { held: false, text: [undecidedHeading(pending.length), ...lines, REVIEW_REMEDY, ""].join("\n") };
};
