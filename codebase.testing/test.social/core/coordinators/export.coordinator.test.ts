import { SUBJECT_SEPARATOR, UNKNOWN_CARD } from "@banes-lab/social-share/configuration/strings/card.strings.ts";
import { describe, expect, it } from "vitest";
import { fileURLToPath, pathToFileURL } from "node:url";
import { STAGE_SHEETS } from "@banes-lab/social-share/configuration/constants/card.constants.ts";
import { exportCards } from "@banes-lab/social-share/core/coordinators/export.coordinator.ts";
import { readFileSync } from "node:fs";

const IMPORT_OPEN = 'import "';
const IMPORT_CLOSE = '";';
const SHEET_SUFFIX = ".css";

describe("exportCards", () => {
    it("refuses a card id no card registers before it renders or writes anything", async () => {
        await expect(
            exportCards({ force: false, gpu: false, only: "nowhere", url: "https://127.0.0.1:1/" }, []),
        ).rejects.toThrow(`${UNKNOWN_CARD + SUBJECT_SEPARATOR}nowhere`);
    });
});

describe("the stylesheets the fingerprint reads", () => {
    it("are exactly the stylesheets the stage page loads, so a restyle always outdates the images", () => {
        const entrypoint = import.meta.resolve("@banes-lab/social-share/runtime/entrypoints/stage.entrypoint.ts");
        const imported = readFileSync(fileURLToPath(entrypoint), "utf8")
            .split("\n")
            .filter((line) => line.startsWith(IMPORT_OPEN) && line.endsWith(SHEET_SUFFIX + IMPORT_CLOSE))
            .map((line) => line.slice(IMPORT_OPEN.length, -IMPORT_CLOSE.length))
            .map((specifier) =>
                specifier.startsWith(".")
                    ? fileURLToPath(new URL(specifier, entrypoint))
                    : fileURLToPath(import.meta.resolve(specifier)),
            );
        const fingerprinted = STAGE_SHEETS.map((sheet) => fileURLToPath(import.meta.resolve(sheet)));
        expect(imported.toSorted()).toStrictEqual(fingerprinted.toSorted());
        expect(pathToFileURL(fingerprinted[0] ?? "").protocol).toBe("file:");
    });
});
