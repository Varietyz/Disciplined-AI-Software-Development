import { axisDefinitionRule, axisPluginsFor } from "@govlab/quality/core/factories/axis.factory.ts";
import { expect, test } from "vitest";

test("axisPluginsFor builds nothing when the type system declares no axes", () => {
    expect(axisPluginsFor()).toMatchObject({ meta: [], plugins: [] });
});

const spec = {
    attrToken: "data-step",
    label: "step",
    meta: { canonical: ["css-architecture"], description: "An axis is defined by the module that owns it." },
    owns: "steps",
    ruleId: "css_axis_definition",
    ruleName: "govlab/axis-definition",
};

test("axisDefinitionRule returns the declared metadata for the axis it is built from", () => {
    const { RULE_META } = axisDefinitionRule(spec);
    expect(RULE_META).toStrictEqual({ meta: spec.meta, ruleId: spec.ruleId, ruleName: spec.ruleName });
});

test("axisDefinitionRule returns a stylelint plugin object for the axis", () => {
    const { rule } = axisDefinitionRule(spec);
    expect(typeof rule).toBe("object");
});
