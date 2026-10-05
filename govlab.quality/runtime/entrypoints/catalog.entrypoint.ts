import { FLAGS, LIST_SEPARATOR } from "#configuration/constants/invocation.constants";
import { flagValue, resolveArgv } from "@govlab/argv";
import { CATALOG_ARGV } from "#configuration/configs/invocation.config";
import process from "node:process";
import { regenerateCatalog } from "#core/coordinators/catalog.coordinator";

const argv = resolveArgv(CATALOG_ARGV);

const namesOf = function namesOf(flag: string): string[] {
    return (flagValue(argv, flag) ?? "").split(LIST_SEPARATOR).filter((name) => name.length > 0);
};

await regenerateCatalog({ knobs: namesOf(FLAGS.knobs), rules: namesOf(FLAGS.rules) }, (line) => {
    process.stdout.write(line);
});
