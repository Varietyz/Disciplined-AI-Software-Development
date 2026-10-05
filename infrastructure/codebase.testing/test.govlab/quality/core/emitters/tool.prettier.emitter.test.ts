import { expect, test } from "vitest";
import { emitPrettierConfig } from "@govlab/quality/core/emitters/tool.prettier.emitter.ts";

const WIDTH = 120;

test("emitPrettierConfig layers the base over the defaults and a concern value over both", () => {
    const config = emitPrettierConfig({ base: { semi: false }, concerns: { "line-length": WIDTH } });
    expect(config["semi"]).toBe(false);
    expect(config["printWidth"]).toBe(WIDTH);
});
