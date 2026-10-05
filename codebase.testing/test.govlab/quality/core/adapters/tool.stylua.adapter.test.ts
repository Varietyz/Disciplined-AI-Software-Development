import { expect, test } from "vitest";
import { styluaFlags } from "@govlab/quality/core/adapters/tool.stylua.adapter.ts";

const INDENT_WIDTH = 2;

test("styluaFlags keeps the declared order and drops a value of the wrong type", () => {
    expect(styluaFlags({ columnWidth: "wide", indentType: "Spaces", indentWidth: INDENT_WIDTH })).toStrictEqual([
        "--indent-type",
        "Spaces",
        "--indent-width",
        "2",
    ]);
});
