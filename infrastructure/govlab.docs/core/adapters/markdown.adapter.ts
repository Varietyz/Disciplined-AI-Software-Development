import { ROOT } from "@ssot/paths";
import { govlabPrettierConfig } from "@govlab/quality/config";
import prettier from "prettier";

const OVERRIDES_KEY = "overrides";
const MARKDOWN_PARSER = "markdown";

const resolveOptions = async function resolveOptions(): Promise<prettier.Options> {
    const resolved = await govlabPrettierConfig(ROOT);
    const base = Object.fromEntries(Object.entries(resolved).filter(([key]) => key !== OVERRIDES_KEY));
    return { ...base, parser: MARKDOWN_PARSER };
};

const OPTIONS = await resolveOptions();

export const formatMarkdown = async function formatMarkdown(markdown: string): Promise<string> {
    return prettier.format(markdown, OPTIONS);
};
