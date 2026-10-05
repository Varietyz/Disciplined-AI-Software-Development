export const NO_STDERR_DETAIL = "(no detail on stderr)";

export const NO_ERROR_DETAIL = "(no error detail)";

export const UNKNOWN_SIGNAL = "unknown";

export const UNUSED_FILE = "Unused file";

export const UNFORMATTED_FILE = "File is not formatted — run govlab lint to format it.";

export const MISSING_VERIFY = "htmlhint is installed but exposes no verify entry point";

export const NO_ECOSYSTEM = "quality engine: contextFor requires at least one detected ecosystem";

export const UNUSED_LABELS: Readonly<Record<string, string>> = {
    binaries: "unlisted binary",
    dependencies: "dependency",
    devDependencies: "devDependency",
    duplicates: "duplicate export",
    exports: "export",
    types: "exported type",
    unlisted: "unlisted dependency",
    unresolved: "unresolved import",
};

const INSTALL_HINTS: Readonly<Record<string, string>> = {
    actionlint: "actionlint is not installed — install it (e.g. 'scoop install actionlint').",
    brakeman: "brakeman is not installed — run 'gem install brakeman' to scan Rails apps for security issues.",
    "clang-tidy":
        "clang-tidy is not installed — install LLVM (e.g. 'scoop install llvm') and expose clang-tidy on PATH.",
    clippy: "cargo/clippy is not installed — run 'govlab install rust' to add it.",
    "golangci-lint": "golangci-lint is not installed — run 'govlab install go' to add it.",
    gosec: "gosec is not installed. Install it with go install, as the gosec installation guide describes.",
    hadolint: "hadolint is not installed — run 'govlab install dockerfile' (or scoop/brew install hadolint).",
    luacheck: "luacheck is not installed — install it (e.g. 'scoop install luacheck').",
    oxlint: "oxlint is not installed — run 'npm install -D -E oxlint' to add it.",
    phpcs: "phpcs is not installed — run 'composer global require squizlabs/php_codesniffer'.",
    phpmd: "phpmd is not installed — run 'composer global require phpmd/phpmd'.",
    rubocop: "rubocop is not installed — run 'govlab install ruby' to add it.",
    ruff: "ruff is not installed — run 'govlab install python' to add it.",
    shellcheck: "shellcheck is not installed — run 'govlab install shell' (or scoop/apt install shellcheck).",
    stylua: "stylua is not installed — install it (e.g. 'scoop install stylua').",
    tflint: "tflint is not installed — install it (e.g. 'scoop install tflint').",
    trivy: "trivy is not installed — install it (e.g. 'scoop install trivy') to scan IaC misconfigurations.",
};

const MISSING = "is not installed";

const UNRUNNABLE = "could not run";

const COMMAND_HINTS: Readonly<Record<string, readonly [string, string]>> = {
    bandit: [MISSING, "set bandit.command in govlab.config to your bandit interpreter."],
    checkov: [
        MISSING,
        "set checkov.command in govlab.config to your checkov interpreter (e.g. 'py -3.14 -m checkov.main').",
    ],
    checkstyle: [
        UNRUNNABLE,
        "set checkstyle.command in govlab.config to your '<java> -jar <checkstyle.jar>' invocation.",
    ],
    "clj-kondo": [UNRUNNABLE, "set clj-kondo.command in govlab.config to your clj-kondo binary path."],
    credo: [
        UNRUNNABLE,
        "set credo.command in govlab.config to your mix invocation (e.g. 'mix' or 'wsl.exe -e mix') in a project with credo as a dependency.",
    ],
    detekt: [UNRUNNABLE, "set detekt.command in govlab.config to your '<java> -jar <detekt-cli-all.jar>' invocation."],
    kics: [UNRUNNABLE, "set kics.command, kics.queries (its query library) and kics.libraries in govlab.config."],
    lintr: [
        UNRUNNABLE,
        "set lintr.command in govlab.config to your Rscript invocation (e.g. 'Rscript' or 'wsl.exe -e Rscript') with the lintr package installed.",
    ],
    perlcritic: [UNRUNNABLE, "set perlcritic.command in govlab.config (e.g. 'perlcritic' or 'wsl.exe -e perlcritic')."],
    pmd: [
        UNRUNNABLE,
        "set pmd.command in govlab.config to your '<java> -cp \"<pmd>/lib/*\" net.sourceforge.pmd.cli.PmdCli' invocation.",
    ],
    scalastyle: [
        UNRUNNABLE,
        "set scalastyle.command (its '<java> -jar <scalastyle-batch.jar>' invocation) and scalastyle.config (the ruleset XML path) in govlab.config.",
    ],
    semgrep: [
        UNRUNNABLE,
        "set semgrep.command (e.g. 'semgrep' or 'wsl.exe <path>') and semgrep.config (a ruleset) in govlab.config.",
    ],
    slither: [
        UNRUNNABLE,
        "set slither.command (its binary) and slither.solc (the solc path) in govlab.config, e.g. 'pip install slither-analyzer solc-select'.",
    ],
    sqlfluff: [MISSING, "set sqlfluff.command in govlab.config to your sqlfluff interpreter."],
    swiftlint: [
        UNRUNNABLE,
        "set swiftlint.command in govlab.config (e.g. 'swiftlint' or 'wsl.exe -e swiftlint-static', the self-contained Linux binary).",
    ],
    yamllint: [MISSING, "set yamllint.command in govlab.config to your interpreter."],
};

export const commandHint = function commandHint(tool: string, bin: string): string {
    const [lead, instruction] = COMMAND_HINTS[tool] ?? [MISSING, ""];
    return `${bin} ${lead} — ${instruction}`;
};

export const notInstalledOutput = function notInstalledOutput(tool: string): string {
    return `${tool} is not installed.`;
};

export const installHint = function installHint(tool: string): string {
    return INSTALL_HINTS[tool] ?? notInstalledOutput(tool);
};

export const electedMissing = function electedMissing(tool: string): string {
    return `${tool} is not installed — elected as an owner in govlab.config quality.owners but missing from PATH.`;
};

export const spawnErrorMessage = function spawnErrorMessage(tool: string, detail: string): string {
    return `${tool} could not be spawned: ${detail}`;
};

export const toolErrorMessage = function toolErrorMessage(tool: string, status: number, detail: string): string {
    return `${tool} exited with a tool error (exit ${String(status)}): ${detail}`;
};

export const toolErrorBecause = function toolErrorBecause(
    tool: string,
    status: number,
    cause: string,
    detail: string,
): string {
    return `${tool} exited with a tool error (exit ${String(status)}) — likely ${cause}: ${detail}`;
};

export const incompleteScan = function incompleteScan(tool: string, cause: string, detail: string): string {
    return `${tool} could not complete a scan — likely ${cause}: ${detail}`;
};

export const credoIncomplete = function credoIncomplete(status: number, detail: string): string {
    return `mix credo could not complete (exit ${String(status)}) — likely a compile error or a missing credo dependency: ${detail}`;
};

export const scalastyleIncomplete = function scalastyleIncomplete(detail: string): string {
    return `scalastyle did not complete a scan (no "Processed" summary) — likely a missing/invalid ruleset or jar: ${detail}`;
};

export const semgrepFailed = function semgrepFailed(status: number, detail: string): string {
    return `semgrep exited with an error (exit ${String(status)}) — likely a missing/invalid ruleset: ${detail}`;
};

export const lintrFailed = function lintrFailed(status: number, detail: string): string {
    return `lintr (Rscript) exited with an error (exit ${String(status)}): ${detail}`;
};

export const pmdRecoverable = function pmdRecoverable(status: number): string {
    return `pmd exited with a recoverable error (exit ${String(status)}) — some files may not have been fully analyzed.`;
};

export const signalDeathMessage = function signalDeathMessage(tool: string, signal: string): string {
    return `${tool} was terminated by a signal (${signal}) before completing — a killed run is a tool error, not a clean result.`;
};

export const prettierFailed = function prettierFailed(code: number): string {
    return `prettier exited with code ${String(code)} — see output above.`;
};

export const unusedItem = function unusedItem(label: string, name: string): string {
    return `Unused ${label}: ${name}`;
};

export const duplicatedBlock = function duplicatedBlock(file: string, line: number): string {
    return `Duplicated block: also at ${file}:${String(line)}. Lift the shared logic rather than copying it.`;
};

export const unusedDependency = function unusedDependency(dependency: string, manifest: string): string {
    return `"${dependency}" is declared in ${manifest} but never used.`;
};

export const missingDependency = function missingDependency(dependency: string, manifest: string): string {
    return `"${dependency}" is used but not declared in ${manifest}.`;
};

export const dependencyEdge = function dependencyEdge(from: string, to: string): string {
    return `${from} → ${to}`;
};

export const circularDependency = function circularDependency(chain: string): string {
    return `Circular dependency: ${chain}`;
};

export const unimportedExport = function unimportedExport(name: string): string {
    return `"${name}" is exported but never imported.`;
};

export const dryRunFixes = function dryRunFixes(count: number, listed: string): string {
    return `\n${String(count)} file(s) would be fixed (dry-run):\n${listed}\n`;
};

export const outsideWorkspace = function outsideWorkspace(file: string, root: string): string {
    return `safe-fix: ${file} lies outside the workspace root ${root}, so its temp file has no cache home`;
};

export const runSummary = function runSummary(
    errors: number,
    advisory: number,
    notices: number,
    fixedCount: number,
): string {
    return `${String(errors)} error(s), ${String(advisory)} advisory, ${String(notices)} notice(s), ${String(fixedCount)} fixed`;
};

export const missingFlagValue = function missingFlagValue(flag: string): string {
    return `govlab: ${flag} needs a value`;
};

export const unknownReporter = function unknownReporter(value: string, valid: string): string {
    return `govlab: unknown reporter "${value}" — valid: ${valid}`;
};

export const unknownFlag = function unknownFlag(flag: string): string {
    return `govlab: unknown flag "${flag}"`;
};

export const unknownConcern = function unknownConcern(concern: string, valid: string): string {
    return `govlab: unknown concern "${concern}" — valid: ${valid}`;
};
