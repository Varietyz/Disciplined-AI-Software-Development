import { join, sep } from "node:path";
import type { FolderSync } from "#types/folder.types";
import { existsSync } from "node:fs";
import { memberMissing } from "#configuration/strings/coordination.strings";
import { shippedEntries } from "#core/loaders/coordination.loader";
import { syncFolder } from "#core/persistence/folder.persistence";

export const supplyCoordination = async function supplyCoordination(from: string, to: string): Promise<FolderSync> {
    if (!existsSync(from)) {
        throw new Error(memberMissing(from));
    }
    const shipped = shippedEntries(from).map((entry) => join(from, entry));
    return syncFolder(from, to, (source) =>
        shipped.some((entry) => source === entry || source.startsWith(entry + sep)),
    );
};
