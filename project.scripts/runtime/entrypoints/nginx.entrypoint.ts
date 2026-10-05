import { commentVerdict, engineVerdict } from "#core/validators/nginx.validator";
import { defineCheck } from "@govlab/context/check";
import process from "node:process";
import { serverConfigFiles } from "#core/loaders/nginx.loader";

defineCheck({ detects: [], enforces: ["architecture:standards-compliance"] });

const files = serverConfigFiles();
const verdicts = [commentVerdict(files), engineVerdict(files)];
process.stdout.write(verdicts.map((verdict) => verdict.text).join(""));
process.exitCode = verdicts.every((verdict) => verdict.held) ? 0 : 1;
