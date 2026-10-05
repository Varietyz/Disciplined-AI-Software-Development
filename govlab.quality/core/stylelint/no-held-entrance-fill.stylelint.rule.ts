import { dirname, join, sep } from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import postcss, { type AtRule, type Rule as CssRule, type Declaration, type Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import valueParser, { type Node } from "postcss-value-parser";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/no-held-entrance-fill";
const ruleId = "no_held_entrance_fill";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["css-architecture"],
        description: "Forbid an animation that keeps holding a fully opaque final keyframe after it ends",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const KEYFRAMES = "keyframes";
const FINAL_FRAMES = new Set(["to", "100%"]);
const OPACITY = "opacity";
const OPAQUE = new Set(["1", "100%"]);
const HOLDING_FILLS = new Set(["forwards", "both"]);
const SHORTHAND = "animation";
const NAME_LONGHAND = "animation-name";
const FILL_LONGHAND = "animation-fill-mode";
const LAYER_SEPARATOR = ",";
const PACKAGE_MANIFEST = "package.json";
const STYLESHEET_EXTENSION = ".css";
const DEPENDENCY_FOLDER = "node_modules";

const messages = utils.ruleMessages(ruleName, {
    heldFill: (name: string): string =>
        withRuleId(
            `The animation '${name}' ends fully opaque and its fill keeps holding that end state after it finishes, so the element stays a composited layer and becomes the backdrop root of every child. A child's backdrop-filter then blurs nothing. Put the end state in the element's own rule and fill the animation backwards.`,
            ruleId,
        ),
});

const isFinalFrame = function isFinalFrame(frame: CssRule): boolean {
    return frame.selector.split(LAYER_SEPARATOR).some((part) => FINAL_FRAMES.has(part.trim().toLowerCase()));
};

const endsOpaque = function endsOpaque(keyframes: AtRule): boolean {
    let opaque = false;
    keyframes.walkRules((frame) => {
        if (!isFinalFrame(frame)) {
            return;
        }
        frame.walkDecls(OPACITY, (decl) => {
            opaque = OPAQUE.has(decl.value.trim());
        });
    });
    return opaque;
};

const opaqueEndingsIn = function opaqueEndingsIn(root: Root): readonly string[] {
    const names: string[] = [];
    root.walkAtRules((atRule) => {
        if (atRule.name.toLowerCase().endsWith(KEYFRAMES) && endsOpaque(atRule)) {
            names.push(atRule.params.trim());
        }
    });
    return names;
};

const memberRootOf = function memberRootOf(file: string): string | null {
    for (let folder = dirname(file); ; folder = dirname(folder)) {
        if (existsSync(join(folder, PACKAGE_MANIFEST))) {
            return folder;
        }
        if (dirname(folder) === folder) {
            return null;
        }
    }
};

const stylesheetsUnder = function stylesheetsUnder(folder: string): readonly string[] {
    return readdirSync(folder, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(STYLESHEET_EXTENSION))
        .map((entry) => join(entry.parentPath, entry.name))
        .filter((path) => !path.split(sep).includes(DEPENDENCY_FOLDER));
};

const memberEndings = new Map<string, ReadonlySet<string>>();

const opaqueEndingsOf = function opaqueEndingsOf(root: Root): ReadonlySet<string> {
    const file = root.source?.input.file;
    const member = file === undefined ? null : memberRootOf(file);
    if (member === null) {
        return new Set(opaqueEndingsIn(root));
    }
    const cached = memberEndings.get(member);
    if (cached !== undefined) {
        return new Set([...cached, ...opaqueEndingsIn(root)]);
    }
    const names = new Set(
        stylesheetsUnder(member).flatMap((path) => opaqueEndingsIn(postcss.parse(readFileSync(path, "utf8")))),
    );
    memberEndings.set(member, names);
    return new Set([...names, ...opaqueEndingsIn(root)]);
};

const layersOf = function layersOf(value: string): readonly (readonly string[])[] {
    const layers: string[][] = [[]];
    for (const node of valueParser(value).nodes) {
        layers.push(...layerBreak(node));
        const current = layers.at(-1);
        if (node.type === "word" && current !== undefined) {
            current.push(node.value);
        }
    }
    return layers;
};

const layerBreak = function layerBreak(node: Node): string[][] {
    return node.type === "div" && node.value === LAYER_SEPARATOR ? [[]] : [];
};

const heldIn = function heldIn(words: readonly string[], opaque: ReadonlySet<string>): string | null {
    const holds = words.some((word) => HOLDING_FILLS.has(word.toLowerCase()));
    return holds ? (words.find((word) => opaque.has(word)) ?? null) : null;
};

const siblingValue = function siblingValue(decl: Declaration, prop: string): string | null {
    let found: string | null = null;
    decl.parent?.each((sibling) => {
        if (sibling.type === "decl" && sibling.prop.toLowerCase() === prop) {
            found = sibling.value;
        }
    });
    return found;
};

const heldNames = function heldNames(decl: Declaration, opaque: ReadonlySet<string>): readonly string[] {
    const prop = decl.prop.toLowerCase();
    if (prop === SHORTHAND) {
        return layersOf(decl.value).flatMap((words) => {
            const name = heldIn(words, opaque);
            return name === null ? [] : [name];
        });
    }
    if (prop !== FILL_LONGHAND) {
        return [];
    }
    const names = siblingValue(decl, NAME_LONGHAND);
    const words = [...layersOf(decl.value).flat(), ...(names === null ? [] : layersOf(names).flat())];
    const name = heldIn(words, opaque);
    return name === null ? [] : [name];
};

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            const opaque = opaqueEndingsOf(root);
            if (opaque.size === 0) {
                return;
            }
            root.walkDecls((decl: Declaration) => {
                for (const name of heldNames(decl, opaque)) {
                    utils.report({ message: messages.heldFill(name), node: decl, result, ruleName, word: name });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
