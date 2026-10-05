import {
    CLOSING,
    FLAGS_SLOT,
    HELP_ROW,
    REPEATABLE_NOTE,
    REST_NOTE,
    VALUE_SLOT,
} from "@govlab/argv/configuration/strings/invocation.strings.ts";
import { HELP_FLAG, NAME_WIDTH } from "@govlab/argv/configuration/constants/invocation.constants.ts";
import { describe, expect, it } from "vitest";
import { SPEC } from "../converters/invocation.fixture.ts";
import { usageOf } from "@govlab/argv";

describe("usageOf", () => {
    it("names the command, the positional and every flag", () => {
        const usage = usageOf(SPEC);
        expect(usage).toContain(`npm run thing -- <input> ${FLAGS_SLOT}`);
        expect(usage).toContain(`--tag ${VALUE_SLOT}`);
        expect(usage).toContain(REPEATABLE_NOTE.trim());
        expect(usage).toContain(`    ${HELP_FLAG.padEnd(NAME_WIDTH)}${HELP_ROW}`);
        expect(usage.endsWith(`${CLOSING}\n`)).toBe(true);
    });

    it("marks an optional variadic positional and a rest slot", () => {
        const usage = usageOf({
            ...SPEC,
            positionals: [{ describe: "files", name: "file", optional: true, variadic: true }],
            rest: { describe: "passed on", name: "args" },
        });
        expect(usage).toContain("[file...]");
        expect(usage).toContain("[args...]");
        expect(usage).toContain(REST_NOTE);
    });
});
