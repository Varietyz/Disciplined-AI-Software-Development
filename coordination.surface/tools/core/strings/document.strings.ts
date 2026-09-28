export const NO_GENERATOR =
    "ABSENT  This project declares no document generator, so there is nothing to run. The README is edited " +
    "directly.\n";

export const generatorRunning = function generatorRunning(invocation: string): string {
    return `RUNNING  ${invocation}\n`;
};

export const generatorFailed = function generatorFailed(invocation: string, status: number | null): string {
    return (
        `FAILED  ${invocation} exited with ${String(status)}. The command comes from the document_generators ` +
        "setting and runs from the package folder, so check that setting first.\n"
    );
};

export const generatorsRan = function generatorsRan(count: number): string {
    return `GENERATED  ${String(count)} document generator(s) ran from the package folder.\n`;
};
