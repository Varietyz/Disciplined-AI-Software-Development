import { ROOT, absolutePath, relativePath } from "@ssot/paths";
import { basename, join } from "node:path";
import { eslintScopes, jsonSafe, neutralized } from "#core/converters/config.converter";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import {
    govlabEslintConfig,
    govlabHtmlhintConfig,
    govlabJscpdConfig,
    govlabKnipConfig,
    govlabOxlintConfig,
    govlabPrettierConfig,
    govlabPrettierIgnore,
    govlabStylelintConfig,
} from "@govlab/quality/config";
import { CONFIG_FILE_SUFFIX } from "#configuration/constants/config.constants";
import type { ConfigExtract } from "#types/config.types";
import { isRecord } from "#core/selectors/base.selector";
import { pathToFileURL } from "node:url";
import { writeCanonicalJson } from "@govlab/canonical-write";

const POSIX_SEPARATOR = "/";

const WINDOWS_SEPARATOR = "\\";

const ROOT_TOKEN = "{root}";

const taxonomyOf = async function taxonomyOf(): Promise<unknown> {
    const loaded: unknown = await import(pathToFileURL(absolutePath("govlabHost.taxonomy")).href);
    return isRecord(loaded)
        ? { imports: loaded["imports"], layers: loaded["LAYERS"], taxonomy: loaded["taxonomy"] }
        : null;
};

const EXTRACTS: readonly ConfigExtract[] = [
    { name: "eslint", read: async (root) => eslintScopes(await govlabEslintConfig(root)) },
    { name: "oxlint", read: govlabOxlintConfig },
    { name: "stylelint", read: govlabStylelintConfig },
    {
        name: "prettier",
        read: async (root) => ({ config: await govlabPrettierConfig(root), ignore: await govlabPrettierIgnore(root) }),
    },
    { name: "htmlhint", read: govlabHtmlhintConfig },
    { name: "jscpd", read: govlabJscpdConfig },
    { name: "knip", read: govlabKnipConfig },
    { name: "taxonomy", read: taxonomyOf },
];

const pathTokens = function pathTokens(): (readonly [string, string])[] {
    const posixRoot = ROOT.split(WINDOWS_SEPARATOR).join(POSIX_SEPARATOR);
    const appRoot = relativePath("app.root");
    return [
        [ROOT, ROOT_TOKEN],
        [posixRoot, ROOT_TOKEN],
        [appRoot, `{app.root}`],
        [basename(ROOT), ROOT_TOKEN],
    ];
};

export const extractConfigs = async function extractConfigs(): Promise<number> {
    const folder = absolutePath("app.configs");
    const tokens = pathTokens();
    const files = new Map(
        await Promise.all(
            EXTRACTS.map(async (extract): Promise<[string, unknown]> => [
                extract.name + CONFIG_FILE_SUFFIX,
                neutralized(jsonSafe(await extract.read(ROOT)), tokens),
            ]),
        ),
    );
    mkdirSync(folder, { recursive: true });
    for (const name of existsSync(folder) ? readdirSync(folder) : []) {
        if (!files.has(name)) {
            rmSync(join(folder, name), { force: true, recursive: true });
        }
    }
    await Promise.all([...files].map(async ([name, data]) => writeCanonicalJson(join(folder, name), data)));
    return files.size;
};
