import process from "node:process";

const LINE_BREAK = "\n";

export const print = function print(message = ""): void {
    process.stdout.write(`${message}${LINE_BREAK}`);
};

export const printErr = function printErr(message = ""): void {
    process.stderr.write(`${message}${LINE_BREAK}`);
};
