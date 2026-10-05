import type { ArgvSpec, PositionalSpec } from "#types/invocation.types";
import {
    CLOSING,
    FLAGS_SLOT,
    HELP_ROW,
    REPEATABLE_NOTE,
    REST_NOTE,
    VALUE_SLOT,
} from "#configuration/strings/invocation.strings";
import { HELP_FLAG, NAME_WIDTH } from "#configuration/constants/invocation.constants";

const positionalShape = function positionalShape(held: PositionalSpec): string {
    const name = held.variadic === true ? `${held.name}...` : held.name;
    return held.optional === true ? `[${name}]` : `<${name}>`;
};

const row = function row(name: string, describe: string): string {
    return `    ${name.padEnd(NAME_WIDTH)}${describe}`;
};

export const usageOf = function usageOf(spec: ArgvSpec): string {
    const positionals = spec.positionals ?? [];
    const shape = positionals.map(positionalShape).join(" ");
    const restName = spec.rest === undefined ? "" : `${spec.rest.name}...`;
    const head = [spec.command, shape, FLAGS_SLOT, spec.rest === undefined ? "" : `[${restName}]`]
        .filter((part) => part.length > 0)
        .join(" ");
    const lines = [head, "", spec.summary, ""];
    for (const held of positionals) {
        lines.push(row(held.name, held.describe));
    }
    if (spec.rest !== undefined) {
        lines.push(row(restName, spec.rest.describe + REST_NOTE));
    }
    for (const flag of spec.flags) {
        const spelled = flag.takesValue ? `${flag.name} ${VALUE_SLOT}` : flag.name;
        lines.push(row(spelled, flag.describe + (flag.repeatable === true ? REPEATABLE_NOTE : "")));
    }
    lines.push(row(HELP_FLAG, HELP_ROW), "", CLOSING);
    return `${lines.join("\n")}\n`;
};
