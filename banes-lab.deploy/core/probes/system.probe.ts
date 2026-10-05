import {
    BYTES_PER_GB,
    DECIMALS,
    SECONDS_PER_DAY,
    SECONDS_PER_HOUR,
} from "#configuration/constants/deployment.constants";
import {
    CORES_SUFFIX,
    CPU_LABEL,
    DAY_SUFFIX,
    GIGABYTE,
    HOUR_SUFFIX,
    MEMORY_LABEL,
    NODE_LABEL,
    OS_LABEL,
    UNKNOWN,
    UPTIME_LABEL,
} from "#configuration/strings/notification.strings";
import { arch, cpus, release, totalmem, type, uptime } from "node:os";
import { bullet, code, lines } from "#core/converters/markdown.converter";

const processor = function processor(): string {
    const cores = cpus();
    const [first] = cores;
    return first === undefined ? UNKNOWN : `${first.model} (${String(cores.length)}${CORES_SUFFIX}`;
};

const runningFor = function runningFor(): string {
    const seconds = uptime();
    const days = Math.floor(seconds / SECONDS_PER_DAY);
    const hours = Math.floor((seconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR);
    return String(days) + DAY_SUFFIX + String(hours) + HOUR_SUFFIX;
};

const entry = function entry(label: string, value: string): string {
    return bullet(label, code(value));
};

export const describeSystem = function describeSystem(): string {
    const platform = `${type()} ${release()} ${arch()}`;
    const memory = (totalmem() / BYTES_PER_GB).toFixed(DECIMALS) + GIGABYTE;
    const entries = [
        entry(OS_LABEL, platform),
        entry(NODE_LABEL, process.version),
        entry(CPU_LABEL, processor()),
        entry(MEMORY_LABEL, memory),
        entry(UPTIME_LABEL, runningFor()),
    ];
    return lines(entries);
};
