import { describe, expect, it } from "vitest";
import { themeVariables, tokenValues, withWalk } from "@banes-lab/build-scripts/core/converters/diagram.converter.ts";
import { THEME_TOKENS } from "@banes-lab/build-scripts/configuration/constants/diagram.constants.ts";

describe("tokenValues", () => {
    it("reads every custom property declaration and ignores everything else", () => {
        const css =
            ':root {\n    --white: #fff;\n    --font-family-base: "JetBrains Mono", monospace;\n    color: red;\n}\n';
        const tokens = tokenValues(css);
        expect(tokens.get("--white")).toBe("#fff");
        expect(tokens.get("--font-family-base")).toBe('"JetBrains Mono", monospace');
        expect(tokens.has("color")).toBe(false);
    });
});

describe("themeVariables", () => {
    it("maps each theme variable to its base token's value and refuses a token the base does not declare", () => {
        const tokens = new Map(THEME_TOKENS.map(([, token]) => [token, `value${token}`]));
        const [first] = THEME_TOKENS;
        const variables = themeVariables(tokens);
        expect(variables["background"]).toBe("transparent");
        expect(variables[first?.[0] ?? ""]).toBe(`value${first?.[1] ?? ""}`);
        expect(() => themeVariables(new Map())).toThrow("is not declared in the base tokens");
    });
});

describe("withWalk", () => {
    it("stamps the walk order onto the vector root and leaves a vector without one alone", () => {
        const walk = { attribute: "data-walk", orderOf: () => "a b" };
        expect(withWalk("<svg><g/></svg>", walk)).toBe('<svg data-walk="a b"><g/></svg>');
        expect(withWalk("<svg><g/></svg>", { ...walk, orderOf: () => "" })).toBe("<svg><g/></svg>");
    });
});
