import type { Concern, ConcernSpec, Reporter } from "#types/quality.types";

export const CONCERNS: Readonly<Record<Concern, ConcernSpec>> = {
    actions: { ecosystems: ["actions"] },
    ansible: { ecosystems: ["ansible"] },
    clojure: { ecosystems: ["clojure"] },
    cpp: { ecosystems: ["cpp"] },
    csharp: { ecosystems: ["csharp"] },
    dockerfile: { ecosystems: ["dockerfile"] },
    duplication: { ecosystems: ["javascript", "typescript", "css", "html"], only: ["jscpd"] },
    elixir: { ecosystems: ["elixir"] },
    eslint: { ecosystems: ["javascript", "typescript"], only: ["eslint"] },
    format: { ecosystems: ["javascript", "typescript", "css", "json"], only: ["prettier"] },
    go: { ecosystems: ["go"] },
    htmlhint: { ecosystems: ["html"], only: ["htmlhint"] },
    iac: { ecosystems: ["iac"] },
    install: {},
    java: { ecosystems: ["java"] },
    kotlin: { ecosystems: ["kotlin"] },
    lint: {
        ecosystems: [
            "javascript",
            "typescript",
            "css",
            "html",
            "json",
            "yaml",
            "python",
            "go",
            "ruby",
            "rust",
            "sql",
            "shell",
            "dockerfile",
            "php",
            "lua",
            "java",
            "kotlin",
            "scala",
            "clojure",
            "perl",
            "swift",
        ],
    },
    list: {},
    lua: { ecosystems: ["lua"] },
    oxlint: { ecosystems: ["typescript"], only: ["oxlint"] },
    perl: { ecosystems: ["perl"] },
    php: { ecosystems: ["php"] },
    python: { ecosystems: ["python"] },
    r: { ecosystems: ["r"] },
    ruby: { ecosystems: ["ruby"] },
    rust: { ecosystems: ["rust"] },
    scala: { ecosystems: ["scala"] },
    shell: { ecosystems: ["shell"] },
    solidity: { ecosystems: ["solidity"] },
    sql: { ecosystems: ["sql"] },
    stylelint: { ecosystems: ["css"], only: ["stylelint"] },
    swift: { ecosystems: ["swift"] },
    unused: { ecosystems: ["javascript", "typescript"], only: ["knip"] },
    yaml: { ecosystems: ["yaml"], only: ["yamllint"] },
};

export const AGGREGATE_CONCERN: Concern = "lint";

export const INSTALL_CONCERN: Concern = "install";

export const CONFIG_FLAG = "--config";

export const FLAG_PREFIX = "--";

export const VALUE_FLAGS: ReadonlySet<string> = new Set(["--reporter", CONFIG_FLAG]);

export const REPORTERS: ReadonlySet<Reporter> = new Set<Reporter>(["human", "json"]);

export const FLAG_AND_VALUE = 2;
