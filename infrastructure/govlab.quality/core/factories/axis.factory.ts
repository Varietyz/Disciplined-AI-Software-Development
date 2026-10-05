import type {
    AxisContext,
    AxisMessages,
    AxisPlugins,
    AxisRuleInputs,
    AxisSecondaryOptions,
    AxisSpec,
    ForeignFn,
    RedefinedFn,
} from "#types/axis.types";
import type { Rule as CssRule, Root } from "postcss";
import stylelint, { type Plugin, type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import type { TypeSystemLayout } from "#types/config.types";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;

const COMBINATORS = new Set([" ", ">", "+", "~", "\t", "\n"]);

const BRACKET_DELTA = new Map([
    ["[", 1],
    ["]", -1],
]);

const subjectCompound = function subjectCompound(selector: string): string {
    let depth = 0;
    let lastCombinator = -1;
    for (let i = 0; i < selector.length; i += 1) {
        const c = selector[i] ?? "";
        const delta = BRACKET_DELTA.get(c);
        if (delta !== undefined) {
            depth += delta;
            continue;
        }
        if (depth === 0 && COMBINATORS.has(c)) {
            lastCombinator = i;
        }
    }
    return selector.slice(lastCombinator + 1);
};

const attrValueEnd = function attrValueEnd(selector: string, from: number): number {
    let i = from;
    while (i < selector.length && selector[i] !== '"' && selector[i] !== "'" && selector[i] !== "]") {
        i += 1;
    }
    return i;
};

const stepValue = function stepValue(selector: string, attrToken: string): string | null {
    const start = selector.indexOf(attrToken);
    const eq = start === -1 ? -1 : selector.indexOf("=", start);
    if (eq === -1) {
        return null;
    }
    const afterEq = eq + 1;
    const quoted = selector[afterEq] === '"' || selector[afterEq] === "'";
    const valueStart = quoted ? afterEq + 1 : afterEq;
    return selector.slice(valueStart, attrValueEnd(selector, valueStart));
};

const buildMessages = function buildMessages(spec: AxisSpec): AxisMessages {
    const { attrToken, label, owns, ruleId, ruleName } = spec;
    const foreign: ForeignFn = (selector, home) =>
        withRuleId(
            `Selector '${selector}' defines a step of the ${label} scale outside ${home}, which owns it. Every step of ${owns} is declared there once and referenced elsewhere; a rule matching ${attrToken}] anywhere else redefines the scale for one surface. Remove this rule and reference the step; a step that does not exist yet is added to the owning file and its declared vocabulary.`,
            ruleId,
        );
    const redefined: RedefinedFn = (step) =>
        withRuleId(
            `${label} step '${attrToken}="${step}"]' is defined more than once in the file that owns it. A step is one rule — merge the declarations into it.`,
            ruleId,
        );
    return { foreign, messages: utils.ruleMessages(ruleName, { foreign, redefined }), redefined };
};

const handleStep = function handleStep(cssRule: CssRule, ctx: AxisContext, seen: Set<string>): void {
    const step = stepValue(cssRule.selector, ctx.attrToken);
    if (step === null || !ctx.validSteps.has(step)) {
        return;
    }
    if (seen.has(step)) {
        utils.report({
            message: ctx.redefined(step),
            node: cssRule,
            result: ctx.result,
            ruleName: ctx.ruleName,
            word: cssRule.selector,
        });
    }
    seen.add(step);
};

const checkCssRule = function checkCssRule(cssRule: CssRule, ctx: AxisContext, seen: Set<string>): void {
    if (!cssRule.selector.includes(ctx.attrToken)) {
        return;
    }
    if (!ctx.isHome) {
        utils.report({
            message: ctx.foreign(cssRule.selector, ctx.home),
            node: cssRule,
            result: ctx.result,
            ruleName: ctx.ruleName,
            word: cssRule.selector,
        });
        return;
    }
    if (subjectCompound(cssRule.selector).includes(ctx.attrToken)) {
        handleStep(cssRule, ctx, seen);
    }
};

const isSecondaryOptions = function isSecondaryOptions(value: unknown): value is AxisSecondaryOptions {
    return typeof value === "object" && value !== null;
};

const axisOptions = function axisOptions(
    primary: unknown,
    secondaryOptions: unknown,
): { home: string; steps: string[] } | null {
    if (primary !== true) {
        return null;
    }
    const opts: AxisSecondaryOptions = isSecondaryOptions(secondaryOptions) ? secondaryOptions : {};
    const home = typeof opts.home === "string" ? opts.home : "";
    const steps = Array.isArray(opts.steps) ? opts.steps : [];
    return home.length === 0 || steps.length === 0 ? null : { home, steps };
};

const applyAxisRule = function applyAxisRule(inputs: AxisRuleInputs, root: Root, result: PostcssResult): void {
    const options = axisOptions(inputs.primary, inputs.secondaryOptions);
    if (options === null) {
        return;
    }
    const { home, steps } = options;
    const from = (root.source?.input.from ?? "").split("\\").join("/");
    const ctx: AxisContext = {
        attrToken: inputs.spec.attrToken,
        foreign: inputs.built.foreign,
        home,
        isHome: from.endsWith(home),
        redefined: inputs.built.redefined,
        result,
        ruleName: inputs.spec.ruleName,
        validSteps: new Set(steps),
    };
    const seen = new Set<string>();
    root.walkRules((cssRule: CssRule): void => {
        checkCssRule(cssRule, ctx, seen);
    });
};

const AXIS_CANON = ["design-tokens", "css-architecture"];

const axisSpecFor = function axisSpecFor(axis: string): AxisSpec {
    return {
        attrToken: `[data-${axis}`,
        label: axis,
        meta: {
            canonical: AXIS_CANON,
            description: `Every step of the ${axis} axis is defined once, in the file that owns the axis`,
            fixable: false,
        },
        owns: `the ${axis} axis`,
        ruleId: `${axis}_axis_definition`,
        ruleName: `govlab/${axis}-axis`,
    };
};

export const axisPluginsFor = function axisPluginsFor(typeSystem?: TypeSystemLayout): AxisPlugins {
    const homes: Record<string, string | undefined> = { ...typeSystem?.axisHomes };
    const out: AxisPlugins = { meta: [], plugins: [], rules: {} };
    for (const [axis, steps] of Object.entries(typeSystem?.axes ?? {})) {
        const home = homes[axis];
        if (typeof home === "string" && Array.isArray(steps) && steps.length > 0) {
            const spec = axisSpecFor(axis);
            const built = axisDefinitionRule(spec);
            out.meta.push(built.RULE_META);
            out.plugins.push(built.rule);
            out.rules[spec.ruleName] = [true, { home, steps }];
        }
    }
    return out;
};

export const axisDefinitionRule = function axisDefinitionRule(spec: AxisSpec): {
    RULE_META: GovlabStylelintMeta;
    rule: Plugin;
} {
    const { ruleName } = spec;
    const RULE_META: GovlabStylelintMeta = { meta: spec.meta, ruleId: spec.ruleId, ruleName };
    const built = buildMessages(spec);
    const rule: Rule = Object.assign(
        (primary: unknown, secondaryOptions: unknown) =>
            (root: Root, result: PostcssResult): void => {
                applyAxisRule({ built, primary, secondaryOptions, spec }, root, result);
            },
        { messages: built.messages, ruleName },
    );
    return { RULE_META, rule: createPlugin(ruleName, rule) };
};
