import { expect, test } from "vitest";
import { loadTools } from "@govlab/quality/core/loaders/tool.loader.ts";

const EXPECTED_TOOLS = [
    "actionlint",
    "bandit",
    "brakeman",
    "checkov",
    "checkstyle",
    "clang-tidy",
    "clippy",
    "clj-kondo",
    "credo",
    "depcheck",
    "dependency-cruiser",
    "detekt",
    "eslint",
    "go-critic",
    "golangci-lint",
    "gosec",
    "hadolint",
    "htmlhint",
    "jscpd",
    "kics",
    "knip",
    "lintr",
    "luacheck",
    "madge",
    "oxlint",
    "perlcritic",
    "phpcs",
    "phpmd",
    "pmd",
    "prettier",
    "pylint",
    "revive",
    "rubocop",
    "ruff",
    "scalastyle",
    "semgrep",
    "shellcheck",
    "slither",
    "sqlfluff",
    "staticcheck",
    "stylelint",
    "stylua",
    "swiftlint",
    "tflint",
    "trivy",
    "ts-prune",
    "yamllint",
];

test("loadTools discovers every adapter in the adapters folder and each registers one runner", async () => {
    const tools = await loadTools();
    expect(tools.map((runner) => runner.tool)).toStrictEqual(EXPECTED_TOOLS);
    for (const runner of tools) {
        expect(typeof runner.run).toBe("function");
        expect(runner.ecosystems.length).toBeGreaterThan(0);
    }
});
