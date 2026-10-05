import { expect, test } from "vitest";
import { pylintStatusOk } from "@govlab/quality/core/adapters/tool.pylint.adapter.ts";

const MESSAGES_ONLY = 4;
const FATAL = 1;
const USAGE = 32;

test("pylintStatusOk accepts message bits and refuses the fatal and usage bits", () => {
    expect(pylintStatusOk(0)).toBe(true);
    expect(pylintStatusOk(MESSAGES_ONLY)).toBe(true);
    expect(pylintStatusOk(FATAL)).toBe(false);
    expect(pylintStatusOk(USAGE)).toBe(false);
    expect(pylintStatusOk(null)).toBe(false);
});
