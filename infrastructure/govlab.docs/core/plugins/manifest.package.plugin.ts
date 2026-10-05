import { DEFAULT_DELIVERY, DELIVERY_MODES } from "#configuration/constants/manifest.constants";
import type { ManifestPlugin } from "#types/manifest.types";
import { deliverMode } from "#configuration/strings/manifest.strings";

const SECTION = "deliverAs";
const MODE_SEPARATOR = " | ";

export const plugin: ManifestPlugin = {
    contribute(manifest, entry) {
        entry[SECTION] = manifest[SECTION] ?? DEFAULT_DELIVERY;
    },
    name: "delivery",
    section: {
        keys: [SECTION],
        validate(manifest) {
            const deliverAs = manifest[SECTION];
            if (deliverAs === undefined || (typeof deliverAs === "string" && DELIVERY_MODES.has(deliverAs))) {
                return [];
            }
            return [deliverMode([...DELIVERY_MODES].join(MODE_SEPARATOR))];
        },
    },
};
