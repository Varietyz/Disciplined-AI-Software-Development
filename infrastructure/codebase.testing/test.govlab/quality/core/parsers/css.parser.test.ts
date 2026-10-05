import {
    componentsInFile,
    definedVars,
    extractClamps,
    extractClassNames,
    scriptVarRefs,
    usedVars,
    valueUnits,
} from "@govlab/quality/core/parsers/css.parser.ts";
import { expect, test } from "vitest";

test("valueUnits reads each number and its unit and skips unitless words", () => {
    expect(valueUnits("1px solid 2rem auto 3")).toStrictEqual([
        { number: "1", unit: "px" },
        { number: "2", unit: "rem" },
    ]);
});

test("extractClassNames reads every class of a compound selector", () => {
    expect(extractClassNames(".card-title > .icon_x:hover")).toStrictEqual(["card-title", "icon_x"]);
    expect(extractClassNames("a .1bad")).toStrictEqual([]);
});

test("extractClamps splits each well-formed clamp into its three bounds", () => {
    expect(extractClamps("clamp(1rem, 2vw, 3rem) clamp(1px, 2px)")).toStrictEqual([
        { full: "clamp(1rem, 2vw, 3rem)", max: "3rem", min: "1rem", preferred: "2vw" },
    ]);
    expect(extractClamps("clamp(1rem, calc(2vw + 1px), 3rem")).toStrictEqual([]);
});

test("definedVars collects defined custom properties and ignores uses", () => {
    expect(definedVars(":root {\n  --brand: #fff;\n  --gap: 8px;\n}")).toStrictEqual(["--brand", "--gap"]);
    expect(definedVars(".x { color: var(--brand); }")).toStrictEqual([]);
});

test("usedVars and scriptVarRefs read references in stylesheets and scripts", () => {
    expect(usedVars(".x { color: var(--brand); }")).toStrictEqual(["--brand"]);
    expect(scriptVarRefs('el.style.setProperty("--drift", 1);')).toStrictEqual(["--drift"]);
});

test("componentsInFile finds each base component a selector defines", () => {
    expect([...componentsInFile(".btn-primary { color: red; }\n.menu, .card { }")]).toStrictEqual([
        "btn",
        "card",
        "menu",
    ]);
});
